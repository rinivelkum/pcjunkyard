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
    } else {
      res.status(401).send()
    }
  } else {
    res.status(401).send()
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
      'reviews overallGrade',
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

router.get('/product/list', async (req, res) => {
  const products = await Product.find({}, 'name sku image', {
    sort: { createdAt: -1 },
    limit: 10,
  }).lean()
  if (products) {
    res.send(products)
  } else {
    res.status(404).send()
  }
})

router.post('/offer/:sku', auth, async (req, res) => {
  const product = await Product.findOne({ sku: req.params.sku })
  product.discount = req.body.discount
  await product.save()
  res.send(product)
})

router.post(
  '/data/review/:prodName',
  [upload.fields([]), auth],
  async (req, res) => {
    const name = req.params.prodName.replaceAll('+', ' ')
    if (req.user) {
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
    } else {
      res.status(401).send()
    }
  }
)

router.post('/basket/:sku', auth, async (req, res) => {
  if (req.user) {
    if (req.user.basket.has(req.params.sku)) {
      const quantity = req.user.basket.get(req.params.sku) + 1
      req.user.basket.set(req.params.sku, quantity)
    } else {
      req.user.basket.set(req.params.sku, 1)
    }
    res.send(req.user.basket)
    await req.user.save()
    res.send()
  } else {
    let cookie = req.cookies['Basket']
    if (cookie !== undefined) {
      let cookieData = JSON.parse(cookie)
      if (cookieData.indexOf(req.params.sku) > -1) {
        cookieData[cookieData.indexOf(req.params.sku) + 1] =
          cookieData[cookieData.indexOf(req.params.sku) + 1] + 1
        res.cookie('Basket', JSON.stringify(cookieData), {
          maxAge: 60 * 60 * 1000,
        })
        res.send(res.cookie['Basket'])
      }
    } else {
      let cookieData = [req.params.sku, 1]
      res.cookie('Basket', JSON.stringify(cookieData), {
        maxAge: 60 * 60 * 1000,
      })
      res.send()
    }
  }
})

router.delete('/basket/:sku', auth, async (req, res) => {
  if (req.user) {
    req.user.basket.delete(req.params.sku)
    await req.user.save()
    res.send()
  } else {
    let cookie = req.cookies['Basket']
    if (cookie !== undefined) {
      let cookieData = JSON.parse(cookie)
      if (cookieData.indexOf(req.params.sku) > -1) {
        // use .slice to delete the 2 entries
        res.cookie('Basket', JSON.stringify(cookieData), {
          maxAge: 60 * 60 * 1000,
        })
        res.send()
      }
    } else {
      res.status(404).send()
    }
  }
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

router.get('/procesoare/:prodName', auth, async (req, res) => {
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

router.get('/placi-de-baza/:prodName', auth, async (req, res) => {
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

router.get('/sdd/:prodName', auth, async (req, res) => {
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

router.get('/hdd/:prodName', auth, async (req, res) => {
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

router.get('/surse/:prodName', auth, async (req, res) => {
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

router.get('/carcase/:prodName', auth, async (req, res) => {
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

router.get('/coolere/:prodName', auth, async (req, res) => {
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
