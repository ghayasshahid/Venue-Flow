const Booking = require('../models/Booking')
const Transaction = require('../models/Transaction')
const Expense = require('../models/Expense')
const BookingRequest = require('../models/BookingRequest')

const getOverviewReport = async (req, res, next) => {
  try {
    const { year = new Date().getFullYear() } = req.query
    const start = new Date(`${year}-01-01`)
    const end = new Date(`${year}-12-31T23:59:59`)

    const [
      totalBookings,
      completedBookings,
      cancelledBookings,
      upcomingBookings,
      totalRevenue,
      totalExpenses,
      totalRequests,
      monthlyData,
    ] = await Promise.all([
      Booking.countDocuments({ date: { $gte: start, $lte: end } }),
      Booking.countDocuments({ date: { $gte: start, $lte: end }, status: 'completed' }),
      Booking.countDocuments({ date: { $gte: start, $lte: end }, status: 'cancelled' }),
      Booking.countDocuments({ date: { $gte: start, $lte: end }, status: 'upcoming' }),
      Transaction.aggregate([
        { $match: { date: { $gte: start, $lte: end }, status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Expense.aggregate([
        { $match: { date: { $gte: start, $lte: end } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      BookingRequest.countDocuments({ createdAt: { $gte: start, $lte: end } }),
      Booking.aggregate([
        { $match: { date: { $gte: start, $lte: end } } },
        {
          $group: {
            _id: { month: { $month: '$date' } },
            bookings: { $sum: 1 },
            guests: { $sum: '$guests' },
          },
        },
        { $sort: { '_id.month': 1 } },
      ]),
    ])

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthly = monthlyData.map((m) => ({
      month: monthNames[m._id.month - 1],
      bookings: m.bookings,
      guests: m.guests,
    }))

    res.json({
      success: true,
      data: {
        year: Number(year),
        totalBookings,
        completedBookings,
        cancelledBookings,
        upcomingBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalExpenses: totalExpenses[0]?.total || 0,
        netProfit: (totalRevenue[0]?.total || 0) - (totalExpenses[0]?.total || 0),
        totalRequests,
        monthly,
      },
    })
  } catch (err) {
    next(err)
  }
}

const getEventTypeBreakdown = async (req, res, next) => {
  try {
    const data = await Booking.aggregate([
      { $group: { _id: '$eventType', count: { $sum: 1 }, totalRevenue: { $sum: '$totalAmount' } } },
      { $sort: { count: -1 } },
    ])

    res.json({
      success: true,
      data: data.map((d) => ({ eventType: d._id, count: d.count, totalRevenue: d.totalRevenue })),
    })
  } catch (err) {
    next(err)
  }
}

const getHallUtilization = async (req, res, next) => {
  try {
    const data = await Booking.aggregate([
      { $match: { status: { $in: ['upcoming', 'completed'] } } },
      {
        $group: {
          _id: '$hall',
          hallName: { $first: '$hallName' },
          bookings: { $sum: 1 },
          totalGuests: { $sum: '$guests' },
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { bookings: -1 } },
    ])

    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

module.exports = { getOverviewReport, getEventTypeBreakdown, getHallUtilization }
