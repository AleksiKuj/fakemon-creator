const Joi = require("joi")

const userJoiSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(5).max(50).required(),
})

module.exports = { userJoiSchema }
