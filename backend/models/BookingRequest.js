const mongoose = require('mongoose')

const bookingRequestSchema = new mongoose.Schema(
  {
    requestId: { type: String, unique: true },
    customer: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    eventType: { type: String, required: true },
    requestedDate: { type: Date, required: true },
    hall: { type: String, required: true },
    guests: { type: Number, required: true },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'approved', 'rejected'],
      default: 'pending',
    },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
)

bookingRequestSchema.pre('save', async function () {
  if (!this.requestId) {
    const count = await mongoose.model('BookingRequest').countDocuments()
    this.requestId = `REQ-${String(count + 1).padStart(3, '0')}`
  }
})

module.exports = mongoose.model('BookingRequest', bookingRequestSchema)
