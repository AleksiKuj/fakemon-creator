import fakemonService from "../services/fakemon"
import battleService from "../services/battle"
import FakemonCard from "./card/FakemonCard"
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

import Select from "react-select"
import { sortOptions } from "../utils/selectOptions"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

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

const FakemonModal = ({ fakemon, user,buttonText,onSubmit,modalHeader, buttonIcon }) => {
  const [fakemons, setFakemons] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("createdAt")

  const [selectedFakemon, setSelectedFakemon] = useState()

  const buttonColorScheme = useColorModeValue("blue", "purple")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const navigate = useNavigate()

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

  const handleBattle = async () => {
    const defenderId = fakemon.id
    const attackerId = selectedFakemon.id
    const details = {
      attackerId,
      defenderId
    }

    try {
      const response = await battleService.battle(details)
      toast.closeAll()
      navigate(`/battle/${response._id}`)
      console.log(response)
    } catch (error) {
      toast.closeAll()
      if(error.response && error.response.data && error.response.data.message && error.response.data.message){
        console.log(error.response.data.message)
        {
          toast({
            position: "top",
            description: error.response.data.message,
            status: "error",
            isClosable: true,
            duration: 3000,
          })
        }
      } else {
        toast({
          position: "top",
          description: "Unkown error while initiating battle :(",
          status: "error",
          isClosable: true,
          duration: 3000,
        })
      }
    }
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
              fakemons.length === 0 ? <Text textAlign="center">No Fakémon found</Text> :
                <SimpleGrid columns={[2, 2, 3, 3, 4, 4]} spacing={5}>
                  {fakemons.map((fakemon) => (
                    <Box
                      cursor="pointer"
                      key={fakemon.id}
                      onClick={() => setSelectedFakemon(fakemon)}
                      border={selectedFakemon && selectedFakemon.id === fakemon.id ? "2px solid" : "none"}
                      borderColor={borderColorScheme}
                      borderRadius="md"
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
            {/* <Button
              colorScheme="purple"
              onClick={handleBattle}
              isDisabled={selectedFakemon ? false : true}
            >
              Battle!
            </Button> */}
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
