import { AxiosError } from 'axios'
import type { BillingCycle, Category } from '../types'

export const CATEGORIES: Category[] = [
  'Streaming',
  'Music',
  'Gaming',
  'Fitness',
  'Software',
  'Utilities',
  'Other',
]

export const CYCLES: BillingCycle[] = ['Monthly', 'Yearly']

// Distinct hues per category, used for badges and the dashboard pie chart.
export const CATEGORY_COLORS: Record<Category, string> = {
  Streaming: '#f43f5e',
  Music: '#10b981',
  Gaming: '#8b5cf6',
  Fitness: '#f59e0b',
  Software: '#3b82f6',
  Utilities: '#06b6d4',
  Other: '#94a3b8',
}

export function formatMoney(amount: number, currency = 'EUR'): string {
  try {
    return new Intl.NumberFormat('nl-BE', { style: 'currency', currency }).format(amount ?? 0)
  } catch {
    return `${(amount ?? 0).toFixed(2)} ${currency}`
  }
}

export function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('nl-BE', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function daysUntil(iso: string | null): number | null {
  if (!iso) return null
  const target = new Date(iso)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

interface ProblemDetails {
  detail?: string
  title?: string
  errors?: Record<string, string[]>
}

// Turns an axios error into a readable message (backend returns ProblemDetails /
// FluentValidation error shapes).
export function errorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (err instanceof AxiosError) {
    const data = err.response?.data as ProblemDetails | string | undefined
    if (!data) return err.message || fallback
    if (typeof data === 'string') return data
    if (data.errors) return Object.values(data.errors).flat().join(' ')
    return data.detail || data.title || fallback
  }
  return fallback
}
