const mongoose = require("mongoose")

const BattleSchema = new mongoose.Schema(
  {
    attacker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fakemon",
      required: true,
    },
    defender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fakemon",
      required: true,
    },
    turn: { type: Number, default: 1 },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fakemon",
    },
    status: {
      type: String,
      enum: ["ongoing", "completed"],
      default: "ongoing",
    },
    history: [
      {
        turn: Number,
        action: String,
        fakemonId: mongoose.Schema.Types.ObjectId,
        fakemonName:String,
        damage:Number,
        attackerHp:Number,
        defenderHp:Number,
        attackEffectiviness:String
      },
    ],
  },
  { timestamps: true }
)

const Battle = mongoose.model("Battle", BattleSchema)

module.exports = Battle