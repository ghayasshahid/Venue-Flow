const Booking = require('../models/Booking')
const Hall = require('../models/Hall')

const buildFilter = (query) => {
  const filter = {}
  if (query.hall) filter.hall = query.hall
  if (query.status) filter.status = query.status
  if (query.paymentStatus) filter.paymentStatus = query.paymentStatus
  if (query.eventType) filter.eventType = query.eventType
  if (query.dateFrom || query.dateTo) {
    filter.date = {}
    if (query.dateFrom) filter.date.$gte = new Date(query.dateFrom)
    if (query.dateTo) {
      const to = new Date(query.dateTo)
      to.setHours(23, 59, 59, 999)
      filter.date.$lte = to
    }
  }
  if (query.search) {
    const re = new RegExp(query.search, 'i')
    filter.$or = [{ 'customer.name': re }, { bookingId: re }, { 'customer.phone': re }]
  }
  return filter
}

const getAllBookings = async (req, res, next) => {
  try {
    const filter = buildFilter(req.query)
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('hall', 'name capacity')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments(filter),
    ])

    res.json({
      success: true,
      data: bookings,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (err) {
    next(err)
  }
}

const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('hall', 'name capacity area price')
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' })
    res.json({ success: true, data: booking })
  } catch (err) {
    next(err)
  }
}

const createBooking = async (req, res, next) => {
  try {
    const hall = await Hall.findById(req.body.hall)
    if (!hall) return res.status(404).json({ success: false, message: 'Hall not found' })

    const booking = await Booking.create({ ...req.body, hallName: hall.name })
    await booking.populate('hall', 'name capacity')
    res.status(201).json({ success: true, data: booking })
  } catch (err) {
    next(err)
  }
}

const updateBooking = async (req, res, next) => {
  try {
    if (req.body.hall) {
      const hall = await Hall.findById(req.body.hall)
      if (!hall) return res.status(404).json({ success: false, message: 'Hall not found' })
      req.body.hallName = hall.name
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('hall', 'name capacity')

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' })
    res.json({ success: true, data: booking })
  } catch (err) {
    next(err)
  }
}

const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id)
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' })
    res.json({ success: true, message: 'Booking deleted successfully' })
  } catch (err) {
    next(err)
  }
}

const exportBookings = async (req, res, next) => {
  try {
    const filter = buildFilter(req.query)
    const bookings = await Booking.find(filter).populate('hall', 'name').sort({ date: -1 })

    const rows = [
      ['Booking ID', 'Customer', 'Phone', 'Email', 'Hall', 'Event Type', 'Date', 'Time', 'Guests', 'Menu', 'Decor', 'Total Amount', 'Advance', 'Payment Status', 'Status', 'Notes'],
      ...bookings.map((b) => [
        b.bookingId,
        b.customer.name,
        b.customer.phone,
        b.customer.email,
        b.hall?.name || b.hallName,
        b.eventType,
        b.date.toISOString().split('T')[0],
        b.time,
        b.guests,
        b.menu,
        b.decor,
        b.totalAmount,
        b.advance,
        b.paymentStatus,
        b.status,
        b.notes,
      ]),
    ]

    const csv = rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="bookings.csv"')
    res.send(csv)
  } catch (err) {
    next(err)
  }
}

module.exports = { getAllBookings, getBooking, createBooking, updateBooking, deleteBooking, exportBookings }
