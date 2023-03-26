import { useEffect, useState } from "react"
import tradeService from "../../services/trade"
import { Text, Flex, SimpleGrid, Heading } from "@chakra-ui/react"
import TradeOffer from "./TradeOffer"

const TradeOffers = ({ user }) => {
  const [tradeOffers, setTradeOffers] = useState("")
  const [refreshTradeOffers, setRefreshTradeOffers] = useState(false)

  const getTradeOffers = async (user) => {
    try {
      const response = await tradeService.getTradeOffers(user.id)
      setTradeOffers(response)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (user) {
      getTradeOffers(user)
    }
  }, [user, refreshTradeOffers])

  if (!user) return <Text textAlign="center">Log in to use trade offers</Text>

  return (
    <>
      <Heading textAlign="center" as="h2" fontSize="2xl" py={5}>
        Active trade offers
      </Heading>
      <Flex maxW="80vw" justifyContent="center" direction="column">
        <SimpleGrid
          columns={[1, 1, 2, 2, 3]}
          spacing={5}
          justifyContent="center"
        >
          {tradeOffers &&
            tradeOffers.map((tradeOffer) => (
              <TradeOffer
                tradeOffer={tradeOffer}
                key={tradeOffer._id}
                refreshTradeOffers={refreshTradeOffers}
                setRefreshTradeOffers={setRefreshTradeOffers}
              />
            ))}
        </SimpleGrid>
      </Flex>
    </>
  )
}
export default TradeOffers
