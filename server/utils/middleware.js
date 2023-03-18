const User = require("../models/user")
const jwt = require("jsonwebtoken")

const getTokenFrom = (request) => {
  const authorization = request.get("authorization")
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "")
  }
  return null
}

const tokenExtractor = (request, response, next) => {
  request.token = getTokenFrom(request)
  next()
}

const userExtractor = async (request, response, next) => {
  const token = getTokenFrom(request)

  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET)
      request.user = await User.findById(decodedToken.id)
      next()
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return response.status(401).json({ error: "invalid token" })
      }

      next(error)
    }
  } else {
    next()
  }
}
module.exports = { tokenExtractor, userExtractor }
