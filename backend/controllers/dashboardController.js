const Booking = require('../models/Booking')
const BookingRequest = require('../models/BookingRequest')
const Transaction = require('../models/Transaction')

const getStats = async (req, res, next) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [bookedToday, upcoming, pendingPayments, pendingRequests] = await Promise.all([
      Booking.countDocuments({ date: { $gte: today, $lt: tomorrow } }),
      Booking.countDocuments({ status: 'upcoming', date: { $gte: today } }),
      Booking.countDocuments({ paymentStatus: 'pending' }),
      BookingRequest.countDocuments({ status: 'pending' }),
    ])

    res.json({ success: true, data: { bookedToday, upcoming, pendingPayments, pendingRequests } })
  } catch (err) {
    next(err)
  }
}

const getRecentBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('hall', 'name')

    res.json({ success: true, data: bookings })
  } catch (err) {
    next(err)
  }
}

const getMonthlyRevenue = async (req, res, next) => {
  try {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
    sixMonthsAgo.setDate(1)
    sixMonthsAgo.setHours(0, 0, 0, 0)

    const result = await Transaction.aggregate([
      { $match: { date: { $gte: sixMonthsAgo }, status: 'paid' } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          revenue: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ])

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const data = result.map((r) => ({
      month: monthNames[r._id.month - 1],
      revenue: r.revenue,
    }))

    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

module.exports = { getStats, getRecentBookings, getMonthlyRevenue }
