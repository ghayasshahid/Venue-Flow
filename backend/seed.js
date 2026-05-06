require('dotenv').config()
const mongoose = require('mongoose')
const Admin = require('./models/Admin')
const Hall = require('./models/Hall')
const Booking = require('./models/Booking')
const BookingRequest = require('./models/BookingRequest')
const Transaction = require('./models/Transaction')
const Expense = require('./models/Expense')
const MenuPackage = require('./models/MenuPackage')
const DecorPackage = require('./models/DecorPackage')

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  // Clear all collections
  await Promise.all([
    Admin.deleteMany(),
    Hall.deleteMany(),
    Booking.deleteMany(),
    BookingRequest.deleteMany(),
    Transaction.deleteMany(),
    Expense.deleteMany(),
    MenuPackage.deleteMany(),
    DecorPackage.deleteMany(),
  ])
  console.log('Cleared existing data')

  // ── Admin ────────────────────────────────────────────────────────────
  const admin = await Admin.create({
    name: 'Venue Admin',
    email: 'admin@venueflow.com',
    password: 'Admin@123',
    role: 'superadmin',
  })
  console.log('Admin created:', admin.email)

  // ── Halls ────────────────────────────────────────────────────────────
  const halls = await Hall.insertMany([
    { name: 'Royal Grand Hall', capacity: 800, area: '12,000 sq ft', price: 450000, description: 'Our flagship space featuring architectural grandeur for grand celebrations.' },
    { name: 'Crystal Ballroom', capacity: 400, area: '6,500 sq ft', price: 280000, description: 'Elegant crystal chandeliers and mirrored walls for intimate luxury.' },
    { name: 'Garden Pavilion', capacity: 300, area: '5,000 sq ft', price: 200000, description: 'Open-air pavilion surrounded by manicured gardens.' },
    { name: 'Pearl Suite', capacity: 150, area: '2,500 sq ft', price: 120000, description: 'Intimate suite perfect for smaller gatherings and corporate events.' },
  ])
  console.log('Halls created:', halls.length)

  const [royal, crystal, garden, pearl] = halls

  // ── Menu Packages ─────────────────────────────────────────────────────
  await MenuPackage.insertMany([
    { name: 'Standard', price: 1800, items: ['Biryani', 'Chicken Karahi', 'Raita', 'Salad', 'Naan', 'Dessert'] },
    { name: 'Premium', price: 2800, items: ['Biryani', 'Beef Nihari', 'Chicken BBQ', 'Mutton Karahi', 'Daal', 'Raita', 'Salad', 'Naan', 'Dessert x2'] },
    { name: 'Platinum', price: 4200, items: ['Biryani', 'Beef Nihari', 'Lamb Chops', 'Chicken BBQ', 'Mutton Karahi', 'Daal Makhani', 'Raita', 'Salads x3', 'Naan', 'Dessert x3', 'Live Grill'] },
    { name: 'Custom', price: 0, items: [], isCustom: true },
  ])
  console.log('Menu packages created: 4')

  // ── Decor Packages ────────────────────────────────────────────────────
  await DecorPackage.insertMany([
    { name: 'Classic White', price: 80000, description: 'Elegant white florals, fairy lights, and satin draping.' },
    { name: 'Royal Gold', price: 150000, description: 'Gold accents, premium florals, crystal centrepieces.' },
    { name: 'Garden Fresh', price: 95000, description: 'Natural greenery, pastel florals, organic aesthetic.' },
    { name: 'Custom', price: 0, description: 'Fully customised décor per client requirements.', isCustom: true },
  ])
  console.log('Decor packages created: 4')

  // ── Bookings ─────────────────────────────────────────────────────────
  const bookingsData = [
    { bookingId: 'VF-001', hall: royal._id, hallName: 'Royal Grand Hall', eventType: 'Wedding', customer: { name: 'Zubair Khan', phone: '+92 300 1234567', email: 'zubair@email.com' }, date: new Date('2024-11-24'), time: '18:00', guests: 650, menu: 'Platinum', decor: 'Royal Gold', advance: 200000, totalAmount: 980000, paymentStatus: 'paid', status: 'completed' },
    { bookingId: 'VF-002', hall: crystal._id, hallName: 'Crystal Ballroom', eventType: 'Barat', customer: { name: 'Sarah Ahmed', phone: '+92 301 9876543', email: 'sarah@email.com' }, date: new Date('2024-11-25'), time: '19:00', guests: 300, menu: 'Premium', decor: 'Classic White', advance: 100000, totalAmount: 580000, paymentStatus: 'pending', status: 'completed', notes: 'Bride requested extra flowers.' },
    { bookingId: 'VF-003', hall: garden._id, hallName: 'Garden Pavilion', eventType: 'Wedding', customer: { name: 'Omar Farooq', phone: '+92 333 5556677', email: 'omar@email.com' }, date: new Date('2024-12-02'), time: '17:00', guests: 250, menu: 'Standard', decor: 'Garden Fresh', advance: 80000, totalAmount: 420000, paymentStatus: 'paid', status: 'completed' },
    { bookingId: 'VF-004', hall: royal._id, hallName: 'Royal Grand Hall', eventType: 'Barat', customer: { name: 'Fatima Malik', phone: '+92 345 1112233', email: 'fatima@email.com' }, date: new Date('2025-12-05'), time: '20:00', guests: 700, menu: 'Platinum', decor: 'Royal Gold', advance: 250000, totalAmount: 1100000, paymentStatus: 'pending', status: 'upcoming', notes: 'VIP table required for family.' },
    { bookingId: 'VF-005', hall: crystal._id, hallName: 'Crystal Ballroom', eventType: 'Corporate Gala', customer: { name: 'Alled Banc', phone: '+92 321 4445566', email: 'info@alledbanc.com' }, date: new Date('2024-10-15'), time: '18:00', guests: 350, menu: 'Premium', decor: 'Classic White', advance: 150000, totalAmount: 620000, paymentStatus: 'paid', status: 'completed' },
    { bookingId: 'VF-006', hall: pearl._id, hallName: 'Pearl Suite', eventType: 'Anniversary Ball', customer: { name: 'Rina Polko', phone: '+92 312 7778899', email: 'rina@email.com' }, date: new Date('2024-10-22'), time: '19:00', guests: 120, menu: 'Standard', decor: 'Classic White', advance: 50000, totalAmount: 220000, paymentStatus: 'paid', status: 'completed', notes: 'Anniversary milestone event.' },
    { bookingId: 'VF-007', hall: royal._id, hallName: 'Royal Grand Hall', eventType: 'Wedding', customer: { name: 'Hamza Raza', phone: '+92 300 2223344', email: 'hamza@email.com' }, date: new Date('2024-09-10'), time: '17:00', guests: 750, menu: 'Platinum', decor: 'Royal Gold', advance: 300000, totalAmount: 1200000, paymentStatus: 'paid', status: 'completed' },
    { bookingId: 'VF-008', hall: garden._id, hallName: 'Garden Pavilion', eventType: 'Mehndi', customer: { name: 'Ayesha Siddiqui', phone: '+92 322 6667788', email: 'ayesha@email.com' }, date: new Date('2025-12-18'), time: '20:00', guests: 200, menu: 'Standard', decor: 'Garden Fresh', advance: 60000, totalAmount: 330000, paymentStatus: 'pending', status: 'upcoming' },
  ]

  const bookings = await Booking.insertMany(bookingsData)
  console.log('Bookings created:', bookings.length)

  const [b1, , , , b5, b6, b7] = bookings

  // ── Booking Requests ─────────────────────────────────────────────────
  await BookingRequest.insertMany([
    { requestId: 'REQ-001', customer: 'Omar Farooq', phone: '+92 333 5556677', email: 'omar.f@email.com', eventType: 'Wedding', requestedDate: new Date('2025-02-14'), hall: 'Royal Grand Hall', guests: 600, message: 'Looking for full wedding package with catering.', status: 'pending' },
    { requestId: 'REQ-002', customer: 'Elena Moretti', phone: '+92 301 1112233', email: 'elena@email.com', eventType: 'Corporate Event', requestedDate: new Date('2025-01-20'), hall: 'Crystal Ballroom', guests: 200, message: 'Annual company dinner for 200 staff.', status: 'contacted' },
    { requestId: 'REQ-003', customer: 'Julian Thorne', phone: '+92 345 9990011', email: 'julian@email.com', eventType: 'Birthday', requestedDate: new Date('2025-01-05'), hall: 'Pearl Suite', guests: 80, message: 'Birthday party for 80 guests, evening.', status: 'pending' },
    { requestId: 'REQ-004', customer: 'Nadia Hassan', phone: '+92 312 4445566', email: 'nadia@email.com', eventType: 'Mehndi', requestedDate: new Date('2025-03-08'), hall: 'Garden Pavilion', guests: 180, message: 'Mehndi function with colourful décor.', status: 'pending' },
  ])
  console.log('Booking requests created: 4')

  // ── Transactions ─────────────────────────────────────────────────────
  await Transaction.insertMany([
    { transactionId: 'TXN-001', booking: b1._id, bookingId: 'VF-001', customer: 'Zubair Khan', eventType: 'Wedding', date: new Date('2024-11-10'), amount: 200000, type: 'advance', status: 'paid' },
    { transactionId: 'TXN-002', booking: b5._id, bookingId: 'VF-005', customer: 'Alled Banc', eventType: 'Corporate Gala', date: new Date('2024-10-05'), amount: 620000, type: 'full', status: 'paid' },
    { transactionId: 'TXN-003', booking: b6._id, bookingId: 'VF-006', customer: 'Rina Polko', eventType: 'Anniversary Ball', date: new Date('2024-10-15'), amount: 220000, type: 'full', status: 'paid' },
    { transactionId: 'TXN-004', booking: b7._id, bookingId: 'VF-007', customer: 'Hamza Raza', eventType: 'Wedding', date: new Date('2024-09-01'), amount: 1200000, type: 'full', status: 'paid' },
    { transactionId: 'TXN-005', booking: bookings[1]._id, bookingId: 'VF-002', customer: 'Sarah Ahmed', eventType: 'Barat', date: new Date('2024-11-12'), amount: 100000, type: 'advance', status: 'paid' },
    { transactionId: 'TXN-006', booking: bookings[3]._id, bookingId: 'VF-004', customer: 'Fatima Malik', eventType: 'Barat', date: new Date('2024-11-15'), amount: 250000, type: 'advance', status: 'paid' },
  ])
  console.log('Transactions created: 6')

  // ── Expenses ─────────────────────────────────────────────────────────
  await Expense.insertMany([
    { expenseId: 'EXP-001', booking: b1._id, bookingId: 'VF-001', description: 'Catering - Platinum Package', amount: 520000, date: new Date('2024-11-24'), category: 'catering' },
    { expenseId: 'EXP-002', booking: b1._id, bookingId: 'VF-001', description: 'Royal Gold Décor Setup', amount: 150000, date: new Date('2024-11-24'), category: 'decor' },
    { expenseId: 'EXP-003', booking: b5._id, bookingId: 'VF-005', description: 'Premium Catering Package', amount: 280000, date: new Date('2024-10-15'), category: 'catering' },
    { expenseId: 'EXP-004', booking: b5._id, bookingId: 'VF-005', description: 'Classic White Décor', amount: 80000, date: new Date('2024-10-15'), category: 'decor' },
    { expenseId: 'EXP-005', booking: b5._id, bookingId: 'VF-005', description: 'AV Equipment Rental', amount: 45000, date: new Date('2024-10-15'), category: 'equipment' },
    { expenseId: 'EXP-006', booking: b7._id, bookingId: 'VF-007', description: 'Platinum Catering', amount: 630000, date: new Date('2024-09-10'), category: 'catering' },
    { expenseId: 'EXP-007', booking: b7._id, bookingId: 'VF-007', description: 'Royal Gold Décor', amount: 150000, date: new Date('2024-09-10'), category: 'decor' },
  ])
  console.log('Expenses created: 7')

  console.log('\n✓ Seed complete!')
  console.log('─────────────────────────────────')
  console.log('Admin login:')
  console.log('  Email   : admin@venueflow.com')
  console.log('  Password: Admin@123')
  console.log('─────────────────────────────────')

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
