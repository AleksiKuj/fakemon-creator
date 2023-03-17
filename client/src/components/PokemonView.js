import PokemonCard from "./PokemonCard"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import pokemonService from "../services/pokemon"
import CardBack from "./CardBack"
import {
  Box,
  Center,
  Button,
  useColorModeValue,
  useToast,
  Progress,
  Stack,
  Text,
  SimpleGrid,
} from "@chakra-ui/react"
import { CopyIcon } from "@chakra-ui/icons"
import ReactCardFlip from "react-card-flip"

const PokemonView = () => {
  const [pokemon, setPokemon] = useState()
  const [isFlipped, setIsFlipped] = useState(true)
  const { id } = useParams()
  const toast = useToast()

  const buttonColorScheme = useColorModeValue("blue", "purple")

  useEffect(() => {
    const getPokemon = async () => {
      try {
        const response = await pokemonService.getOne(id)
        console.log(response)
        setPokemon(response.pokemon)
      } catch (error) {
        console.error(error)
      }
    }
    getPokemon()
  }, [])
  useEffect(() => {
    if (pokemon) document.title = `Fakémon - ${pokemon.name}`
  }, [pokemon])

  const handleClick = (e) => {
    e.preventDefault()
    setIsFlipped(!isFlipped)
    console.log("click")
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied to clipboard.",
      status: "success",
      duration: 5000,
      isClosable: true,
    })
  }

  if (!pokemon) {
    return (
      <Text textAlign="center" fontSize="lg" fontWeight="semibold">
        Fakémon not found
      </Text>
    )
  }

  return (
    <Box py={5}>
      <SimpleGrid columns={[1, 1, 2]} spacing={[2, 2, 0]}>
        <ReactCardFlip
          isFlipped={isFlipped}
          flipDirection="horizontal"
          flipSpeedBackToFront={1}
        >
          <PokemonCard pokemon={pokemon} />
          <Box onClick={(e) => handleClick(e)}>
            <CardBack pokemon={pokemon} />
          </Box>
        </ReactCardFlip>
        <Stack
          textTransform="uppercase"
          fontWeight="bold"
          alignItems={"center"}
          width="100%"
        >
          <Stack direction="row" textAlign="center" alignItems="center">
            <Text>{pokemon.name} </Text>
            <img
              src={require(`../images/${pokemon.type}.png`)}
              alt={pokemon.type}
              width="40px"
            />
          </Stack>
          <Text>hp {pokemon.pokemonStats.hp}</Text>
          <Progress
            colorScheme="red"
            hasStripe
            value={pokemon.pokemonStats.hp}
            w="50%"
          />
          <Text>attack {pokemon.pokemonStats.attack}</Text>
          <Progress
            colorScheme="orange"
            hasStripe
            value={pokemon.pokemonStats.attack}
            w="50%"
          />
          <Text>defense {pokemon.pokemonStats.defense}</Text>
          <Progress
            colorScheme="yellow"
            hasStripe
            value={pokemon.pokemonStats.defense}
            w="50%"
          />
          <Text>special-attack {pokemon.pokemonStats.specialAttack}</Text>
          <Progress
            colorScheme="blue"
            hasStripe
            value={pokemon.pokemonStats.specialAttack}
            w="50%"
          />
          <Text>special-defense {pokemon.pokemonStats.specialDefense}</Text>
          <Progress
            colorScheme="green"
            hasStripe
            value={pokemon.pokemonStats.specialDefense}
            w="50%"
          />
          <Text>speed {pokemon.pokemonStats.speed}</Text>
          <Progress
            colorScheme="pink"
            hasStripe
            value={pokemon.pokemonStats.speed}
            w="50%"
          />
        </Stack>
      </SimpleGrid>
      <Center py="5">
        <Button
          leftIcon={<CopyIcon />}
          colorScheme={buttonColorScheme}
          variant="solid"
          onClick={() => handleCopy()}
        >
          Share
        </Button>
      </Center>
    </Box>
  )
}
export default PokemonView
