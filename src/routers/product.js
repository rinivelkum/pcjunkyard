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
const admins = require('../utils/constants/admins')

router.get('/', auth, async (req, res) => {
  res.render('homepage', {
    loggedIn: req.user ? true : false,
    basketItems: req.user ? req.user.basket.length : 0,
    admin: req.user ? admins.has(req.user.email) : false,
  })
})

router.get('/:cat', auth, async (req, res) => {
  res.render('products', {
    loggedIn: req.user ? true : false,
    basketItems: req.user ? req.user.basket.length : 0,
    admin: req.user ? admins.has(req.user.email) : false,
  })
})

router.get('/placi-video/:prodName', auth, async (req, res) => {
  res.render('product', {
    loggedIn: req.user ? true : false,
    basketItems: req.user ? req.user.basket.length : 0,
    admin: req.user ? admins.has(req.user.email) : false,
  })
})

router.get('/add/item', auth, async (req, res) => {
  if (req.user) {
    if (admins.has(req.user.email)) {
      res.render('addProduct', {
        loggedIn: true,
        basketItems: req.user ? req.user.basket.length : 0,
        admin: true,
      })
    } else {
      res.redirect('/')
    }
  } else {
    res.redirect('/')
  }
})

module.exports = router
