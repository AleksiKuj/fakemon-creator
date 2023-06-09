import { useParams } from "react-router-dom"
import FakemonCard from "../card/FakemonCard"
import { useState, useEffect } from "react"
import fakemonService from "../../services/fakemon"
import battleService from "../../services/battle"
import {
  Box,
  Button,
  Stack,
  Text,
  SimpleGrid,
  Heading,
  Flex
} from "@chakra-ui/react"
import Loader from "../Loader"
  
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

  useEffect(() => {
    const getBattle = async () => {
      try {
        const response = await battleService.getBattle(id)
        setBattle(response.battle)
        setMaxTurns(response.battle.history.length)
        setAttackerId(response.battle.attacker)
        setDefenderId(response.battle.defender)
        setHistory(response.battle.history)
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

  const skip =()=> setTurn(maxTurns)

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

  useEffect(()=>{
    document.title = "Fakémon - Battle"
  },[])

  if(loading) return <Loader/>
  if(!battle || !attacker || !defender){
    return(<Heading as="h2" textAlign="center">Battle not found</Heading>)
  }

  return (
    <Box>
      <Stack direction="column" textAlign="center">
        <Heading as="h2" fontSize="4xl">
          {attacker.name} vs {defender.name}
        </Heading>
        <Flex direction="row" gap={5} justifyContent="center" py={2}>
          <Button onClick={()=>changeTurn("previous")}>Previous</Button>
          <Button onClick={()=>changeTurn("next")}>Next</Button>
          <Button onClick={()=>skip()}>Skip</Button>
        </Flex>
        <Text>Turn {turn}</Text>
        <Text> <b>{history[currentTurn].fakemonName}</b> used {history[currentTurn].attackType === "basic" ? "basic attack"
          : <b>{ability(history[currentTurn].fakemonName)}</b> } for {history[currentTurn].damage} damage!</Text>
        <Text>{effectiviness(history[currentTurn].attackEffectiviness)}</Text>
        <Text>{attacker.name} {history[currentTurn].attackerHp > 0 ? history[currentTurn].attackerHp : 0}HP  
         - {history[currentTurn].defenderHp > 0 ? history[currentTurn].defenderHp : 0 }HP {defender.name}  </Text>
        {turn === maxTurns &&<Text> <b>{winner()}</b> is victorious!</Text>}
        
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