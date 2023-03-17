require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
mongoose.set("strictQuery", false)
const cors = require("cors")
const app = express()
const pokemon = require("./routes/pokemon")

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("connected to MongoDB")
  } catch (error) {
    console.log(error)
  }
}
connect()

app.use(express.json())
app.use(cors())
app.use("/api/pokemon", pokemon)

const PORT = process.env.port || 3001

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})
