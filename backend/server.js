require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorHandler')

const app = express()

connectDB().catch((err) => {
  console.error('DB connection failed:', err.message)
  process.exit(1)
})

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())

// Admin routes
app.use('/api/admin/auth', require('./routes/auth'))
app.use('/api/admin/dashboard', require('./routes/dashboard'))
app.use('/api/admin/halls', require('./routes/halls'))
app.use('/api/admin/bookings', require('./routes/bookings'))
app.use('/api/admin/requests', require('./routes/requests'))
app.use('/api/admin/finance', require('./routes/finance'))
app.use('/api/admin/reports', require('./routes/reports'))
app.use('/api/admin/menu-packages', require('./routes/menuPackages'))
app.use('/api/admin/decor-packages', require('./routes/decorPackages'))

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' })
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
