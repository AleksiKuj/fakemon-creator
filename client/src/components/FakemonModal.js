import fakemonService from "../services/fakemon"
import FakemonCard from "./card/FakemonCard"
import {
  Box,
  Button,
  Text,
  SimpleGrid,
  Center,
  useColorModeValue,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react"
import Loader from "./Loader"
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

const FakemonModal = ({ user,buttonText,onSubmit,modalHeader, buttonIcon }) => {
  const [fakemons, setFakemons] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("createdAt")

  const [selectedFakemon, setSelectedFakemon] = useState()

  const buttonColorScheme = useColorModeValue("blue", "purple")
  const { isOpen, onOpen, onClose } = useDisclosure()

  const borderColorScheme = useColorModeValue("black", "white")

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

  return (
    <>
      <Button
        leftIcon={buttonIcon}
        colorScheme={buttonColorScheme}
        variant="solid"
        onClick={onOpen}
      >
        {buttonText}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size={["sm", "md", "xl", "2xl"]}>
        <ModalOverlay />
        <ModalContent>
          
          <ModalHeader textAlign="center">{modalHeader}</ModalHeader>
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
              <Loader/>
            ) : (
              fakemons.length === 0 ? <Text textAlign="center">No Fakémon found</Text> :
                <SimpleGrid columns={[2, 2, 3, 3, 4, 4]} spacing={5}>
                  {fakemons.map((fakemon) => (
                    <Box
                      cursor="pointer"
                      key={fakemon.id}
                      onClick={() => setSelectedFakemon(fakemon)}
                      border={selectedFakemon && selectedFakemon.id === fakemon.id ? "3px solid" : "none"}
                      borderColor={borderColorScheme}
                      borderRadius="md"
                      w="155px"
                      m={1}
                      _hover={{
                        color:"red"
                      }}
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
              onClick={()=>onSubmit(selectedFakemon)}
              isDisabled={selectedFakemon ? false : true}
            >
              {buttonText}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
export default FakemonModal
