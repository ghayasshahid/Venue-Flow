const router = require('express').Router()
const {
  getAllBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  exportBookings,
} = require('../controllers/bookingController')
const { protect } = require('../middleware/auth')

router.use(protect)

router.get('/export', exportBookings)
router.route('/').get(getAllBookings).post(createBooking)
router.route('/:id').get(getBooking).put(updateBooking).delete(deleteBooking)

module.exports = router
