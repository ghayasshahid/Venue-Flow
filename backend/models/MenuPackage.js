const mongoose = require('mongoose')

const menuPackageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, default: 0 },
  items: [{ type: String }],
  isCustom: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('MenuPackage', menuPackageSchema)
