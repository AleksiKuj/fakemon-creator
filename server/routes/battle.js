const express = require("express")
const router = express.Router()
const Fakemon = require("../models/fakemon")
const User = require("../models/user")
const Battle = require("../models/battle")
const { userExtractor } = require("../utils/middleware")
const {typeEffectiveness} = require("../utils/typeEffectiviness")

const calculateDamage = (attacker, defender)=> {
  const attack = attacker.stats.attack
  const defense = defender.stats.defense

  const effectiveness = typeEffectiveness[attacker.type.toLowerCase()][defender.type.toLowerCase()] || 1
  
  const rand = ()=> Math.random() * (100 - 50) + 50
  const damage = Math.round(((attack / (defense*0.5))/50 * rand() +2) * effectiveness )

  const attackEffectiviness = () =>{
    if (effectiveness === 0.5) return "Not very effective"
    if (effectiveness === 1.5) return "Super effective"
    else return "Normal effectiviness"
  }
  return {damage,attackEffectiviness}
}

const simulateBattle = (fakemon1, fakemon2)=>{
  let fakemon1Hp = fakemon1.stats.hp
  let fakemon2Hp = fakemon2.stats.hp
  const history = []
  console.log("battling")
  while (fakemon1Hp > 0 && fakemon2Hp > 0) {
    // Turn 1: Fakemon1 attacks Fakemon2

    // const {damage,attackEffectiviness} = calculateDamage(fakemon1,fakemon2)
    const damage1 = calculateDamage(fakemon1,fakemon2).damage
    fakemon2Hp -= damage1
    history.push({
      fakemonName:fakemon1.name,
      turn: history.length + 1,
      action: "attack",
      fakemonId: fakemon1._id,
      damage: damage1,
      defenderHp:fakemon1Hp,
      attackerHp:fakemon2Hp,
      attackEffectiviness:calculateDamage(fakemon1,fakemon2).attackEffectiviness()
    })
   
    if (fakemon2Hp <= 0) break
  
    // Turn 2: Fakemon2 attacks Fakemon1
    const damage2 = calculateDamage(fakemon2,fakemon1).damage
    //  const damage2 = calculateDamage(fakemon2,fakemon1)

    fakemon1Hp -= damage2
    history.push({
      fakemonName:fakemon2.name,
      turn: history.length + 1,
      action: "attack",
      fakemonId: fakemon2._id,
      damage: damage2,
      defenderHp:fakemon1Hp,
      attackerHp:fakemon2Hp,
      attackEffectiviness:calculateDamage(fakemon2,fakemon1).attackEffectiviness()
    })
    if (fakemon1Hp <= 0) break
  }
  const winner = fakemon1Hp > 0 ? fakemon1 : fakemon2
  const loser = winner === fakemon1 ? fakemon2 : fakemon1

  return { winner, history,loser }
}
  
router.post("/", async (req, res) => {

  const attackerId = req.body.attackerId
  const defenderId = req.body.defenderId
  //   const attackerId = "64293b09c04f4a7eb90a897e"
  //   const defenderId = "6425ae2d077208eba6301fea"


  try {
    const attacker = await Fakemon.findById(attackerId)
    const defender = await Fakemon.findById(defenderId)

    if (!attacker || !defender) {
      return res.status(400).json({ message: "One or both Fakemons not found" })
    }
    
    const { winner, history,loser } = simulateBattle(attacker, defender)


    const newBattle = new Battle({
      attacker: attacker._id,
      defender: defender._id,
      winner: winner._id,
      status: "completed",
      history,
    })

    await newBattle.save()

    winner.battles.totalBattles +=1
    winner.battles.battlesWon +=1

    loser.battles.totalBattles +=1
    loser.battles.battlesLost +=1
    
    await winner.save()
    await loser.save()

    res.status(201).json(newBattle)
  } catch (error) {
    res.status(500).json({ message: "Error creating battle", error })
  }


  //   try {
  //     let fakemon
  
  //     if (req.query.sortBy === "likes") {
  //       fakemon = await Fakemon.find({})
  //         .sort({ likes: -1 })
  //         .skip(startIndex)
  //         .limit(limit)
  //     } else {
  //       fakemon = await Fakemon.find({})
  //         .sort({ createdAt: -1 })
  //         .skip(startIndex)
  //         .limit(limit)
  //     }
  
  //     //Count the number of Fakemon in database
  //     const totalFakemon = await Fakemon.countDocuments({})
  
  //     const totalPages = Math.ceil(totalFakemon / limit)
  
//     res.status(200).json({
//       fakemon,
//       page,
//       totalPages,
//     })
//   } catch (error) {
//     console.log(error)
//     res.status(400).json({ error })
//   }
})

module.exports = router