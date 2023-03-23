const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: String,
  password: String,
  passwordHash: String,
  likedFakemon: [
    {
      type: Schema.Types.ObjectId,
      ref: "Pokemon",
    },
  ],
  createdFakemon: [
    {
      type: Schema.Types.ObjectId,
      ref: "Pokemon",
    },
  ],
  badges: [
    {
      name: String,
      description: String,
    },
  ],
})

//replaces _id object with string and removes __v from displaying
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model("User", userSchema)
