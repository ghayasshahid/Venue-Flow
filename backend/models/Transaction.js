const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, unique: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    bookingId: { type: String },
    customer: { type: String, required: true },
    eventType: { type: String },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['advance', 'full', 'partial', 'refund'], required: true },
    status: { type: String, enum: ['paid', 'pending', 'failed'], default: 'paid' },
    date: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
)

transactionSchema.pre('save', async function () {
  if (!this.transactionId) {
    const count = await mongoose.model('Transaction').countDocuments()
    this.transactionId = `TXN-${String(count + 1).padStart(3, '0')}`
  }
})

module.exports = mongoose.model('Transaction', transactionSchema)
