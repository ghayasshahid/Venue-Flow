const Hall = require('../models/Hall')
const Booking = require('../models/Booking')

const getAllHalls = async (req, res, next) => {
  try {
    const halls = await Hall.find().sort({ createdAt: 1 })
    res.json({ success: true, data: halls })
  } catch (err) {
    next(err)
  }
}

const getHall = async (req, res, next) => {
  try {
    const hall = await Hall.findById(req.params.id)
    if (!hall) return res.status(404).json({ success: false, message: 'Hall not found' })
    res.json({ success: true, data: hall })
  } catch (err) {
    next(err)
  }
}

const createHall = async (req, res, next) => {
  try {
    const hall = await Hall.create(req.body)
    res.status(201).json({ success: true, data: hall })
  } catch (err) {
    next(err)
  }
}

const updateHall = async (req, res, next) => {
  try {
    const hall = await Hall.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!hall) return res.status(404).json({ success: false, message: 'Hall not found' })
    res.json({ success: true, data: hall })
  } catch (err) {
    next(err)
  }
}

const deleteHall = async (req, res, next) => {
  try {
    const hall = await Hall.findById(req.params.id)
    if (!hall) return res.status(404).json({ success: false, message: 'Hall not found' })

    const activeBookings = await Booking.countDocuments({
      hall: req.params.id,
      status: 'upcoming',
    })
    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete hall with active upcoming bookings',
      })
    }

    await hall.deleteOne()
    res.json({ success: true, message: 'Hall deleted successfully' })
  } catch (err) {
    next(err)
  }
}

const getHallAvailability = async (req, res, next) => {
  try {
    const { date } = req.query
    const halls = await Hall.find({ status: 'active' })

    let bookedHallIds = []
    if (date) {
      const day = new Date(date)
      day.setHours(0, 0, 0, 0)
      const next = new Date(day)
      next.setDate(next.getDate() + 1)

      const bookings = await Booking.find({
        date: { $gte: day, $lt: next },
        status: 'upcoming',
      }).select('hall')
      bookedHallIds = bookings.map((b) => b.hall.toString())
    }

    const data = halls.map((h) => ({
      ...h.toJSON(),
      isBooked: bookedHallIds.includes(h._id.toString()),
    }))

    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

module.exports = { getAllHalls, getHall, createHall, updateHall, deleteHall, getHallAvailability }
