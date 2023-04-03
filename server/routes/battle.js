const express = require("express")
const router = express.Router()
const Fakemon = require("../models/fakemon")
const User = require("../models/user")
const { userExtractor } = require("../utils/middleware")
const Battle = require("../models/battle")
const {typeEffectiveness} = require("../utils/typeEffectiviness")

const calculateDamage = (attacker, defender,attackType)=> {
  const attack = attacker.stats.attack
  const defense = defender.stats.defense
  const specialAttack = attacker.stats.specialAttack
  const specialDefense = defender.stats.specialDefense

  const effectiveness = typeEffectiveness[attacker.type.toLowerCase()][defender.type.toLowerCase()] || 1
  
  const rand = ()=> Math.random() * (100 - 50) + 50

  let damage
  attackType ==="special" ? damage = Math.round(((specialAttack / (specialDefense*0.3))/40 * rand() +2) * effectiveness )
    : damage = Math.round(((attack / (defense*0.5))/50 * rand() +2) * effectiveness )

  const attackEffectiviness = () =>{
    if (effectiveness === 0.5) return "Not very effective"
    if (effectiveness === 1.5) return "Super effective"
    else return "Normal effectiviness"
  }
  return {damage,attackEffectiviness}
}

const getRandomAttackType = () => {
  const rand = Math.random()
  return rand < 0.5 ? "special" : "basic"
}


const simulateBattle = (fakemon1, fakemon2)=>{
  let fakemon1Hp = fakemon1.stats.hp
  let fakemon2Hp = fakemon2.stats.hp
  const history = []

  while (fakemon1Hp > 0 && fakemon2Hp > 0) {
    // Turn 1: Fakemon1 attacks Fakemon2
    const attackType1 = getRandomAttackType()

    const damage1 = calculateDamage(fakemon1,fakemon2,attackType1).damage

    fakemon2Hp -= damage1
    history.push({
      fakemonName:fakemon1.name,
      turn: history.length + 1,
      action: "attack",
      fakemonId: fakemon1._id,
      damage: damage1,
      defenderHp:fakemon1Hp,
      attackerHp:fakemon2Hp,
      attackEffectiviness:calculateDamage(fakemon1,fakemon2).attackEffectiviness(),
      attackType:attackType1
    })
   
    if (fakemon2Hp <= 0) break
  
    const attackType2 = getRandomAttackType()

    const damage2 = calculateDamage(fakemon2,fakemon1,attackType2).damage
    // Turn 2: Fakemon2 attacks Fakemon1
  
    fakemon1Hp -= damage2
    history.push({
      fakemonName:fakemon2.name,
      turn: history.length + 1,
      action: "attack",
      fakemonId: fakemon2._id,
      damage: damage2,
      defenderHp:fakemon1Hp,
      attackerHp:fakemon2Hp,
      attackEffectiviness:calculateDamage(fakemon2,fakemon1).attackEffectiviness(),
      attackType:attackType2
    })
    if (fakemon1Hp <= 0) break
  }
  const winner = fakemon1Hp > 0 ? fakemon1 : fakemon2
  const loser = winner === fakemon1 ? fakemon2 : fakemon1

  return { winner, history,loser }
}
  
router.post("/",userExtractor, async (req, res) => {
  const attackerId = req.body.attackerId
  const defenderId = req.body.defenderId
  
  if(!req.user) return res.status(400).json({message:"Unauthorized"})

  if (attackerId === defenderId) return res.status(400).json({message:"Can't battle yourself"})
  let attacker
  let defender

  try{
    attacker = await Fakemon.findById(attackerId)
    defender = await Fakemon.findById(defenderId)
  }catch(error){
    res.status(404).json({ message: "Fakemon not found" })
  }

  let user
  try {
    user = await User.findById(req.user.id)
  }catch(error){
    res.status(400).json({message:"User not found"})
  }
  if(!user.createdFakemon.includes(attackerId)){
    return res
      .status(400)
      .json({ message: "User does not own the specified Fakemon" })
  }

  const existingBattle = await Battle.findOne({
    $or: [{ attacker: attackerId, defender:defenderId }],
  })
  if (existingBattle) {
    return res.status(400).json({
      message: "You can only attack the same Fakemon once with each Fakemon.",
    })
  }
    
  try{
    
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
})

module.exports = router