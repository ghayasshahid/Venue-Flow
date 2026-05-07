const router = require('express').Router()
const {
  getAllRequests,
  getRequest,
  createRequest,
  updateRequestStatus,
  deleteRequest,
} = require('../controllers/requestController')
const { protect } = require('../middleware/auth')

// POST is public — user-side booking form submits here without a token
router.post('/', createRequest)

// All other operations require admin auth
router.get('/', protect, getAllRequests)
router.get('/:id', protect, getRequest)
router.put('/:id', protect, updateRequestStatus)
router.delete('/:id', protect, deleteRequest)

module.exports = router
