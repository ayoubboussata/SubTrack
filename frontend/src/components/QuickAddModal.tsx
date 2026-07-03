import Modal from './Modal'
import { CATALOG } from '../lib/catalog'
import type { CatalogItem } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  onPick: (item: CatalogItem) => void
}

export default function QuickAddModal({ open, onClose, onPick }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Quick add a subscription" size="max-w-2xl">
      <p className="mb-4 text-sm text-slate-400">
        Pick a service to prefill the form — you can still adjust the price and date.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CATALOG.map((item) => (
          <button
            key={item.name}
            onClick={() => onPick(item)}
            className="flex flex-col items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-center transition hover:border-emerald-500/50 hover:bg-slate-800"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: item.color }}
            >
              {item.name.charAt(0)}
            </div>
            <span className="text-xs font-medium leading-tight text-slate-200">{item.name}</span>
            <span className="text-xs text-slate-500">€{item.price.toFixed(2)}/mo</span>
          </button>
        ))}
      </div>
    </Modal>
  )
}
