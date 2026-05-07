const router  = require('express').Router()
const Booking = require('../models/Booking')
const Hall    = require('../models/Hall')

// Map a 24-h time string ("HH:MM") → slot id
function classifySlot(timeStr) {
  if (!timeStr) return null
  const hour = parseInt(timeStr.split(':')[0], 10)
  if (hour >= 13 && hour < 16) return 'afternoon'
  if (hour >= 19 && hour < 22) return 'evening'
  return null
}

// GET /api/public/halls
// Returns active halls with id, name, capacity, image
router.get('/halls', async (req, res, next) => {
  try {
    const halls = await Hall.find({ status: 'active' })
      .select('name capacity image')
      .sort({ createdAt: 1 })
    res.json({ success: true, data: halls })
  } catch (err) {
    next(err)
  }
})

// GET /api/public/availability?year=2025&month=5
// Returns all booked hall+slot combinations for the given month.
// Shape: [{ date: 'YYYY-MM-DD', hallId: string, slot: 'afternoon'|'evening' }]
router.get('/availability', async (req, res, next) => {
  try {
    const year  = parseInt(req.query.year,  10)
    const month = parseInt(req.query.month, 10)   // 1-indexed

    if (!year || !month || month < 1 || month > 12) {
      return res.status(400).json({ success: false, message: 'Valid year and month (1-12) are required' })
    }

    const start = new Date(year, month - 1, 1)
    const end   = new Date(year, month, 1)         // exclusive upper bound

    const bookings = await Booking.find({
      date:   { $gte: start, $lt: end },
      status: { $ne: 'cancelled' },
    }).select('date hall time')

    const data = bookings
      .map(b => ({
        date:   b.date.toISOString().split('T')[0],
        hallId: b.hall.toString(),
        slot:   classifySlot(b.time),
      }))
      .filter(b => b.slot !== null)   // discard times outside both windows

    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
})

module.exports = router
