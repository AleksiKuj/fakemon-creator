import { useEffect, useState } from "react"
import pokemonService from "../services/pokemon"
import PokemonCard from "./PokemonCard"
import {
  Box,
  Button,
  Stack,
  Text,
  SimpleGrid,
  Spinner,
  Center,
  useColorModeValue,
  Link,
} from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"

const PokemonList = () => {
  const [pokemons, setPokemons] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const buttonColorScheme = useColorModeValue("blue", "purple")

  useEffect(() => {
    setLoading(true)
    const getPokemon = async () => {
      try {
        const response = await pokemonService.getAll(page)
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
  }, [page])

  const changePage = (direction) => {
    if (direction === "previous" && page > 1) setPage(page - 1)
    if (direction === "next" && page < totalPages) setPage(page + 1)
    console.log(page)
  }

  return (
    <Box py={5}>
      <Stack
        direction="row"
        gap={5}
        py={5}
        justifyContent="center"
        align="center"
      >
        <Button
          colorScheme={buttonColorScheme}
          onClick={() => changePage("previous")}
        >
          Previous
        </Button>
        <Text>Page {page}</Text>
        <Button
          colorScheme={buttonColorScheme}
          onClick={() => changePage("next")}
        >
          Next
        </Button>
      </Stack>
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
              to={`/pokemon/${pokemon.id}`}
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
      <Stack
        direction="row"
        gap={5}
        py={5}
        justifyContent="center"
        align="center"
      >
        <Button
          colorScheme={buttonColorScheme}
          onClick={() => changePage("previous")}
        >
          Previous
        </Button>
        <Text>Page {page}</Text>
        <Button
          colorScheme={buttonColorScheme}
          onClick={() => changePage("next")}
        >
          Next
        </Button>
      </Stack>
    </Box>
  )
}

export default PokemonList
