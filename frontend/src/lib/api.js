const BASE = 'http://localhost:5000/api/admin'

const getToken = () => localStorage.getItem('vf_token')

const request = async (method, path, body) => {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  delete: (path) => request('DELETE', path),
}

// Auth
export const login = (email, password) => api.post('/auth/login', { email, password })
export const getMe = () => api.get('/auth/me')

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats')
export const getRecentBookings = () => api.get('/dashboard/recent-bookings')
export const getMonthlyRevenue = () => api.get('/dashboard/monthly-revenue')

// Halls
export const getHalls = () => api.get('/halls')
export const createHall = (data) => api.post('/halls', data)
export const updateHall = (id, data) => api.put(`/halls/${id}`, data)
export const deleteHall = (id) => api.delete(`/halls/${id}`)

// Bookings
export const getBookings = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return api.get(`/bookings${qs ? `?${qs}` : ''}`)
}
export const getBooking = (id) => api.get(`/bookings/${id}`)
export const createBooking = (data) => api.post('/bookings', data)
export const updateBooking = (id, data) => api.put(`/bookings/${id}`, data)
export const deleteBooking = (id) => api.delete(`/bookings/${id}`)
export const exportBookingsCSV = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  const token = getToken()
  const url = `${BASE}/bookings/export${qs ? `?${qs}` : ''}`
  const a = document.createElement('a')
  a.href = url
  a.setAttribute('download', 'bookings.csv')
  // Pass token via URL is not ideal; use a hidden fetch-blob approach
  fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    .then((r) => r.blob())
    .then((blob) => {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'bookings.csv'
      link.click()
    })
}

// Public — no auth token required
export const getPublicHalls = () =>
  fetch('http://localhost:5000/api/public/halls').then(async (r) => {
    const json = await r.json()
    if (!r.ok) throw new Error(json.message || 'Failed to load halls')
    return json
  })

export const getPublicAvailability = (year, month) =>
  fetch(`http://localhost:5000/api/public/availability?year=${year}&month=${month}`).then(async (r) => {
    const json = await r.json()
    if (!r.ok) throw new Error(json.message || 'Failed to load availability')
    return json
  })

export const createBookingRequest = (data) =>
  fetch('http://localhost:5000/api/admin/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(async (res) => {
    const json = await res.json()
    if (!res.ok) throw new Error(json.message || 'Failed to submit request')
    return json
  })

// Requests
export const getRequests = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return api.get(`/requests${qs ? `?${qs}` : ''}`)
}
export const updateRequest = (id, data) => api.put(`/requests/${id}`, data)
export const deleteRequest = (id) => api.delete(`/requests/${id}`)

// Finance
export const getFinanceSummary = () => api.get('/finance/summary')
export const getTransactions = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return api.get(`/finance/transactions${qs ? `?${qs}` : ''}`)
}
export const createTransaction = (data) => api.post('/finance/transactions', data)
export const getExpenses = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return api.get(`/finance/expenses${qs ? `?${qs}` : ''}`)
}
export const createExpense = (data) => api.post('/finance/expenses', data)
export const deleteExpense = (id) => api.delete(`/finance/expenses/${id}`)

// Reports
export const getOverviewReport = (year) => api.get(`/reports/overview?year=${year}`)
export const getEventTypeReport = () => api.get('/reports/event-types')
export const getHallUtilization = () => api.get('/reports/hall-utilization')

// Menu Packages
export const getMenuPackages = () => api.get('/menu-packages')
export const createMenuPackage = (data) => api.post('/menu-packages', data)
export const updateMenuPackage = (id, data) => api.put(`/menu-packages/${id}`, data)
export const deleteMenuPackage = (id) => api.delete(`/menu-packages/${id}`)

// Decor Packages
export const getDecorPackages = () => api.get('/decor-packages')
export const createDecorPackage = (data) => api.post('/decor-packages', data)
export const updateDecorPackage = (id, data) => api.put(`/decor-packages/${id}`, data)
export const deleteDecorPackage = (id) => api.delete(`/decor-packages/${id}`)
