const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema(
  {
    expenseId: { type: String, unique: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    bookingId: { type: String },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    category: {
      type: String,
      enum: ['catering', 'decor', 'equipment', 'staff', 'utilities', 'maintenance', 'other'],
      required: true,
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
)

expenseSchema.pre('save', async function () {
  if (!this.expenseId) {
    const count = await mongoose.model('Expense').countDocuments()
    this.expenseId = `EXP-${String(count + 1).padStart(3, '0')}`
  }
})

module.exports = mongoose.model('Expense', expenseSchema)
