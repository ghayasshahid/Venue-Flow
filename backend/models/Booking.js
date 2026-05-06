const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, unique: true },
    hall: { type: mongoose.Schema.Types.ObjectId, ref: 'Hall', required: true },
    hallName: { type: String },
    eventType: {
      type: String,
      enum: ['Wedding', 'Barat', 'Walima', 'Mehndi', 'Corporate Event', 'Corporate Gala', 'Birthday', 'Anniversary Ball', 'Other'],
      required: true,
    },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    menu: { type: String, default: 'Standard' },
    decor: { type: String, default: 'Classic White' },
    totalAmount: { type: Number, required: true },
    advance: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ['paid', 'pending', 'partial'], default: 'pending' },
    status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
)

bookingSchema.pre('save', async function () {
  if (!this.bookingId) {
    const count = await mongoose.model('Booking').countDocuments()
    this.bookingId = `VF-${String(count + 1).padStart(3, '0')}`
  }
})

module.exports = mongoose.model('Booking', bookingSchema)
