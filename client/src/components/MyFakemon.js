import { useEffect, useState } from "react"
import pokemonService from "../services/pokemon"
import PokemonCard from "./PokemonCard"
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
  useToast,
} from "@chakra-ui/react"
import { CopyIcon } from "@chakra-ui/icons"
import { Link as RouterLink, useParams } from "react-router-dom"
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

const MyFakemon = () => {
  const [pokemons, setPokemons] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("createdAt")

  const { id } = useParams()
  const shareButtonColor = useColorModeValue("blue", "purple")
  const toast = useToast()
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied to clipboard.",
      status: "success",
      duration: 5000,
      isClosable: true,
    })
  }

  useEffect(() => {
    setLoading(true)
    const getPokemon = async () => {
      try {
        const response = await pokemonService.getAllFromUser(page, sortBy, id)
        setPokemons(response.pokemon)
        setTotalPages(response.totalPages)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    getPokemon()
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
      {pokemons.length === 0 ? (
        <Text textAlign="center" fontSize="xl" py={5}>
          Looks like this user has no Fakémon, click
          <Link as={RouterLink} to="/createfakemon">
            <b> here </b>
          </Link>
          to create.
        </Text>
      ) : (
        <>
          <Center>
            <Button
              leftIcon={<CopyIcon />}
              colorScheme={shareButtonColor}
              variant="ghost"
              _hover={{
                bg: "rgba(0, 0, 0, 0.09)",
              }}
              onClick={() => handleCopy()}
            >
              Share profile
            </Button>
          </Center>
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
            <SimpleGrid columns={[1, 1, 2, 3, 3, 4]} spacing={5}>
              {pokemons.map((pokemon) => (
                <Link
                  as={RouterLink}
                  to={`/fakemon/${pokemon.id}`}
                  key={pokemon.id}
                  px={0}
                  mx={0}
                  maxW="350px"
                  margin="auto"
                  _hover={{
                    textDecoration: "none",
                  }}
                >
                  <PokemonCard pokemon={pokemon} />
                </Link>
              ))}
            </SimpleGrid>
          )}
          <Buttons
            changePage={changePage}
            page={page}
            totalPages={totalPages}
          />
        </>
      )}
    </Box>
  )
}

export default MyFakemon
