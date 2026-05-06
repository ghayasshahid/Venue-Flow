const router = require('express').Router()
const { getStats, getRecentBookings, getMonthlyRevenue } = require('../controllers/dashboardController')
const { protect } = require('../middleware/auth')

router.use(protect)

router.get('/stats', getStats)
router.get('/recent-bookings', getRecentBookings)
router.get('/monthly-revenue', getMonthlyRevenue)

module.exports = router
