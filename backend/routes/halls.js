const router = require('express').Router()
const {
  getAllHalls,
  getHall,
  createHall,
  updateHall,
  deleteHall,
  getHallAvailability,
} = require('../controllers/hallController')
const { protect } = require('../middleware/auth')

router.use(protect)

router.get('/availability', getHallAvailability)
router.route('/').get(getAllHalls).post(createHall)
router.route('/:id').get(getHall).put(updateHall).delete(deleteHall)

module.exports = router
