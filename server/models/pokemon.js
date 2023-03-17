const mongoose = require("mongoose")

const PokemonSchema = new mongoose.Schema({
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
  pokemonStats: {
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
  },
})
PokemonSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})
const Pokemon = mongoose.model("Pokemon", PokemonSchema)

module.exports = Pokemon
