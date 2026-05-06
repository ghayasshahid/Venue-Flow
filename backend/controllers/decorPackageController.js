const DecorPackage = require('../models/DecorPackage')

exports.getAll = async (req, res, next) => {
  try {
    const packages = await DecorPackage.find().sort({ createdAt: 1 })
    res.json({ success: true, data: packages })
  } catch (err) { next(err) }
}

exports.getOne = async (req, res, next) => {
  try {
    const pkg = await DecorPackage.findById(req.params.id)
    if (!pkg) return res.status(404).json({ success: false, message: 'Not found' })
    res.json({ success: true, data: pkg })
  } catch (err) { next(err) }
}

exports.create = async (req, res, next) => {
  try {
    const pkg = await DecorPackage.create(req.body)
    res.status(201).json({ success: true, data: pkg })
  } catch (err) { next(err) }
}

exports.update = async (req, res, next) => {
  try {
    const pkg = await DecorPackage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!pkg) return res.status(404).json({ success: false, message: 'Not found' })
    res.json({ success: true, data: pkg })
  } catch (err) { next(err) }
}

exports.remove = async (req, res, next) => {
  try {
    const pkg = await DecorPackage.findByIdAndDelete(req.params.id)
    if (!pkg) return res.status(404).json({ success: false, message: 'Not found' })
    res.json({ success: true, data: {} })
  } catch (err) { next(err) }
}
