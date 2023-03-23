const express = require("express")
const router = express.Router()
const Pokemon = require("../models/pokemon")
const User = require("../models/user")
const { userExtractor } = require("../utils/middleware")
const cloudinary = require("cloudinary").v2
const { Configuration, OpenAIApi } = require("openai")

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

const cloudinaryOptions = {
  folder: "/fakemon",
}

//get all pokemon
router.get("/", async (req, res) => {
  // default to page 1 if no query parameter provided
  const page = parseInt(req.query.page) || 1
  // default to 10 items per page if no query parameter provided
  const limit = parseInt(req.query.limit) || 8
  //items before startIndex are not fetched
  const startIndex = (page - 1) * limit
  try {
    let pokemon

    if (req.query.sortBy === "likes") {
      pokemon = await Pokemon.find({})
        .sort({ likes: -1 })
        .skip(startIndex)
        .limit(limit)
    } else {
      pokemon = await Pokemon.find({})
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit)
    }

    //Count the number of Pokemon in database
    const totalPokemon = await Pokemon.countDocuments({})

    const totalPages = Math.ceil(totalPokemon / limit)

    res.status(200).json({
      pokemon,
      page,
      totalPages,
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error })
  }
})

//get all by single user
router.get("/:userId/pokemons", async (req, res) => {
  // default to page 1 if no query parameter provided
  const page = parseInt(req.query.page) || 1
  // default to 10 items per page if no query parameter provided
  const limit = parseInt(req.query.limit) || 8
  //items before startIndex are not fetched
  const startIndex = (page - 1) * limit
  try {
    let pokemon

    if (req.query.sortBy === "likes") {
      pokemon = await Pokemon.find({ user: req.params.userId })
        .sort({ likes: -1 })
        .skip(startIndex)
        .limit(limit)
    } else {
      pokemon = await Pokemon.find({ user: req.params.userId })
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit)
    }

    //Count the number of Pokemon in database created by this user
    const totalPokemon = await Pokemon.countDocuments({
      user: req.params.userId,
    })

    const totalPages = Math.ceil(totalPokemon / limit)

    res.status(200).json({
      pokemon,
      page,
      totalPages,
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error })
  }
})

//get one pokemon
router.get("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const pokemon = await Pokemon.findById(id)
    res.status(200).json({ pokemon })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error })
  }
})

//generate random pokemon
router.post("/", async function (req, res) {
  const type = req.body.type || "Water"
  const style = req.body.style || "3D"
  const gen = req.body.gen || "5"

  const randomStat = () => Math.floor(Math.random() * 100 + 1)
  const intelligence = req.body.intelligence || randomStat()
  const aggression = req.body.aggression || randomStat()

  //common 60%, uncommon 30%, rare 10%
  let rarity
  const rand = Math.random()
  if (rand < 0.6) {
    rarity = "Common"
  } else if (rand < 0.9) {
    rarity = "Uncommon"
  } else {
    rarity = "Rare"
  }

  //random value between 1-100 for stats

  try {
    const nameResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Generate a new one word name for pokemon that is of type ${type} 
            who has an intelligence level of ${intelligence} and aggression level of ${aggression} (scale 1-100). 
           Do not have any other text or symbols such as "." in the answer.`,
        },
      ],
      max_tokens: 300, //sets max length of prompt + answer based on tokens
      temperature: 1.0, //0-2, higher values make answers more random
    })
    const name = nameResponse.data.choices[0].message.content

    const abilityResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Create a one sentence ability and a name for it for ${type} type pokemon ${name} 
            who has an intelligence level of ${intelligence} and aggression level of ${aggression} (scale 1-100).
          If you use the word "Pokemon" in the bio replace it with "Fakémon".
          Answer in the following format. Abilityname - abilitydescription.`,
        },
      ],
      max_tokens: 1500, //sets max length of prompt + answer based on tokens
      temperature: 1.0, //0-2, higher values make answers more random
    })
    const ability = abilityResponse.data.choices[0].message.content
    const bioResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Generate a short one sentence bio for ${type} type fake pokemon ${name} 
            who has an intelligence level of ${intelligence} and aggression level of ${aggression} (scale 1-100). Do not reference the levels directly.
          If you use the word "Pokemon" in the bio replace it with "Fakémon".`,
        },
      ],
      max_tokens: 1000, //sets max length of prompt + answer based on tokens
      temperature: 1.0, //0-2, higher values make answers more random
    })
    const bio = bioResponse.data.choices[0].message.content

    const imageResponse = await openai.createImage({
      prompt: `${style} portrait of pokemon named ${name} who has an intelligence level of ${intelligence} and aggression level of ${aggression} (scale 1-100)
      , in style of gen ${gen} pokemon.`,
      n: 1,
      size: "512x512",
    })
    const imageUrl = imageResponse.data.data[0].url

    const pokemonStats = {
      hp: randomStat(),
      attack: randomStat(),
      defense: randomStat(),
      specialAttack: randomStat(),
      specialDefense: randomStat(),
      speed: randomStat(),
      intelligence,
      aggression,
    }
    res
      .status(200)
      .json({ name, ability, bio, imageUrl, type, pokemonStats, rarity })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error })
  }
})

//save pokemon
router.post("/new", userExtractor, async function (req, res) {
  const body = req.body
  const imageUrl = body.imageUrl
  let savedImageUrl

  const user = req.user

  try {
    await cloudinary.uploader.upload(
      imageUrl,
      cloudinaryOptions,
      function (error, result) {
        if (error) {
          console.error(error)
        } else {
          savedImageUrl = result.secure_url
        }
      }
    )
    const pokemon = new Pokemon({
      name: body.name,
      ability: body.ability,
      bio: body.bio,
      imageUrl: savedImageUrl,
      type: body.type,
      pokemonStats: body.pokemonStats,
      rarity: body.rarity,
      likes: 0,
    })

    //if user is logged in, save fakemon to users data
    if (user) {
      pokemon.user = user._id
      const savedPokemon = await pokemon.save()

      user.createdFakemon = user.createdFakemon.concat(savedPokemon._id)
      await user.save()
      res.status(200).json(savedPokemon)
    } else {
      const savedPokemon = await pokemon.save()
      res.status(200).json(savedPokemon)
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ error })
  }
})

// like
router.put("/:id/like", userExtractor, async function (req, res) {
  const id = req.params.id

  try {
    const user = req.user
    console.log(user)
    if (!user) {
      return response.status(401).json({ error: "not authenticated" })
    }

    const pokemon = await Pokemon.findById(id)
    if (!pokemon) {
      return res.status(404).json({ message: "Pokemon not found" })
    }

    //can only like if user hasn't liked already
    if (user.likedFakemon.includes(id)) {
      return res.status(403).json({ message: "Fakemon already liked" })
    } else {
      pokemon.likes += 1
      const savedPokemon = await pokemon.save()
      user.likedFakemon = user.likedFakemon.concat(savedPokemon._id)
      await user.save()

      res.status(200).json(savedPokemon)
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
})

module.exports = router
