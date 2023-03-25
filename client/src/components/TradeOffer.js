import { Flex } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import fakemonService from "../services/fakemon"
import FakemonCard from "./FakemonCard"
import { ArrowRightIcon } from "@chakra-ui/icons"
const TradeOffer = ({ tradeOffer }) => {
  const [receiverFakemon, setReceiverFakemon] = useState()
  const [senderFakemon, setSenderFakemon] = useState()

  useEffect(() => {
    const getFakemon = async () => {
      try {
        const receiverResponse = await fakemonService.getOne(
          tradeOffer.receiverFakemon
        )
        const senderResponse = await fakemonService.getOne(
          tradeOffer.senderFakemon
        )

        setReceiverFakemon(receiverResponse.fakemon)
        setSenderFakemon(senderResponse.fakemon)
      } catch (error) {
        console.error(error)
      }
    }
    getFakemon()
  }, [])

  if (!receiverFakemon || !senderFakemon) return null
  return (
    <Flex alignItems="center" gap={2} justifyContent="center" maxW="100%">
      <FakemonCard fakemon={senderFakemon} thumbnail />
      <ArrowRightIcon />
      <FakemonCard fakemon={receiverFakemon} thumbnail />
    </Flex>
  )
}
export default TradeOffer
