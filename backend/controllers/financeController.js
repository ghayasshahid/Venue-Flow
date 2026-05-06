const Transaction = require('../models/Transaction')
const Expense = require('../models/Expense')
const Booking = require('../models/Booking')

const getTransactions = async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.type) filter.type = req.query.type
    if (req.query.status) filter.status = req.query.status
    if (req.query.dateFrom || req.query.dateTo) {
      filter.date = {}
      if (req.query.dateFrom) filter.date.$gte = new Date(req.query.dateFrom)
      if (req.query.dateTo) {
        const to = new Date(req.query.dateTo)
        to.setHours(23, 59, 59, 999)
        filter.date.$lte = to
      }
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 })
    const totalRevenue = transactions.filter((t) => t.status === 'paid').reduce((sum, t) => sum + t.amount, 0)

    res.json({ success: true, data: transactions, totalRevenue })
  } catch (err) {
    next(err)
  }
}

const createTransaction = async (req, res, next) => {
  try {
    const txn = await Transaction.create(req.body)
    res.status(201).json({ success: true, data: txn })
  } catch (err) {
    next(err)
  }
}

const getExpenses = async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.category) filter.category = req.query.category
    if (req.query.bookingId) filter.bookingId = req.query.bookingId

    const expenses = await Expense.find(filter).sort({ date: -1 })
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

    res.json({ success: true, data: expenses, totalExpenses })
  } catch (err) {
    next(err)
  }
}

const createExpense = async (req, res, next) => {
  try {
    const expense = await Expense.create(req.body)
    res.status(201).json({ success: true, data: expense })
  } catch (err) {
    next(err)
  }
}

const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' })
    res.json({ success: true, data: expense })
  } catch (err) {
    next(err)
  }
}

const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id)
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' })
    res.json({ success: true, message: 'Expense deleted' })
  } catch (err) {
    next(err)
  }
}

const getSummary = async (req, res, next) => {
  try {
    const [totalRevenue, totalExpenses, pendingPayments] = await Promise.all([
      Transaction.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      Booking.aggregate([{ $match: { paymentStatus: 'pending' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    ])

    const revenue = totalRevenue[0]?.total || 0
    const expenses = totalExpenses[0]?.total || 0
    const pending = pendingPayments[0]?.total || 0

    res.json({
      success: true,
      data: {
        totalRevenue: revenue,
        totalExpenses: expenses,
        netProfit: revenue - expenses,
        pendingPayments: pending,
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { getTransactions, createTransaction, getExpenses, createExpense, updateExpense, deleteExpense, getSummary }
