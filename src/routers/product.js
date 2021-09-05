const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const Product = require('../models/product')
const jwt = require('jsonwebtoken')
require('mongoose')
const multer = require('multer')
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
})
const resize = require('../middleware/resize')

router.get('/', async (req, res) => {
  res.render('homepage')
})

router.get('/:cat', async (req, res) => {
  res.render('products')
})

module.exports = router
