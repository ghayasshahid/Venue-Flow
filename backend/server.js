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

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

// Routes (add as you build them)
// app.use('/api/auth', require('./routes/auth'))
// app.use('/api/venues', require('./routes/venues'))
// app.use('/api/bookings', require('./routes/bookings'))

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' })
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
