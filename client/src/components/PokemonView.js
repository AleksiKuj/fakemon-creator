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
  Tooltip,
  Spinner,
} from "@chakra-ui/react"
import { CopyIcon } from "@chakra-ui/icons"
import { FaRegThumbsUp } from "react-icons/fa"
import ReactCardFlip from "react-card-flip"

const PokemonView = () => {
  const [pokemon, setPokemon] = useState()
  const [likes, setLikes] = useState(0)
  const [isFlipped, setIsFlipped] = useState(true)
  const { id } = useParams()
  const toast = useToast()
  const [user, setUser] = useState("")
  const [loading, setLoading] = useState(true)

  const buttonColorScheme = useColorModeValue("blue", "purple")

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("fakemonUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      pokemonService.setToken(user.token)
    }
  }, [setUser])

  const likeFakemon = async () => {
    try {
      await pokemonService.like(pokemon.id)
      setLikes(likes + 1)
    } catch (error) {
      console.error(error)
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "Fakemon already liked"
      ) {
        toast.closeAll()
        toast({
          position: "top",
          title: `Error`,
          description: "Can only like once",
          status: "error",
          isClosable: true,
          duration: 3000,
        })
        return
      }
    }
  }

  useEffect(() => {
    const getPokemon = async () => {
      try {
        const response = await pokemonService.getOne(id)
        setPokemon(response.pokemon)
        setLikes(response.pokemon.likes)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
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

  if (loading) {
    return (
      <Center>
        <Spinner
          thickness="10px"
          speed="0.8s"
          emptyColor="red.600"
          color="blue.600"
          size="xl"
        />
      </Center>
    )
  }

  if (!loading && !pokemon) {
    return <Text textAlign="center">Oops! Fakemon not found</Text>
  }

  return (
    <Box py={5}>
      <SimpleGrid columns={[1, 1, 2]} spacing={[2, 2, 0]}>
        <Box>
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
          <Center py={5}>
            <Stack direction="row" alignItems="center">
              <Button
                leftIcon={<CopyIcon />}
                colorScheme={buttonColorScheme}
                variant="solid"
                onClick={() => handleCopy()}
              >
                Share
              </Button>
              {!user ? (
                <Tooltip label="Must be signed in to like">
                  <Button
                    leftIcon={<FaRegThumbsUp />}
                    colorScheme={buttonColorScheme}
                    variant="solid"
                    onClick={() => likeFakemon()}
                    isDisabled={true}
                  >
                    Like
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  leftIcon={<FaRegThumbsUp />}
                  colorScheme={buttonColorScheme}
                  variant="solid"
                  onClick={() => likeFakemon()}
                >
                  Like
                </Button>
              )}

              <Text>{likes}</Text>
            </Stack>
          </Center>
        </Box>
        <Stack
          textTransform="uppercase"
          fontWeight="bold"
          alignItems={"center"}
          width="100%"
          fontSize="lg"
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
    </Box>
  )
}
export default PokemonView
