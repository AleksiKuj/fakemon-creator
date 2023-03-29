import {
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Stack,
  useToast,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import fakemonService from "../../services/fakemon"
import tradeService from "../../services/trade"
import FakemonCard from "../card/FakemonCard"
import { ArrowRightIcon,DeleteIcon } from "@chakra-ui/icons"

const TradeOffer = ({
  tradeOffer,
  refreshTradeOffers,
  setRefreshTradeOffers,
}) => {
  const [receiverFakemon, setReceiverFakemon] = useState()
  const [senderFakemon, setSenderFakemon] = useState()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

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

  const deleteOffer = async () => {
    console.log("delete")
    console.log(tradeOffer)
    try {
      const response = await tradeService.deleteTradeOffer(tradeOffer._id)
      console.log(response)
      onClose()
      toast({
        position: "top",
        description: "Trade offer deleted",
        status: "success",
        isClosable: true,
        duration: 3000,
      })
      setRefreshTradeOffers(!refreshTradeOffers)
    } catch (error) {
      toast({
        position: "top",
        description: "Error deleting trade offer :(",
        status: "error",
        isClosable: true,
        duration: 3000,
      })
    }
  }

  if (!receiverFakemon || !senderFakemon) return null
  return (
    <Flex direction="column" gap={3}>
      <Flex alignItems="center" gap={2} justifyContent="center" maxW="100%">
        <FakemonCard fakemon={senderFakemon} thumbnail />
        <ArrowRightIcon />
        <FakemonCard fakemon={receiverFakemon} thumbnail />
      </Flex>
      <Button leftIcon={<DeleteIcon/>} onClick={onOpen} colorScheme="red">
        Delete
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Delete trade offer?</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Stack direction="row" margin="auto">
              <Button
                colorScheme="blue"
                variant="ghost"
                mr={3}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button leftIcon={<DeleteIcon/>} variant="solid" colorScheme="red" onClick={deleteOffer}>
                Delete
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  )
}
export default TradeOffer
