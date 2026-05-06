const mongoose = require('mongoose')

const decorPackageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, default: 0 },
  description: { type: String, default: '' },
  isCustom: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('DecorPackage', decorPackageSchema)
