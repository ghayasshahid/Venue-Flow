export const halls = [
  { id: 1, name: 'Royal Grand Hall', capacity: 800, area: '12,000 sq ft', price: 450000, image: null, description: 'Our flagship space featuring architectural grandeur for grand celebrations.' },
  { id: 2, name: 'Crystal Ballroom', capacity: 400, area: '6,500 sq ft', price: 280000, image: null, description: 'Elegant crystal chandeliers and mirrored walls for intimate luxury.' },
  { id: 3, name: 'Garden Pavilion', capacity: 300, area: '5,000 sq ft', price: 200000, image: null, description: 'Open-air pavilion surrounded by manicured gardens.' },
  { id: 4, name: 'Pearl Suite', capacity: 150, area: '2,500 sq ft', price: 120000, image: null, description: 'Intimate suite perfect for smaller gatherings and corporate events.' },
]

export const menuPackages = [
  { id: 1, name: 'Standard', price: 1800, items: ['Biryani', 'Chicken Karahi', 'Raita', 'Salad', 'Naan', 'Dessert'] },
  { id: 2, name: 'Premium', price: 2800, items: ['Biryani', 'Beef Nihari', 'Chicken BBQ', 'Mutton Karahi', 'Daal', 'Raita', 'Salad', 'Naan', 'Dessert x2'] },
  { id: 3, name: 'Platinum', price: 4200, items: ['Biryani', 'Beef Nihari', 'Lamb Chops', 'Chicken BBQ', 'Mutton Karahi', 'Daal Makhani', 'Raita', 'Salads x3', 'Naan', 'Dessert x3', 'Live Grill'] },
  { id: 4, name: 'Custom', price: 0, items: [] },
]

export const decorPackages = [
  { id: 1, name: 'Classic White', price: 80000, description: 'Elegant white florals, fairy lights, and satin draping.' },
  { id: 2, name: 'Royal Gold', price: 150000, description: 'Gold accents, premium florals, crystal centrepieces.' },
  { id: 3, name: 'Garden Fresh', price: 95000, description: 'Natural greenery, pastel florals, organic aesthetic.' },
  { id: 4, name: 'Custom', price: 0, description: 'Fully customised décor per client requirements.' },
]

export const bookings = [
  { id: 'VF-001', date: '2024-11-24', time: '18:00', hallId: 1, hall: 'Royal Grand Hall', eventType: 'Wedding', customer: 'Zubair Khan', phone: '+92 300 1234567', email: 'zubair@email.com', guests: 650, menu: 'Platinum', decor: 'Royal Gold', advance: 200000, totalAmount: 980000, paymentStatus: 'paid', status: 'upcoming', notes: '' },
  { id: 'VF-002', date: '2024-11-25', time: '19:00', hallId: 2, hall: 'Crystal Ballroom', eventType: 'Barat', customer: 'Sarah Ahmed', phone: '+92 301 9876543', email: 'sarah@email.com', guests: 300, menu: 'Premium', decor: 'Classic White', advance: 100000, totalAmount: 580000, paymentStatus: 'pending', status: 'upcoming', notes: 'Bride requested extra flowers.' },
  { id: 'VF-003', date: '2024-12-02', time: '17:00', hallId: 3, hall: 'Garden Pavilion', eventType: 'Wedding', customer: 'Omar Farooq', phone: '+92 333 5556677', email: 'omar@email.com', guests: 250, menu: 'Standard', decor: 'Garden Fresh', advance: 80000, totalAmount: 420000, paymentStatus: 'paid', status: 'upcoming', notes: '' },
  { id: 'VF-004', date: '2024-12-05', time: '20:00', hallId: 1, hall: 'Royal Grand Hall', eventType: 'Barat', customer: 'Fatima Malik', phone: '+92 345 1112233', email: 'fatima@email.com', guests: 700, menu: 'Platinum', decor: 'Royal Gold', advance: 250000, totalAmount: 1100000, paymentStatus: 'pending', status: 'upcoming', notes: 'VIP table required for family.' },
  { id: 'VF-005', date: '2024-10-15', time: '18:00', hallId: 2, hall: 'Crystal Ballroom', eventType: 'Corporate Gala', customer: 'Alled Banc', phone: '+92 321 4445566', email: 'info@alledbanc.com', guests: 350, menu: 'Premium', decor: 'Classic White', advance: 150000, totalAmount: 620000, paymentStatus: 'paid', status: 'completed', notes: '' },
  { id: 'VF-006', date: '2024-10-22', time: '19:00', hallId: 4, hall: 'Pearl Suite', eventType: 'Anniversary Ball', customer: 'Rina Polko', phone: '+92 312 7778899', email: 'rina@email.com', guests: 120, menu: 'Standard', decor: 'Classic White', advance: 50000, totalAmount: 220000, paymentStatus: 'paid', status: 'completed', notes: 'Anniversary milestone event.' },
  { id: 'VF-007', date: '2024-09-10', time: '17:00', hallId: 1, hall: 'Royal Grand Hall', eventType: 'Wedding', customer: 'Hamza Raza', phone: '+92 300 2223344', email: 'hamza@email.com', guests: 750, menu: 'Platinum', decor: 'Royal Gold', advance: 300000, totalAmount: 1200000, paymentStatus: 'paid', status: 'completed', notes: '' },
  { id: 'VF-008', date: '2024-12-18', time: '20:00', hallId: 3, hall: 'Garden Pavilion', eventType: 'Mehndi', customer: 'Ayesha Siddiqui', phone: '+92 322 6667788', email: 'ayesha@email.com', guests: 200, menu: 'Standard', decor: 'Garden Fresh', advance: 60000, totalAmount: 330000, paymentStatus: 'pending', status: 'upcoming', notes: '' },
]

