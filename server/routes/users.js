const jwt = require("jsonwebtoken")
const router = require("express").Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")
const { userJoiSchema } = require("../utils/validationSchemas")

const validateUser = (request, response, next) => {
  const result = userJoiSchema.validate(request.body)
  if (result.error) {
    response
      .status(400)
      .json(result.error.details.map((el) => el.message).join(","))
    return console.log(result.error.details.map((el) => el.message).join(","))
  } else {
    next()
  }
}

//create new user
router.post("/register", validateUser, async (request, response) => {
  const { username, password } = request.body

  const userExists = await User.findOne({ username })

  if (userExists) {
    return response.json("user already exists")
  }
  const saltRounds = 12
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash,
  })

  const savedUser = await user.save()
  response.json(savedUser)
})

//login
router.post("/login", async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.json("invalid username or password")
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  //   //token expires in 30 days
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: "30 days",
  })
  response.status(200).send({ token, username: user.username, id: user.id })
})

//get all created fakemon by user
router.get("/:id/fakemon", async (req, response) => {
  const userId = req.params.id
  const user = await User.findById(userId)

  response.status(200).send({ createdFakemon: user.createdFakemon })
})

module.exports = router
