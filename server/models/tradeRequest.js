// models/TradeRequest.js
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const tradeRequestSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderFakemon: {
    type: Schema.Types.ObjectId,
    ref: "Fakemon",
    required: true,
  },
  receiverFakemon: {
    type: Schema.Types.ObjectId,
    ref: "Fakemon",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("TradeRequest", tradeRequestSchema)
