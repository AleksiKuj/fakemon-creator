import FakemonCard from "./FakemonCard"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import fakemonService from "../services/fakemon"
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

const FakemonView = () => {
  const [fakemon, setFakemon] = useState()
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
      fakemonService.setToken(user.token)
    }
  }, [setUser])

  const likeFakemon = async () => {
    try {
      await fakemonService.like(fakemon.id)
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
    const getFakemon = async () => {
      try {
        const response = await fakemonService.getOne(id)
        setFakemon(response.fakemon)
        setLikes(response.fakemon.likes)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    getFakemon()
  }, [])

  useEffect(() => {
    if (fakemon) document.title = `Fakémon - ${fakemon.name}`
  }, [fakemon])

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

  if (!loading && !fakemon) {
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
            <FakemonCard fakemon={fakemon} />
            <Box onClick={(e) => handleClick(e)}>
              <CardBack fakemon={fakemon} />
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
            <Text>{fakemon.name} </Text>
            <img
              src={require(`../images/${fakemon.type}.png`)}
              alt={fakemon.type}
              width="40px"
            />
          </Stack>
          <Text>hp {fakemon.stats.hp}</Text>
          <Progress
            colorScheme="red"
            hasStripe
            value={fakemon.stats.hp}
            w="50%"
          />
          <Text>attack {fakemon.stats.attack}</Text>
          <Progress
            colorScheme="orange"
            hasStripe
            value={fakemon.stats.attack}
            w="50%"
          />
          <Text>defense {fakemon.stats.defense}</Text>
          <Progress
            colorScheme="yellow"
            hasStripe
            value={fakemon.stats.defense}
            w="50%"
          />
          <Text>special-attack {fakemon.stats.specialAttack}</Text>
          <Progress
            colorScheme="blue"
            hasStripe
            value={fakemon.stats.specialAttack}
            w="50%"
          />
          <Text>special-defense {fakemon.stats.specialDefense}</Text>
          <Progress
            colorScheme="green"
            hasStripe
            value={fakemon.stats.specialDefense}
            w="50%"
          />
          <Text>speed {fakemon.stats.speed}</Text>
          <Progress
            colorScheme="pink"
            hasStripe
            value={fakemon.stats.speed}
            w="50%"
          />
          <Text>intelligence {fakemon.stats.intelligence}</Text>
          <Progress
            colorScheme="teal"
            hasStripe
            value={fakemon.stats.intelligence}
            w="50%"
          />
          <Text>aggression {fakemon.stats.aggression}</Text>
          <Progress
            colorScheme="red"
            hasStripe
            value={fakemon.stats.aggression}
            w="50%"
          />
        </Stack>
      </SimpleGrid>
    </Box>
  )
}
export default FakemonView
