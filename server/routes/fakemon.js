const express = require("express")
const router = express.Router()
const Fakemon = require("../models/fakemon")
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

//get all fakemon
router.get("/", async (req, res) => {
  // default to page 1 if no query parameter provided
  const page = parseInt(req.query.page) || 1
  // default to 10 items per page if no query parameter provided
  const limit = parseInt(req.query.limit) || 8
  //items before startIndex are not fetched
  const startIndex = (page - 1) * limit
  try {
    let fakemon

    if (req.query.sortBy === "likes") {
      fakemon = await Fakemon.find({})
        .sort({ likes: -1 })
        .skip(startIndex)
        .limit(limit)
    } else {
      fakemon = await Fakemon.find({})
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit)
    }

    //Count the number of Fakemon in database
    const totalFakemon = await Fakemon.countDocuments({})

    const totalPages = Math.ceil(totalFakemon / limit)

    res.status(200).json({
      fakemon,
      page,
      totalPages,
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error })
  }
})

//get all by single user
router.get("/:userId/fakemons", async (req, res) => {
  // default to page 1 if no query parameter provided
  const page = parseInt(req.query.page) || 1
  // default to 10 items per page if no query parameter provided
  const limit = parseInt(req.query.limit) || 8
  //items before startIndex are not fetched
  const startIndex = (page - 1) * limit
  try {
    let fakemon

    if (req.query.sortBy === "likes") {
      fakemon = await Fakemon.find({ user: req.params.userId })
        .sort({ likes: -1 })
        .skip(startIndex)
        .limit(limit)
    } else {
      fakemon = await Fakemon.find({ user: req.params.userId })
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit)
    }

    //Count the number of Fakemon in database created by this user
    const totalFakemon = await Fakemon.countDocuments({
      user: req.params.userId,
    })

    const totalPages = Math.ceil(totalFakemon / limit)

    res.status(200).json({
      fakemon,
      page,
      totalPages,
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error })
  }
})

//get one fakemon
router.get("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const fakemon = await Fakemon.findById(id)
    res.status(200).json({ fakemon })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error })
  }
})

