const mongoose = require('mongoose')
const validator = require('validator')

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
  age: {
    type: Number,
    required: true,
    min: [0, 'Varsta nu poate fi negativa'],
    max: [110, 'Varsta nu poate fi mai mare decat 110'],
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
})

module.exports = userSchema
