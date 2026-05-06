const router = require('express').Router()
const { getAll, getOne, create, update, remove } = require('../controllers/menuPackageController')
const { protect } = require('../middleware/auth')

router.use(protect)
router.route('/').get(getAll).post(create)
router.route('/:id').get(getOne).put(update).delete(remove)

module.exports = router
