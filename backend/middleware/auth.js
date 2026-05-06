const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorised, no token' })
  }

  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.admin = await Admin.findById(decoded.id)
    if (!req.admin) {
      return res.status(401).json({ success: false, message: 'Admin not found' })
    }
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Not authorised, invalid token' })
  }
}

module.exports = { protect }
