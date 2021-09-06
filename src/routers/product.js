const express = require('express')
const router = new express.Router()
const path = require('path')
const auth = require('../middleware/auth')
const User = require('../models/user')
const Product = require('../models/product')
const jwt = require('jsonwebtoken')
const fs = require('fs')
require('mongoose')
const multer = require('multer')
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
})
const resize = require('../middleware/resize')
const admins = require('../utils/constants/admins')
const manufacturers = require('../utils/constants/manufacturers')
const { Buffer } = require('buffer')
const { model } = require('mongoose')
const { modelName } = require('../models/user')

router.get('/', auth, async (req, res) => {
  let basketItems = 0
  if (req.user) {
    basketItems = req.user.basket.length ? req.user.basket.length : 0
  }
  res.render('homepage', {
    loggedIn: req.user ? true : false,
    basketItems,
    admin: req.user ? admins.has(req.user.email) : false,
  })
})

router.get('/:cat', auth, async (req, res) => {
  let basketItems = 0
  if (req.user) {
    basketItems = req.user.basket.length ? req.user.basket.length : 0
  }
  res.render('products', {
    loggedIn: req.user ? true : false,
    basketItems,
    admin: req.user ? admins.has(req.user.email) : false,
  })
})

router.get('/placi-video/:prodName', auth, async (req, res) => {
  let basketItems = 0
  if (req.user) {
    basketItems = req.user.basket.length ? req.user.basket.length : 0
  }
  res.render('product', {
    loggedIn: req.user ? true : false,
    basketItems,
    admin: req.user ? admins.has(req.user.email) : false,
  })
})

router.get('/add/item', auth, async (req, res) => {
  if (req.user) {
    if (admins.has(req.user.email)) {
      res.render('addProduct', {
        loggedIn: true,
        basketItems: req.user.basket.length ? req.user.basket.length : 0,
        admin: true,
      })
    } else {
      res.redirect('/')
    }
  } else {
    res.redirect('/')
  }
})

router.get('/data/groups', async (req, res) => {
  fs.readFile(
    path.join(__dirname, '../utils/constants/groups.json'),
    (err, buf) => {
      if (err) {
        res.status(500).send()
      }
      try {
        res.send(JSON.parse(buf).groups)
      } catch (e) {
        console.log(e)
        res.status(404).send()
      }
    }
  )
})

router.post('/data/groups', [upload.fields([]), auth], async (req, res) => {
  if (req.user) {
    if (admins.has(req.user.email)) {
      if (req.body.newGroup) {
        const file = path.join(__dirname, '../utils/constants/groups.json')
        fs.readFile(file, (err, buf) => {
          if (err) {
            res.status(500).send()
          } else {
            try {
              const json = JSON.parse(buf)
              const array = json.groups
              if (array.includes(req.body.newGroup.toLowerCase())) {
                res.send(array)
              } else {
                array.push(req.body.newGroup.toLowerCase())
                json.groups = array
                fs.writeFile(file, JSON.stringify(json), (err, buf) => {
                  if (err) {
                    res.status(500).send()
                  } else {
                    res.send(array)
                  }
                })
              }
            } catch (e) {
              res.status(404).send()
            }
          }
        })
      } else {
        res.status(304).send()
      }
    }
  }
})

router.post('/add/item', [upload.fields([]), auth], async (req, res) => {
  if (req.user) {
    if (admins.has(req.user.email)) {
      try {
        let model = ''
        fs.readFile(
          path.join(__dirname, '../utils/constants/groups.json'),
          (err, buf) => {
            if (err) {
              console.log(error)
            }
            try {
              model = JSON.parse(buf).groups.indexOf(req.body.model).toString()
            } catch (e) {
              console.log(e)
            }
          }
        )
        if (model.length == 1) {
          model = '00' + model
        } else if (model.length == 2) {
          model = '0' + model
        }

        const sku = req.body.manufacturer + req.body.category + '2222' + '156' // Need to add static method for creating skus
        console.log(req.body, sku)
        const product = new Product({
          name: req.body.productName,
          description: req.body.description,
          sku,
          price: req.body.productPrice,
          quantity: req.body.productQuant,
          image: req.body.productImage,
        })

        await product.save()
        console.log(JSON.parse(product.image))
        res.send(product)
      } catch (e) {
        console.log(e)
        res.send(e)
      }
    }
  }
})

module.exports = router
