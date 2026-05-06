const router = require('express').Router()
const {
  getOverviewReport,
  getEventTypeBreakdown,
  getHallUtilization,
} = require('../controllers/reportsController')
const { protect } = require('../middleware/auth')

router.use(protect)

router.get('/overview', getOverviewReport)
router.get('/event-types', getEventTypeBreakdown)
router.get('/hall-utilization', getHallUtilization)

module.exports = router
