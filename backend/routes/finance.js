const router = require('express').Router()
const {
  getTransactions,
  createTransaction,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary,
} = require('../controllers/financeController')
const { protect } = require('../middleware/auth')

router.use(protect)

router.get('/summary', getSummary)
router.route('/transactions').get(getTransactions).post(createTransaction)
router.route('/expenses').get(getExpenses).post(createExpense)
router.route('/expenses/:id').put(updateExpense).delete(deleteExpense)

module.exports = router
