const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Introduceti un email valid!')
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('parola')) {
        throw new Error('Parola nu poate include "parola"')
      }
    },
    min: [6, 'Parola trebuie sa contina minim 6 caractere!'],
  },

  basket: { type: Map, default: new Map() },
})

userSchema.methods.generateAuthToken = async function (minutes) {
  const user = this
  const token = jwt.sign(
    {
      password: user.password,
    },
    process.env.JWT_SECRET,
    { expiresIn: `${minutes}m` }
  )
  return token
}

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
}

userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Unable to login')
  }

  return user
}

const User = mongoose.model('User', userSchema)

module.exports = User
