import { useEffect, useState } from "react"
import tradeService from "../services/trade"
import { Text, Box, Center, Flex, SimpleGrid } from "@chakra-ui/react"
import TradeOffer from "./TradeOffer"
const TradeOffers = ({ user }) => {
  const [tradeOffers, setTradeOffers] = useState("")
  useEffect(() => {
    const getTradeOffers = async (user) => {
      try {
        const response = await tradeService.getTradeOffers(user.id)
        console.log("respdata", response)
        setTradeOffers(response)
      } catch (error) {
        console.log(error)
      }
    }

    if (user) {
      getTradeOffers(user)
    }
  }, [user])

  if (!user) return <Text textAlign="center">Log in to use trade offers</Text>

  return (
    <>
      <Text textAlign="center">Active trade offers</Text>
      <Flex maxW="80vw" justifyContent="center" direction="column">
        <SimpleGrid
          columns={[1, 1, 2, 2, 3]}
          spacing={5}
          justifyContent="center"
        >
          {tradeOffers &&
            tradeOffers.map((tradeOffer) => (
              <TradeOffer tradeOffer={tradeOffer} key={tradeOffer._id} />
            ))}
        </SimpleGrid>
      </Flex>
    </>
  )
}
export default TradeOffers
