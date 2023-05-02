const router = require("express").Router()
const Counter = require("../models/counter")

router.get("/", async (req, res) => {
  try {
    const counter = await Counter.findById("fakemonCounter")
    const count = counter.count
    res.status(200).json({count})
  } catch (error) {
    console.log(error)
    res.status(400).json({ error })
  }
})

module.exports = router