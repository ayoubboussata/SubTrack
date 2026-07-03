import { useCallback, useEffect, useState } from 'react'
import api from '../lib/api'
import { CATEGORIES, errorMessage } from '../lib/format'
import type { CatalogItem, Category, Subscription } from '../types'
import SubscriptionCard from '../components/SubscriptionCard'
import SubscriptionModal from '../components/SubscriptionModal'
import QuickAddModal from '../components/QuickAddModal'
import ConfirmDialog from '../components/ConfirmDialog'
import Spinner from '../components/Spinner'

type StatusFilter = 'all' | 'active' | 'inactive'

export default function Subscriptions() {
  const [subs, setSubs] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState<Category | ''>('')
  const [status, setStatus] = useState<StatusFilter>('all')

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Subscription | CatalogItem | null>(null)
  const [quickOpen, setQuickOpen] = useState(false)
  const [deleting, setDeleting] = useState<Subscription | null>(null)
  const [deletingBusy, setDeletingBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params: Record<string, string | boolean> = {}
      if (category) params.category = category
      if (status !== 'all') params.isActive = status === 'active'
      const { data } = await api.get<Subscription[]>('/subscriptions', { params })
      setSubs(data)
    } catch (err) {
      setError(errorMessage(err, 'Could not load subscriptions.'))
    } finally {
      setLoading(false)
    }
  }, [category, status])

  useEffect(() => {
    load()
  }, [load])

  const openAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (sub: Subscription) => {
    setEditing(sub)
    setFormOpen(true)
  }
  const onPick = (item: CatalogItem) => {
    setQuickOpen(false)
    setEditing(item)
    setFormOpen(true)
  }
  const onSaved = () => {
    setFormOpen(false)
    setEditing(null)
    load()
  }

  const confirmDelete = async () => {
    if (!deleting) return
    setDeletingBusy(true)
    try {
      await api.delete(`/subscriptions/${deleting.id}`)
      setDeleting(null)
      load()
    } catch (err) {
      setError(errorMessage(err, 'Could not delete the subscription.'))
    } finally {
      setDeletingBusy(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
          <p className="text-sm text-slate-400">{subs.length} shown</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost" onClick={() => setQuickOpen(true)}>⚡ Quick add</button>
          <button className="btn btn-primary" onClick={openAdd}>+ Add</button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <select
          className="input max-w-[12rem]"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category | '')}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          className="input max-w-[10rem]"
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <Spinner label="Loading subscriptions…" />
      ) : subs.length === 0 ? (
        <div className="card grid place-items-center gap-3 p-12 text-center">
          <p className="text-slate-300">No subscriptions yet.</p>
          <div className="flex gap-2">
            <button className="btn btn-ghost" onClick={() => setQuickOpen(true)}>Quick add</button>
            <button className="btn btn-primary" onClick={openAdd}>Add your first</button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subs.map((s) => (
            <SubscriptionCard key={s.id} sub={s} onEdit={openEdit} onDelete={(sub) => setDeleting(sub)} />
          ))}
        </div>
      )}

      <SubscriptionModal open={formOpen} initial={editing} onClose={() => setFormOpen(false)} onSaved={onSaved} />
      <QuickAddModal open={quickOpen} onClose={() => setQuickOpen(false)} onPick={onPick} />
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete subscription"
        message={`Delete “${deleting?.name}”? This cannot be undone.`}
        loading={deletingBusy}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
