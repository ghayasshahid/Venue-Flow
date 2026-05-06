const BookingRequest = require('../models/BookingRequest')

const getAllRequests = async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.status) filter.status = req.query.status

    const requests = await BookingRequest.find(filter).sort({ createdAt: -1 })
    res.json({ success: true, data: requests })
  } catch (err) {
    next(err)
  }
}

const getRequest = async (req, res, next) => {
  try {
    const request = await BookingRequest.findById(req.params.id)
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' })
    res.json({ success: true, data: request })
  } catch (err) {
    next(err)
  }
}

const createRequest = async (req, res, next) => {
  try {
    const request = await BookingRequest.create(req.body)
    res.status(201).json({ success: true, data: request })
  } catch (err) {
    next(err)
  }
}

const updateRequestStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body
    const allowed = ['pending', 'contacted', 'approved', 'rejected']
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' })
    }

    const request = await BookingRequest.findByIdAndUpdate(
      req.params.id,
      { status, ...(adminNotes !== undefined && { adminNotes }) },
      { new: true }
    )
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' })
    res.json({ success: true, data: request })
  } catch (err) {
    next(err)
  }
}

const deleteRequest = async (req, res, next) => {
  try {
    const request = await BookingRequest.findByIdAndDelete(req.params.id)
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' })
    res.json({ success: true, message: 'Request deleted successfully' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getAllRequests, getRequest, createRequest, updateRequestStatus, deleteRequest }
