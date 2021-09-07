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
const admins = require('../utils/constants/admins')
const manufacturers = require('../utils/constants/manufacturers')
const types = require('../utils/constants/types')

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
        const sku = await Product.generateSku(
          req.body.manufacturer,
          req.body.category,
          req.body.model
        )

        const product = new Product({
          name: req.body.productName,
          description: req.body.description,
          sku,
          price: req.body.productPrice,
          quantity: req.body.productQuant,
          image: req.body.productImage,
        })

        await product.save()
        res.send(product)
      } catch (e) {
        console.log(e)
        res.send(e)
      }
    }
  }
})

router.get('/data/:prodName', async (req, res) => {
  try {
    const name = req.params.prodName.replaceAll('+', ' ')
    const product = await Product.findOne({
      name,
    }).lean()
    if (product) {
      models = await Product.getModels()

      product.model = models[+product.sku.slice(4, -4)].toLowerCase()
      product.category = types.get(product.sku.slice(2, -7)).toLowerCase()

      res.send(product)
    } else {
      res.status(404).send()
    }
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/data/review/:prodName', async (req, res) => {
  const name = req.params.prodName.replaceAll('+', ' ')
  try {
    const reviews = await Product.findOne(
      {
        name,
      },
      'reviews',
      { sort: { createdAt: -1 } }
    )
      .limit(10)
      .lean()

    if (reviews) {
      res.send(reviews)
    } else {
      res.status(404).send()
    }
  } catch (e) {
    res.status(500).send()
  }
})

router.post(
  '/data/review/:prodName',
  [upload.fields([]), auth],
  async (req, res) => {
    const name = req.params.prodName.replaceAll('+', ' ')
    try {
      const product = await Product.findOne({
        name,
      })

      if (product) {
        product.reviews.push({
          grade: req.body.grade,
          review: req.body.review,
        })
        if (product.overallGrade) {
          let sum = Number(product.overallGrade) + Number(req.body.grade)
          product.overallGrade = (sum / 2).toFixed(2)
        } else {
          console.log(2)
          product.overallGrade = req.body.grade
        }
        await product.save()
        res.send(product)
      } else {
        res.status(404).send()
      }
    } catch (e) {
      res.status(500).send()
    }
  }
)

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

module.exports = router