export const bookingRequests = [
  { id: 'REQ-001', customer: 'Omar Farooq', phone: '+92 333 5556677', email: 'omar.f@email.com', eventType: 'Wedding', requestedDate: '2025-02-14', hall: 'Royal Grand Hall', guests: 600, message: 'Looking for full wedding package with catering.', status: 'pending', receivedAt: '2024-11-20' },
  { id: 'REQ-002', customer: 'Elena Moretti', phone: '+92 301 1112233', email: 'elena@email.com', eventType: 'Corporate Event', requestedDate: '2025-01-20', hall: 'Crystal Ballroom', guests: 200, message: 'Annual company dinner for 200 staff.', status: 'contacted', receivedAt: '2024-11-18' },
  { id: 'REQ-003', customer: 'Julian Thorne', phone: '+92 345 9990011', email: 'julian@email.com', eventType: 'Birthday', requestedDate: '2025-01-05', hall: 'Pearl Suite', guests: 80, message: 'Birthday party for 80 guests, evening.', status: 'pending', receivedAt: '2024-11-15' },
  { id: 'REQ-004', customer: 'Nadia Hassan', phone: '+92 312 4445566', email: 'nadia@email.com', eventType: 'Mehndi', requestedDate: '2025-03-08', hall: 'Garden Pavilion', guests: 180, message: 'Mehndi function with colourful décor.', status: 'pending', receivedAt: '2024-11-22' },
]

export const transactions = [
  { id: 'TXN-001', bookingId: 'VF-001', customer: 'Zubair Khan', eventType: 'Wedding', date: '2024-11-10', amount: 200000, type: 'advance', status: 'paid' },
  { id: 'TXN-002', bookingId: 'VF-005', customer: 'Alled Banc', eventType: 'Corporate Gala', date: '2024-10-05', amount: 620000, type: 'full', status: 'paid' },
  { id: 'TXN-003', bookingId: 'VF-006', customer: 'Rina Polko', eventType: 'Anniversary Ball', date: '2024-10-15', amount: 220000, type: 'full', status: 'paid' },
  { id: 'TXN-004', bookingId: 'VF-007', customer: 'Hamza Raza', eventType: 'Wedding', date: '2024-09-01', amount: 1200000, type: 'full', status: 'paid' },
  { id: 'TXN-005', bookingId: 'VF-002', customer: 'Sarah Ahmed', eventType: 'Barat', date: '2024-11-12', amount: 100000, type: 'advance', status: 'paid' },
  { id: 'TXN-006', bookingId: 'VF-004', customer: 'Fatima Malik', eventType: 'Barat', date: '2024-11-15', amount: 250000, type: 'advance', status: 'paid' },
]

export const expenses = [
  { id: 'EXP-001', bookingId: 'VF-001', description: 'Catering - Platinum Package', amount: 520000, date: '2024-11-24', category: 'catering' },
  { id: 'EXP-002', bookingId: 'VF-001', description: 'Royal Gold Décor Setup', amount: 150000, date: '2024-11-24', category: 'decor' },
  { id: 'EXP-003', bookingId: 'VF-005', description: 'Premium Catering Package', amount: 280000, date: '2024-10-15', category: 'catering' },
  { id: 'EXP-004', bookingId: 'VF-005', description: 'Classic White Décor', amount: 80000, date: '2024-10-15', category: 'decor' },
  { id: 'EXP-005', bookingId: 'VF-005', description: 'AV Equipment Rental', amount: 45000, date: '2024-10-15', category: 'equipment' },
  { id: 'EXP-006', bookingId: 'VF-007', description: 'Platinum Catering', amount: 630000, date: '2024-09-10', category: 'catering' },
  { id: 'EXP-007', bookingId: 'VF-007', description: 'Royal Gold Décor', amount: 150000, date: '2024-09-10', category: 'decor' },
]

export const monthlyRevenue = [
  { month: 'Jun', revenue: 820000 },
  { month: 'Jul', revenue: 1100000 },
  { month: 'Aug', revenue: 950000 },
  { month: 'Sep', revenue: 1350000 },
  { month: 'Oct', revenue: 1680000 },
  { month: 'Nov', revenue: 2100000 },
]

export const wasteLogs = [
  { bookingId: 'VF-005', item: 'Biryani', quantity: '15 kg', note: 'Overestimated guest count', date: '2024-10-15' },
  { bookingId: 'VF-007', item: 'Naan', quantity: '200 pieces', note: 'Late arrivals, surplus', date: '2024-09-10' },
]
