const mongoose = require('mongoose')

const hallSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true },
    area: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: '' },
    image: { type: String, default: null },
    status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Hall', hallSchema)
