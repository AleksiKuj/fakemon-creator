const mongoose = require("mongoose")

const FakemonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ability: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    stats: {
      hp: {
        type: Number,
        required: true,
      },
      attack: {
        type: Number,
        required: true,
      },
      defense: {
        type: Number,
        required: true,
      },
      specialAttack: {
        type: Number,
        required: true,
      },
      specialDefense: {
        type: Number,
        required: true,
      },
      speed: {
        type: Number,
        required: true,
      },
      intelligence: {
        type: Number,
        required: true,
      },
      aggression: {
        type: Number,
        required: true,
      },
    },
    rarity: { type: String, required: true },
    likes: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    battles: {
      totalBattles: { type: Number, default: 0 },
      battlesWon: { type: Number, default: 0 },
      battlesLost: { type: Number, default: 0 },
      battledFakemon: [{ type: mongoose.Schema.Types.ObjectId, ref: "Fakemon" }]
    },
  },
  { timestamps: true }
)
FakemonSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})
const Fakemon = mongoose.model("Fakemon", FakemonSchema)

module.exports = Fakemon
