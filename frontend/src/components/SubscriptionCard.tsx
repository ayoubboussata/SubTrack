import { CATEGORY_COLORS, daysUntil, formatDate, formatMoney } from '../lib/format'
import type { Subscription } from '../types'

interface Props {
  sub: Subscription
  onEdit: (sub: Subscription) => void
  onDelete: (sub: Subscription) => void
}

export default function SubscriptionCard({ sub, onEdit, onDelete }: Props) {
  const color = CATEGORY_COLORS[sub.category] ?? '#94a3b8'
  const days = daysUntil(sub.nextRenewalDate)
  const soon = days !== null && days >= 0 && days <= 7

  return (
    <div className="card flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {sub.name.trim().charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold leading-tight text-white">{sub.name}</h3>
            <span className="badge mt-1" style={{ backgroundColor: color + '22', color }}>
              {sub.category}
            </span>
          </div>
        </div>
        {!sub.isActive && <span className="badge bg-slate-700 text-slate-300">Inactive</span>}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-white">{formatMoney(sub.price, sub.currency)}</p>
          <p className="text-xs text-slate-400">/ {sub.billingCycle === 'Yearly' ? 'year' : 'month'}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Next renewal</p>
          <p className={`text-sm font-medium ${soon ? 'text-emerald-400' : 'text-slate-200'}`}>
            {formatDate(sub.nextRenewalDate)}
          </p>
          {days !== null && days >= 0 && (
            <p className="text-xs text-slate-500">in {days} day{days === 1 ? '' : 's'}</p>
          )}
        </div>
      </div>

      {sub.notes && <p className="line-clamp-2 text-sm text-slate-400">{sub.notes}</p>}

      <div className="mt-auto flex gap-2 border-t border-slate-800 pt-3">
        <button onClick={() => onEdit(sub)} className="btn btn-ghost flex-1 py-1.5">
          Edit
        </button>
        <button onClick={() => onDelete(sub)} className="btn py-1.5 text-red-300 hover:bg-red-500/10">
          Delete
        </button>
      </div>
    </div>
  )
}
