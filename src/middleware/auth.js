const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
  try {
    const token = req.cookies['Authorization']
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({ password: decoded.password })

    if (!user) {
      throw new Error()
    }
    req.user = user
    next()
  } catch (e) {
    res.status(401).redirect('/users/login')
  }
}

module.exports = auth