//generate random fakemon
router.post("/", async (req, res) => {
  const type = req.body.type || "Water"
  const style = req.body.style || "3D"
  const gen = req.body.gen || "5"
 

  let rarity 
  const rand = Math.random()
  //common 50%, uncommon 30%, rare 15%, legendary 5%
  if (rand < 0.5) {
    rarity = "Common"
  } else if (rand < 0.8) {
    rarity = "Uncommon"
  } else if (rand< 0.95){
    rarity = "Rare"
  } else{
    rarity = "Legendary"
  }
 
  //minimum value for stats, eg. Legendary stats always >= 75
  const rarityMultiplier = {
    Common: 20,
    Uncommon: 35,
    Rare: 50,
    Legendary: 80,
  }

  const randomStat = (multiplier) => Math.floor(Math.random() * (100 - multiplier) + multiplier + 1)
  const rarityBasedMultiplier = rarityMultiplier[rarity]

  // used for intelligence and aggression levels in ai prompts
  const tier = (stat, string)=>{
    if (stat <= 25){
      return `very low ${string}`
    }
    else if (stat <= 50){
      return `lower than average ${string}`
    }
    else if (stat <= 75){
      return `high ${string}`
    }
    else  {
      return `extremely high ${string}`
    }
  }
  const intelligence = req.body.intelligence || randomStat(0)
  const aggression = req.body.aggression || randomStat(0)

  const stats = {
    hp: randomStat(rarityBasedMultiplier),
    attack: randomStat(rarityBasedMultiplier),
    defense: randomStat(rarityBasedMultiplier),
    specialAttack: randomStat(rarityBasedMultiplier),
    specialDefense: randomStat(rarityBasedMultiplier),
    speed: randomStat(rarityBasedMultiplier),
    intelligence,
    aggression
  }

  try {
    const nameResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Generate a new one word name for a ${rarity} ${type} type fake pokemon 
            who has ${tier(intelligence,"intelligence")} and ${tier(aggression,"aggression")}. 
           Do not have any other text or symbols such as "." in the answer.`,
        },
      ],
      max_tokens: 300, //sets max length of prompt + answer based on tokens
      temperature: 1.7, //0-2, higher values make answers more random
    })
    const name = nameResponse.data.choices[0].message.content

    const abilityResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Create a very short one sentence ability and a name for it for a ${rarity} ${type} type pokemon ${name} 
            who has ${tier(intelligence,"intelligence")} and ${tier(aggression,"aggression")}.
          If you use the word "Pokemon" in the bio replace it with "Fakémon".
          Answer in the following format. Abilityname - abilitydescription.`,
        },
      ],
      max_tokens: 1500, //sets max length of prompt + answer based on tokens
      temperature: 1.5, //0-2, higher values make answers more random
    })
    const ability = abilityResponse.data.choices[0].message.content
    const bioResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Generate a short one sentence bio for a ${rarity} ${type} type fake pokemon ${name} 
            who has ${tier(intelligence,"intelligence")} and ${tier(aggression,"aggression")}.
          If you use the word "Pokemon" in the bio replace it with "Fakémon".`,
        },
      ],
      max_tokens: 1000, //sets max length of prompt + answer based on tokens
      temperature: 1.5, //0-2, higher values make answers more random
    })
    const bio = bioResponse.data.choices[0].message.content

    const imageResponse = await openai.createImage({
      prompt: `${style} portrait of ${rarity} ${type} type pokemon named ${name} who has ${tier(intelligence,"intelligence")} and ${tier(aggression,"aggression")}
      , in style of gen ${gen} pokemon`,
      n: 1,
      size: "512x512",
    })
    const imageUrl = imageResponse.data.data[0].url

    res.status(200).json({ name, ability, bio, imageUrl, type, stats, rarity })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error })
  }
})

//save fakemon
router.post("/new", userExtractor, async (req, res) => {
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
    const fakemon = new Fakemon({
      name: body.name,
      ability: body.ability,
      bio: body.bio,
      imageUrl: savedImageUrl,
      type: body.type,
      stats: body.stats,
      rarity: body.rarity,
      likes: 0,
    })

    //if user is logged in, save fakemon to users data
    if (user) {
      fakemon.user = user._id
      const savedFakemon = await fakemon.save()

      user.createdFakemon = user.createdFakemon.concat(savedFakemon._id)

      // Check if the user has earned any badges for creating a new fakemon
      if (user.createdFakemon.length === 1) {
        user.badges.push({
          name: "First Fakemon Created",
        })
      } else if (user.createdFakemon.length === 5) {
        user.badges.push({
          name: "5 Fakemon Created",
        })
      } else if (user.createdFakemon.length === 10) {
        user.badges.push({
          name: "10 Fakemon Created",
        })
      }
      await user.save()
      res.status(200).json(savedFakemon)
    } else {
      const savedFakemon = await fakemon.save()
      res.status(200).json(savedFakemon)
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ error })
  }
})

// like
router.put("/:id/like", userExtractor, async (req, res) => {
  const id = req.params.id

  try {
    const user = req.user
    console.log(user)
    if (!user) {
      return response.status(401).json({ error: "not authenticated" })
    }

    const fakemon = await Fakemon.findById(id)
    if (!fakemon) {
      return res.status(404).json({ message: "Fakemon not found" })
    }

    //can only like if user hasn't liked already
    if (user.likedFakemon.includes(id)) {
      return res.status(403).json({ message: "Fakemon already liked" })
    } else {
      fakemon.likes += 1
      const savedFakemon = await fakemon.save()
      user.likedFakemon = user.likedFakemon.concat(savedFakemon._id)
      await user.save()

      res.status(200).json(savedFakemon)
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
})

module.exports = router
