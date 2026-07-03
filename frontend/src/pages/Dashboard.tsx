import { useEffect, useState } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { CATEGORY_COLORS, daysUntil, errorMessage, formatDate, formatMoney } from '../lib/format'
import type { DashboardSummary } from '../types'
import StatCard from '../components/StatCard'
import Spinner from '../components/Spinner'

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    api
      .get<DashboardSummary>('/dashboard/summary')
      .then(({ data }) => {
        if (active) setSummary(data)
      })
      .catch((err) => {
        if (active) setError(errorMessage(err, 'Could not load the dashboard.'))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  if (loading) return <Spinner label="Loading dashboard…" />
  if (error) {
    return (
      <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
        {error}
      </div>
    )
  }
  if (!summary) return null

  const { totalMonthlyCost, totalYearlyCost, costPerCategory, upcomingRenewals } = summary
  const hasData = costPerCategory.length > 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-slate-400">Your subscription costs at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Monthly cost" value={formatMoney(totalMonthlyCost)} accent />
        <StatCard label="Yearly cost" value={formatMoney(totalYearlyCost)} />
        <StatCard label="Categories" value={costPerCategory.length} hint="active subscriptions grouped" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-4 font-semibold text-white">Cost per category</h2>
          {hasData ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costPerCategory}
                    dataKey="monthlyCost"
                    nameKey="category"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {costPerCategory.map((c) => (
                      <Cell key={c.category} fill={CATEGORY_COLORS[c.category] ?? '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatMoney(Number(value))}
                    contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend
                    iconType="circle"
                    formatter={(value) => <span style={{ color: '#cbd5e1' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-slate-400">No active subscriptions yet.</p>
          )}
        </div>

        <div className="card p-5">
          <h2 className="mb-4 font-semibold text-white">Renewing in the next 30 days</h2>
          {upcomingRenewals.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400">Nothing due soon. 🎉</p>
          ) : (
            <ul className="divide-y divide-slate-800">
              {upcomingRenewals.map((s) => {
                const days = daysUntil(s.nextRenewalDate)
                const color = CATEGORY_COLORS[s.category] ?? '#94a3b8'
                return (
                  <li key={s.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{s.name}</p>
                        <p className="text-xs text-slate-400">
                          {formatDate(s.nextRenewalDate)}
                          {days !== null && days >= 0 ? ` · in ${days}d` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-slate-200">
                      {formatMoney(s.price, s.currency)}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="text-center">
        <Link to="/subscriptions" className="text-sm font-medium text-emerald-400 hover:text-emerald-300">
          Manage subscriptions →
        </Link>
      </div>
    </div>
  )
}
