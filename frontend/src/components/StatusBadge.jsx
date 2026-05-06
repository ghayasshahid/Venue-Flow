const config = {
  paid:      { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Paid' },
  pending:   { bg: 'bg-amber-100',  text: 'text-amber-700',  label: 'Pending' },
  cancelled: { bg: 'bg-red-100',    text: 'text-red-600',    label: 'Cancelled' },
  upcoming:  { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Upcoming' },
  completed: { bg: 'bg-gray-100',   text: 'text-gray-600',   label: 'Completed' },
  contacted: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Contacted' },
  full:      { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Full Payment' },
  advance:   { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Advance' },
}

export default function StatusBadge({ status }) {
  const c = config[status] || config.pending
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  )
}
