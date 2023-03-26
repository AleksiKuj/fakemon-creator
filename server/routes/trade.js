const router = require("express").Router()
const User = require("../models/user")
const TradeRequest = require("../models/tradeRequest")
const Fakemon = require("../models/fakemon")
const { userExtractor } = require("../utils/middleware")

//get all users trade offers
router.get("/:userId/tradeoffers", userExtractor, async (req, res) => {
  const user = req.user
  const userId = user.id

  if (!userId) {
    return res.status(400).json({ message: "Missing user id" })
  }

  try {
    const tradeOffers = await TradeRequest.find({ sender: userId }).exec()

    res.status(200).json(tradeOffers)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Internal server error" })
  }
})

//send trade offer
router.post("/", userExtractor, async (req, res) => {
  const { receiverId, senderFakemonId, receiverFakemonId } = req.body
  const user = req.user

  if (!user) {
    return res.status(400).json({ message: "unauthorized" })
  }

  const senderId = user.id
  console.log(senderId, receiverId, senderFakemonId, receiverFakemonId)

  if (!senderId || !receiverId || !senderFakemonId || !receiverFakemonId) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  let sender
  let receiver
  try {
    sender = await User.findById(senderId).exec()
    receiver = await User.findById(receiverId).exec()
  } catch (error) {
    return res.status(404).json({ message: "User not found" })
  }

  //make sure they actually own the pokemon
  if (
    !sender.createdFakemon.includes(senderFakemonId) ||
    !receiver.createdFakemon.includes(receiverFakemonId)
  ) {
    return res
      .status(400)
      .json({ message: "User does not own the specified Fakemon" })
  }

  try {
    const existingFakemonTradeOffer = await TradeRequest.findOne({
      $or: [{ senderFakemon: senderFakemonId, status: "pending" }],
    })
    if (existingFakemonTradeOffer) {
      return res.status(400).json({
        message: "You can only have one active trade offer per Fakemon.",
      })
    }

    //Check if there's a pending trade request from the receiver to the sender with the same Fakemons
    const existingRequest = await TradeRequest.findOne({
      sender: receiverId,
      receiver: senderId,
      senderFakemon: receiverFakemonId,
      receiverFakemon: senderFakemonId,
      status: "pending",
    })
    if (existingRequest) {
      // Execute the trade and remove the trade request
      await executeTrade(
        senderId,
        receiverId,
        senderFakemonId,
        receiverFakemonId
      )
      await existingRequest.deleteOne()
      res.status(200).json({ message: "Trade completed successfully" })
    } else {
      // Create a new trade request
      const newRequest = new TradeRequest({
        sender: senderId,
        receiver: receiverId,
        senderFakemon: senderFakemonId,
        receiverFakemon: receiverFakemonId,
      })
      await newRequest.save()
      res.status(200).json({ message: "Trade request sent" })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Internal server error" })
  }
})

const executeTrade = async (
  senderId,
  receiverId,
  senderFakemonId,
  receiverFakemonId
) => {
  const sender = await User.findById(senderId).exec()
  const receiver = await User.findById(receiverId).exec()
  const senderFakemon = await Fakemon.findById(senderFakemonId).exec()
  const receiverFakemon = await Fakemon.findById(receiverFakemonId).exec()

  // Perform the trade
  sender.createdFakemon.pull(senderFakemonId)
  receiver.createdFakemon.pull(receiverFakemonId)
  sender.createdFakemon.push(receiverFakemonId)
  receiver.createdFakemon.push(senderFakemonId)

  // Update Fakemons' user field
  senderFakemon.user = receiverId
  receiverFakemon.user = senderId

  await sender.save()
  await receiver.save()
  await senderFakemon.save()
  await receiverFakemon.save()
}

router.delete("/:tradeOfferId", userExtractor, async (req, res) => {
  const { tradeOfferId } = req.params
  console.log(tradeOfferId)
  const user = req.user

  if (!tradeOfferId) {
    return res
      .status(400)
      .json({ message: "Missing required field: tradeOfferId" })
  }

  if (!user) {
    return res.status(400).json({ message: "Unauthorized" })
  }

  try {
    const tradeOffer = await TradeRequest.findById(tradeOfferId)

    const senderIdString = tradeOffer.sender.toString()

    if (senderIdString !== user.id) {
      return res.status(400).json({ message: "Unauthorized" })
    }
    if (!tradeOffer) {
      return res.status(404).json({ message: "Trade offer not found" })
    }

    await tradeOffer.deleteOne()
    res.status(200).json({ message: "Trade offer deleted successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Internal server error" })
  }
})
module.exports = router
