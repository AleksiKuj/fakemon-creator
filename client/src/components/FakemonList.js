import { useEffect, useState } from "react"
import fakemonService from "../services/fakemon"
import FakemonCard from "./card/FakemonCard"
import {
  Box,
  Button,
  Text,
  SimpleGrid,
  Spinner,
  Center,
  useColorModeValue,
  Link,
  Flex,
} from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import Select from "react-select"
import { sortOptions } from "../utils/selectOptions"

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

const FakemonList = () => {
  const [fakemons, setFakemons] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("createdAt")

  useEffect(() => {
    setLoading(true)
    const getFakemon = async () => {
      try {
        const response = await fakemonService.getAll(page, sortBy)
        setFakemons(response.fakemon)
        setTotalPages(response.totalPages)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    getFakemon()

    page === 1 ? document.title = "Fakémon - View all creations"  :
    document.title = `Fakémon - Page ${page}`
  }, [page, sortBy])

  useEffect(() => {
    setPage(1)
  }, [sortBy])

  const changePage = (direction) => {
    if (direction === "previous" && page > 1) setPage(page - 1)
    if (direction === "next" && page < totalPages) setPage(page + 1)
  }

  return (
    <Box py={5}>
      <Buttons changePage={changePage} page={page} totalPages={totalPages} />
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
        <SimpleGrid columns={[1, 1, 2, 3, 3, 4]} spacing={5}>
          {fakemons.map((fakemon) => (
            <Link
              as={RouterLink}
              to={`/fakemon/${fakemon.id}`}
              key={fakemon.id}
              px={0}
              mx={0}
              maxW="350px"
              margin="auto"
              _hover={{
                textDecoration: "none",
              }}
            >
              <FakemonCard fakemon={fakemon} />
            </Link>
          ))}
        </SimpleGrid>
      )}
      <Buttons changePage={changePage} page={page} totalPages={totalPages} />
    </Box>
  )
}

export default FakemonList
