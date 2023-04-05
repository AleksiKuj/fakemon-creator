import { useParams } from "react-router-dom"
import FakemonCard from "../card/FakemonCard"
import { useState, useEffect } from "react"
import fakemonService from "../../services/fakemon"
import battleService from "../../services/battle"
import CardBack from "../card/CardBack"
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
  Heading,
  Flex
} from "@chakra-ui/react"
import { CopyIcon } from "@chakra-ui/icons"
import { FaRegThumbsUp } from "react-icons/fa"
import ReactCardFlip from "react-card-flip"
import TradeScreen from "../trade/TradeScreen"
  
const BattleView =()=>{
  const [attacker, setAttacker] = useState()
  const [defender, setDefender] = useState()
  const [battle, setBattle] = useState()
  const [attackerId,setAttackerId] = useState()
  const [defenderId,setDefenderId] = useState()
  const [loading,setLoading] = useState(true)
  const [turn,setTurn] = useState(1)
  const [maxTurns, setMaxTurns] = useState(1)
  const [history,setHistory] = useState([])
  const [currentTurn,setCurrentTurn] = useState(0)

  const { id } = useParams()
  const toast = useToast()

  useEffect(() => {
    const getBattle = async () => {
      try {
        const response = await battleService.getBattle(id)
        setBattle(response.battle)
        setMaxTurns(response.battle.history.length)
        setAttackerId(response.battle.attacker)
        setDefenderId(response.battle.defender)
        setHistory(response.battle.history)
        console.log(response.battle)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    getBattle()
  }, [])

  useEffect(()=>{
    const getFakemon = async()=>{
      if(!battle) return
      try{
        const response1 = await fakemonService.getOne(attackerId)
        const response2 = await fakemonService.getOne(defenderId)
        setAttacker(response1.fakemon)
        setDefender(response2.fakemon)
      }catch(error){
        console.log(error)
      }
    }
    getFakemon()
  },[battle])

  useEffect(()=>{
    setCurrentTurn(turn-1)
  },[turn])

  const changeTurn = (direction)=>{
    if(turn < maxTurns && direction === "next"){
      setTurn(turn+1)
    }
    if(turn > 1 && direction === "previous"){
      setTurn(turn-1)
    }
  }

  const effectiviness = (attackEffectiviness)=>{
    if(attackEffectiviness === "super effective") return "It was super effective!"
    if(attackEffectiviness === "not very effective") return "It was not very effective!"
    else return
  }

  const ability = (name)=>{
    if(name === defender.name){
      return defender.ability.slice(0, defender.ability.indexOf("-"))
    } else{
      return  attacker.ability.slice(0, attacker.ability.indexOf("-"))
    }
  }

  const winner = ()=>{
    return battle.winner === defenderId ? defender.name : attacker.name
  }

  if(!battle || !attacker || !defender) return null

  return (
    <Box>
      <Stack direction="column" textAlign="center">
        <Heading as="h2" fontSize="4xl">
          {attacker.name} vs {defender.name}
        </Heading>
        <Text>Turn {turn}</Text>
        <Text> <b>{history[currentTurn].fakemonName}</b> used {history[currentTurn].attackType === "basic" ? "basic attack"
          : <b>{ability(history[currentTurn].fakemonName)}</b> } for {history[currentTurn].damage} damage!</Text>
        <Text>{effectiviness(history[currentTurn].attackEffectiviness)}</Text>
        <Text>{attacker.name} {history[currentTurn].attackerHp > 0 ? history[currentTurn].attackerHp : 0}HP  
         - {history[currentTurn].defenderHp > 0 ? history[currentTurn].defenderHp : 0 }HP {defender.name}  </Text>
        {turn === maxTurns &&<Text>{winner()} is victorious!</Text>}
        <Flex direction="row" gap={5} justifyContent="center" py={2}>
          <Button onClick={()=>changeTurn("previous")}>Previous</Button>
          <Button onClick={()=>changeTurn("next")}>Next</Button>
        </Flex>
      </Stack>
     
      <SimpleGrid columns={[1, 1, 2]} spacing={[2, 2, 0]}>
        <Box>
          <FakemonCard fakemon={attacker} />
        </Box>
        <Box>
          <FakemonCard fakemon={defender} />
        </Box>
      </SimpleGrid>
    </Box>
  )
}
export default BattleView