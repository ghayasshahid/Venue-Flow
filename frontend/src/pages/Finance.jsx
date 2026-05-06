import { useState } from 'react'
import { TrendingUp, TrendingDown, Clock, Plus, Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import StatusBadge from '../components/StatusBadge'
import { transactions, monthlyRevenue, expenses, bookings } from '../data/mockData'

const COLORS = ['#C8A96E', '#4F8EF7', '#22C55E', '#F59E0B']

const revenueDistribution = [
  { name: 'Catering', value: 58 },
  { name: 'Hall Rental', value: 27 },
  { name: 'Décor', value: 10 },
  { name: 'Other', value: 5 },
]

const exportTxCSV = (rows) => {
  const headers = ['ID', 'Booking', 'Customer', 'Event', 'Date', 'Amount (PKR)', 'Type', 'Status']
  const csv = [headers, ...rows.map(t => [t.id, t.bookingId, t.customer, t.eventType, t.date, t.amount, t.type, t.status])].map(r => r.join(',')).join('\n')
  const a = document.createElement('a'); a.href = 'data:text/csv,' + encodeURIComponent(csv); a.download = 'transactions.csv'; a.click()
}

export default function Finance() {
  const [txFilter, setTxFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [expenseForm, setExpenseForm] = useState({ description: '', amount: '', category: 'catering' })
  const [toast, setToast] = useState('')
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const totalRevenue = transactions.filter(t => t.status === 'paid').reduce((s, t) => s + t.amount, 0)
  const pendingRevenue = bookings.filter(b => b.paymentStatus === 'pending').reduce((s, b) => s + (b.totalAmount - b.advance), 0)
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)

  const filtered = transactions.filter(t => {
    const matchType = txFilter === 'all' || t.type === txFilter || t.status === txFilter
    const matchFrom = !dateFrom || t.date >= dateFrom
    const matchTo = !dateTo || t.date <= dateTo
    return matchType && matchFrom && matchTo
  })

  const formatPKR = (v) => `${(v / 1000000).toFixed(1)}M`

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-sidebar text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">{toast}</div>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-text-primary">Add Expense</p>
              <button onClick={() => setShowAddExpense(false)} className="text-text-muted hover:text-text-primary">×</button>
            </div>
            <div><label className="label">Description</label><input value={expenseForm.description} onChange={e => setExpenseForm(f => ({ ...f, description: e.target.value }))} className="input" placeholder="e.g. Catering supplies" /></div>
            <div><label className="label">Amount (PKR)</label><input type="number" value={expenseForm.amount} onChange={e => setExpenseForm(f => ({ ...f, amount: e.target.value }))} className="input" placeholder="50000" /></div>
            <div><label className="label">Category</label>
              <select value={expenseForm.category} onChange={e => setExpenseForm(f => ({ ...f, category: e.target.value }))} className="input">
                <option value="catering">Catering</option><option value="decor">Décor</option>
                <option value="equipment">Equipment</option><option value="staff">Staff</option><option value="other">Other</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowAddExpense(false)} className="btn-secondary">Cancel</button>
              <button onClick={() => { setShowAddExpense(false); showToast('Expense added!') }} className="btn-primary">Add Expense</button>
            </div>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="label">Total Revenue</p>
              <p className="text-2xl font-bold text-text-primary mt-1">PKR {(totalRevenue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1.5"><TrendingUp size={12} /> +8.2% this month</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp size={18} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="label">Pending Receivables</p>
              <p className="text-2xl font-bold text-text-primary mt-1">PKR {(pendingRevenue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-amber-600 flex items-center gap-1 mt-1.5"><Clock size={12} /> Outstanding balances</p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock size={18} className="text-amber-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="label">Total Expenses</p>
              <p className="text-2xl font-bold text-text-primary mt-1">PKR {(totalExpenses / 1000).toFixed(0)}K</p>
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1.5"><TrendingDown size={12} /> Across all events</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <TrendingDown size={18} className="text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <p className="font-semibold text-text-primary mb-4">Quarterly Revenue Performance</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyRevenue} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E5DC" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatPKR} tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} width={45} />
              <Tooltip formatter={(v) => [`PKR ${v.toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: 8, border: '1px solid #E8E5DC', fontSize: 12 }} />
              <Bar dataKey="revenue" fill="#C8A96E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <p className="font-semibold text-text-primary mb-4">Revenue Distribution</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={revenueDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {revenueDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            <div className="flex justify-between text-xs"><span className="text-text-muted">Add Expense</span><button onClick={() => setShowAddExpense(true)} className="text-accent font-medium hover:underline flex items-center gap-1"><Plus size={11} />Add</button></div>
            <div className="flex justify-between text-xs"><span className="text-text-muted">Issue Invoice</span><button onClick={() => showToast('Invoice generator coming soon.')} className="text-accent font-medium hover:underline">Generate</button></div>
            <div className="flex justify-between text-xs"><span className="text-text-muted">Tax Statements</span><button onClick={() => exportTxCSV(filtered)} className="text-accent font-medium hover:underline">Export</button></div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="card p-0 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-border">
          <p className="font-semibold text-text-primary flex-1">Recent Transactions</p>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="input w-36 py-1.5 text-xs" />
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="input w-36 py-1.5 text-xs" />
          <select value={txFilter} onChange={e => setTxFilter(e.target.value)} className="input w-36 py-1.5 text-xs">
            <option value="all">All Types</option>
            <option value="paid">Paid</option>
            <option value="advance">Advance</option>
            <option value="full">Full Payment</option>
          </select>
          <button onClick={() => exportTxCSV(filtered)} className="btn-secondary text-xs py-1.5 flex items-center gap-1.5">
            <Download size={13} /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream/60">
              <tr>
                {['Transaction', 'Client / Event', 'Booking', 'Date', 'Amount', 'Type', 'Status'].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-cream/40 transition-colors">
                  <td className="table-td font-mono text-xs text-text-muted">{t.id}</td>
                  <td className="table-td">
                    <p className="font-medium">{t.customer}</p>
                    <p className="text-xs text-text-muted">{t.eventType}</p>
                  </td>
                  <td className="table-td font-mono text-xs text-text-muted">{t.bookingId}</td>
                  <td className="table-td text-text-muted">{t.date}</td>
                  <td className="table-td font-semibold">PKR {t.amount.toLocaleString()}</td>
                  <td className="table-td"><StatusBadge status={t.type} /></td>
                  <td className="table-td"><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
