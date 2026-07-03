import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import Modal from './Modal'
import api from '../lib/api'
import { CATEGORIES, CYCLES, errorMessage } from '../lib/format'
import type { BillingCycle, Category, Subscription, SubscriptionInput } from '../types'

interface FormState {
  name: string
  price: string
  currency: string
  billingCycle: BillingCycle
  category: Category
  nextRenewalDate: string
  isActive: boolean
  notes: string
}

function defaultRenewal(): string {
  const d = new Date()
  d.setMonth(d.getMonth() + 1)
  return d.toISOString().slice(0, 10)
}

function toForm(x: Partial<Subscription> = {}): FormState {
  return {
    name: x.name ?? '',
    price: x.price != null ? String(x.price) : '',
    currency: x.currency ?? 'EUR',
    billingCycle: x.billingCycle ?? 'Monthly',
    category: x.category ?? 'Other',
    nextRenewalDate: x.nextRenewalDate ?? defaultRenewal(),
    isActive: x.isActive ?? true,
    notes: x.notes ?? '',
  }
}

interface Props {
  open: boolean
  initial: Partial<Subscription> | null
  onClose: () => void
  onSaved: () => void
}

export default function SubscriptionModal({ open, initial, onClose, onSaved }: Props) {
  const [form, setForm] = useState<FormState>(toForm())
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const isEdit = Boolean(initial?.id)

  useEffect(() => {
    if (open) {
      setForm(toForm(initial ?? {}))
      setError('')
    }
  }, [open, initial])

  const set =
    (key: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const target = e.target
      const value =
        target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value
      setForm((f) => ({ ...f, [key]: value }) as FormState)
    }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    const payload: SubscriptionInput = {
      name: form.name.trim(),
      price: Number(form.price),
      currency: form.currency.trim().toUpperCase(),
      billingCycle: form.billingCycle,
      nextRenewalDate: form.nextRenewalDate,
      category: form.category,
      isActive: form.isActive,
      notes: form.notes.trim() || null,
    }
    try {
      if (isEdit && initial?.id) {
        await api.put(`/subscriptions/${initial.id}`, payload)
      } else {
        await api.post('/subscriptions', payload)
      }
      onSaved()
    } catch (err) {
      setError(errorMessage(err, 'Could not save the subscription.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit subscription' : 'Add subscription'}>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        <div>
          <label className="label" htmlFor="name">Name</label>
          <input id="name" className="input" required value={form.name} onChange={set('name')} placeholder="Netflix" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="label" htmlFor="price">Price</label>
            <input id="price" type="number" min="0" step="0.01" className="input" required value={form.price} onChange={set('price')} placeholder="13.99" />
          </div>
          <div>
            <label className="label" htmlFor="currency">Currency</label>
            <input id="currency" className="input uppercase" maxLength={3} value={form.currency} onChange={set('currency')} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="billingCycle">Billing cycle</label>
            <select id="billingCycle" className="input" value={form.billingCycle} onChange={set('billingCycle')}>
              {CYCLES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="category">Category</label>
            <select id="category" className="input" value={form.category} onChange={set('category')}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="nextRenewalDate">Next renewal</label>
          <input id="nextRenewalDate" type="date" className="input" required value={form.nextRenewalDate} onChange={set('nextRenewalDate')} />
        </div>

        <div>
          <label className="label" htmlFor="notes">Notes <span className="text-slate-500">(optional)</span></label>
          <textarea id="notes" rows={2} className="input resize-none" value={form.notes} onChange={set('notes')} placeholder="Family plan, shared with…" />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-600 bg-slate-900 accent-emerald-500" checked={form.isActive} onChange={set('isActive')} />
          Active subscription
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add subscription'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
