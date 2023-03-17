require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
mongoose.set("strictQuery", false)
const cors = require("cors")
const app = express()
const path = require("path")
const pokemon = require("./routes/pokemon")
const http = require("http")

let mongoUrl
if (process.env.NODE_ENV === "prod") {
  mongoUrl = process.env.MONGODB_URI
} else {
  mongoUrl = process.env.MONGODB_DEV_URI
}
const connect = async () => {
  try {
    await mongoose.connect(mongoUrl)
    console.log("connected to MongoDB")
  } catch (error) {
    console.log(error)
  }
}
connect()

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, "build")))

app.use("/api/pokemon", pokemon)

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build/index.html"), function (err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

const server = http.createServer(app)
const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})
