const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    const admin = await Admin.findOne({ email }).select('+password')
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const token = signToken(admin._id)
    res.json({ success: true, token, admin })
  } catch (err) {
    next(err)
  }
}

const getMe = async (req, res) => {
  res.json({ success: true, admin: req.admin })
}

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both passwords are required' })
    }

    const admin = await Admin.findById(req.admin._id).select('+password')
    if (!(await admin.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' })
    }

    admin.password = newPassword
    await admin.save()
    res.json({ success: true, message: 'Password updated successfully' })
  } catch (err) {
    next(err)
  }
}

module.exports = { login, getMe, changePassword }
