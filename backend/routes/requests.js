const router = require('express').Router()
const {
  getAllRequests,
  getRequest,
  createRequest,
  updateRequestStatus,
  deleteRequest,
} = require('../controllers/requestController')
const { protect } = require('../middleware/auth')

router.use(protect)

router.route('/').get(getAllRequests).post(createRequest)
router.route('/:id').get(getRequest).put(updateRequestStatus).delete(deleteRequest)

module.exports = router
