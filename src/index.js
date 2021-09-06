const express = require('express')
require('./db/mongoose')
const path = require('path')
const hbs = require('hbs')
const userRouter = require('./routers/user')
const productRouter = require('./routers/product')
const cookieParser = require('cookie-parser')
const multer = require('multer')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(cookieParser())
app.use(userRouter)
app.use(productRouter)
app.use(function (err, req, res, next) {
  if (err instanceof multer.MulterError) {
    res.status(400).send('File too large (>1mb)')
  }
})

app.listen(port, () => {
  console.log(`Server is up on ${port}`)
})

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, './utils/views')
const partialsPath = path.join(__dirname, './templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))
