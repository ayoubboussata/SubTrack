// Domain types mirroring the backend DTOs.

export type BillingCycle = 'Monthly' | 'Yearly'

export type Category =
  | 'Streaming'
  | 'Music'
  | 'Gaming'
  | 'Fitness'
  | 'Software'
  | 'Utilities'
  | 'Other'

export interface Subscription {
  id: string
  name: string
  price: number
  currency: string
  billingCycle: BillingCycle
  nextRenewalDate: string // ISO date (yyyy-MM-dd)
  category: Category
  isActive: boolean
  notes: string | null
  createdAt: string
  updatedAt: string
}

/** Payload for creating/updating a subscription. */
export interface SubscriptionInput {
  name: string
  price: number
  currency: string
  billingCycle: BillingCycle
  nextRenewalDate: string
  category: Category
  isActive: boolean
  notes: string | null
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: string
  email: string
}

export interface CategoryCost {
  category: Category
  monthlyCost: number
}

export interface DashboardSummary {
  totalMonthlyCost: number
  totalYearlyCost: number
  costPerCategory: CategoryCost[]
  upcomingRenewals: Subscription[]
}

export interface CatalogItem {
  name: string
  price: number
  category: Category
  color: string
}
