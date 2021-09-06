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
const admins = require('../utils/constants/admins')
// Login page
router.get('/users/login', auth, async (req, res) => {
  res.render('login', {
    loggedIn: req.user ? true : false,
    basketItems: req.user ? req.user.basket.length : 0,
    admin: req.user ? admins.has(req.user.email) : false,
  })
})

// Sign up page
router.get('/users/create', auth, async (req, res) => {
  if (req.user != null) {
    res.redirect('/')
  }
  res.render('create')
})

// Checkout your items
router.get('/users/checkout', auth, async (req, res) => {
  if (req.user == null) {
    res.redirect('/users/login')
  } else {
    res.render('checkout', {
      loggedIn: true,
      basketItems: req.user ? req.user.basket.length : 0,
      admin: req.user ? admins.has(req.user.email) : false,
    })
  }
})

// Create account
router.post('/users/create', upload.fields([]), async (req, res) => {
  const user = new User({
    name: req.body.firstName + ' ' + req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  })

  try {
    await user.save()
    const token = await user.generateAuthToken('60')
    res.cookie('Authorization', token, { maxAge: 60 * 60 * 1000 })
    res.redirect('/')
  } catch (e) {
    res.render('create', {
      error: 'Email-ul are deja un cont',
    })
  }
})

// Login to account
router.post('/users/login', upload.fields([]), async (req, res) => {
  let minutes = '1'
  if ('rememberMe' in req.body) {
    minutes = '60'
  }
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken(minutes)

    res.cookie('Authorization', token, { maxAge: +minutes * 60 * 1000 }) // minute * 60 * 1000 = miliseconds
    res.redirect('/')
  } catch (e) {
    res.render('login', {
      error: 'Email sau parola invalida!',
    })
  }
})

router.get('/users/logout', async (req, res) => {
  res.clearCookie('Authorization')
  res.redirect('/')
})

module.exports = router
