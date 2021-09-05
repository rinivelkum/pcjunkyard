const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const Product = require('../models/product')
const sharp = require('sharp')
const multer = require('multer')
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
})
const jwt = require('jsonwebtoken')
const resize = require('../middleware/resize')

router.get('/users/login', async (req, res) => {
  res.render('login')
})

router.get('/users/create', async (req, res) => {
  res.render('create')
})

module.exports = router
