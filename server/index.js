require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
mongoose.set("strictQuery", false)
const cors = require("cors")
const app = express()
const bodyParser = require("body-parser")
const path = require("path")
const fakemonRouter = require("./routes/fakemon")
const usersRouter = require("./routes/users")
const tradeRouter = require("./routes/trade")
const battleRouter = require("./routes/battle")
const http = require("http")
const User = require("./models/user")
const Fakemon = require("./models/fakemon")

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
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "build")))

app.use("/api/fakemon", fakemonRouter)
app.use("/api/users", usersRouter)
app.use("/api/trade", tradeRouter)
app.use("/api/battle", battleRouter)

// async function updateFakemon() {
//   try {
//     const result = await Fakemon.updateMany({}, {
//       battles: {
//         totalBattles: 0,
//         battlesWon: 0,
//         battlesLost: 0,
//         battledFakemon: []
//       }}
//     )
//     console.log(result)
//   } catch (error) {
//     console.log(error)
//   }
// }

// updateFakemon()

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
