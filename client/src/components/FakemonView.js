import FakemonCard from "./card/FakemonCard"
import { useState, useEffect } from "react"
import { useParams,useNavigate } from "react-router-dom"
import fakemonService from "../services/fakemon"
import battleService from "../services/battle"
import tradeService from "../services/trade"
import CardBack from "./card/CardBack"
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
import { FaRegThumbsUp,FaExchangeAlt } from "react-icons/fa"
import {GiCrossedSwords} from "react-icons/gi"
import ReactCardFlip from "react-card-flip"
import FakemonModal from "./FakemonModal"

const FakemonView = ({ user }) => {
  const [fakemon, setFakemon] = useState()
  const [likes, setLikes] = useState(0)
  const [isFlipped, setIsFlipped] = useState(true)
  const { id } = useParams()
  const toast = useToast()
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const buttonColorScheme = useColorModeValue("blue", "purple")

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
          title: "Error",
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

  const handleBattle = async (selectedFakemon) => {
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
        console.log(error)
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

  const handleTrade = async (selectedFakemon) => {
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
        setTimeout(()=>{
          window.location.reload(false)
        },500)
        
      } else {
        toast({
          position: "top",
          description: "Trade offer sent!",
          status: "success",
          isClosable: true,
          duration: 3000,
        })
        navigate("/tradeoffers")
      }
    } catch (error) {
      console.log(error)
      toast.closeAll()
      if (
        error.response.data.message ===
        "You can only have one active trade offer per Fakemon."
      ) {
        toast({
          position: "top",
          description: error.response.data.message,
          status: "error",
          isClosable: true,
          duration: 3000,
        })
      } else {
        toast({
          position: "top",
          description: "Error sending trade offer :(",
          status: "error",
          isClosable: true,
          duration: 3000,
        })
      }
    }
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
          <Center py={3}>
            
            
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
                <>
                  {/* OPEN TRADE SCREEN */}
                  {user.id !== fakemon.user[0] && fakemon.user[0] && (
                    <FakemonModal fakemon={fakemon} user={user} buttonIcon={<FaExchangeAlt />}
                      buttonText="Trade" modalHeader="Trade offer" 
                      onSubmit={handleTrade} />
                  )}
                
                  {/* BATTLE SCREEN */}
                  <FakemonModal fakemon={fakemon} user={user} buttonIcon={<GiCrossedSwords />}
                    buttonText="Battle" modalHeader="Pick challenger"
                    onSubmit={handleBattle} />
                  
                  <Button
                    leftIcon={<FaRegThumbsUp />}
                    colorScheme={buttonColorScheme}
                    variant="solid"
                    onClick={() => likeFakemon()}
                  >
                    Like {likes}
                  </Button>
                </>
              )}
              
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
          <Text textAlign="center" textTransform="uppercase">battle record: ({fakemon.battles.battlesWon}W - {fakemon.battles.battlesLost}L)</Text>

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
