import fakemonService from "../services/fakemon"
import tradeService from "../services/trade"
import FakemonCard from "./FakemonCard"
import {
  Box,
  Button,
  Text,
  SimpleGrid,
  Spinner,
  Center,
  useColorModeValue,
  Flex,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react"
import { FaExchangeAlt } from "react-icons/fa"
import Select from "react-select"
import { sortOptions } from "../utils/selectOptions"
import { useState, useEffect } from "react"

const Buttons = ({ changePage, page, totalPages }) => {
  const buttonColorScheme = useColorModeValue("blue", "purple")
  return (
    <Flex direction="row" gap={5} py={5} justifyContent="center" align="center">
      <Button
        colorScheme={buttonColorScheme}
        onClick={() => changePage("previous")}
        isDisabled={page === 1 ? true : false}
        w="5.5rem"
      >
        Previous
      </Button>
      <Text>Page {page}</Text>
      <Button
        colorScheme={buttonColorScheme}
        onClick={() => changePage("next")}
        isDisabled={page === totalPages ? true : false}
        w="5.5rem"
      >
        Next
      </Button>
    </Flex>
  )
}

const TradeScreen = ({ fakemon, user }) => {
  const [fakemons, setFakemons] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("createdAt")

  const [selectedFakemon, setSelectedFakemon] = useState()

  const buttonColorScheme = useColorModeValue("blue", "purple")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  useEffect(() => {
    setLoading(true)

    const getFakemon = async () => {
      try {
        const response = await fakemonService.getAllFromUser(
          page,
          sortBy,
          user.id
        )
        setFakemons(response.fakemon)
        setTotalPages(response.totalPages)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    getFakemon()
  }, [page, sortBy, user])

  useEffect(() => {
    setPage(1)
  }, [sortBy])

  const changePage = (direction) => {
    if (direction === "previous" && page > 1) setPage(page - 1)
    if (direction === "next" && page < totalPages) setPage(page + 1)
  }

  const handleTrade = async () => {
    const receiverId = fakemon.user[0]
    const receiverFakemonId = fakemon.id
    const senderFakemonId = selectedFakemon.id
    const details = {
      receiverId,
      senderFakemonId,
      receiverFakemonId,
    }

    try {
      const response = await tradeService.trade(details)
      toast.closeAll()

      if (response.message === "Trade completed successfully") {
        toast({
          position: "top",
          description: response.message,
          status: "success",
          isClosable: true,
          duration: 3000,
        })
      } else {
        toast({
          position: "top",
          description: "Trade offer sent!",
          status: "success",
          isClosable: true,
          duration: 3000,
        })
        onClose()
        setSelectedFakemon()
      }
      onClose()
    } catch (error) {
      toast({
        position: "top",
        description: "Error sending trade offer :(",
        status: "error",
        isClosable: true,
        duration: 3000,
      })
    }
  }

  return (
    <>
      <Button
        leftIcon={<FaExchangeAlt />}
        colorScheme={buttonColorScheme}
        variant="solid"
        onClick={onOpen}
      >
        Trade
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size={["sm", "md", "xl", "2xl"]}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Trade offer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text textAlign="center">
              {selectedFakemon && `${selectedFakemon.name} selected`}
            </Text>
            <Buttons
              changePage={changePage}
              page={page}
              totalPages={totalPages}
            />
            <Center color="black" pb={5}>
              <Select
                options={sortOptions}
                onChange={(e) => setSortBy(e.value)}
                noOptionsMessage={() => null}
                clearValueOnReset={false}
                placeholder="Sort by"
              />
            </Center>
            {loading ? (
              <Center>
                <Spinner
                  thickness="10px"
                  speed="0.8s"
                  emptyColor="red.600"
                  color="blue.600"
                  size="xl"
                />
              </Center>
            ) : (
              <SimpleGrid columns={[2, 2, 3, 3, 4, 4]} spacing={5}>
                {fakemons.map((fakemon) => (
                  <Box
                    cursor="pointer"
                    key={fakemon.id}
                    onClick={() => setSelectedFakemon(fakemon)}
                  >
                    <FakemonCard fakemon={fakemon} thumbnail />
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              onClick={handleTrade}
              isDisabled={selectedFakemon ? false : true}
            >
              Send trade offer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
export default TradeScreen
