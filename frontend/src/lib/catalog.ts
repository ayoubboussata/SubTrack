import type { CatalogItem } from '../types'

// Quick-add catalog: popular services with sensible defaults. One click prefills
// the subscription form (no backend endpoint — see the "Quick-Add Catalog" decision).
export const CATALOG: CatalogItem[] = [
  { name: 'Netflix', price: 13.99, category: 'Streaming', color: '#E50914' },
  { name: 'Spotify', price: 10.99, category: 'Music', color: '#1DB954' },
  { name: 'Disney+', price: 8.99, category: 'Streaming', color: '#1a6ee0' },
  { name: 'YouTube Premium', price: 11.99, category: 'Streaming', color: '#FF0000' },
  { name: 'Amazon Prime', price: 8.99, category: 'Streaming', color: '#00A8E1' },
  { name: 'Xbox Game Pass', price: 12.99, category: 'Gaming', color: '#107C10' },
  { name: 'PlayStation Plus', price: 8.99, category: 'Gaming', color: '#003791' },
  { name: 'Basic-Fit', price: 24.99, category: 'Fitness', color: '#FF6A00' },
  { name: 'iCloud+', price: 2.99, category: 'Software', color: '#3693F3' },
  { name: 'Adobe Creative Cloud', price: 59.99, category: 'Software', color: '#DA1F26' },
  { name: 'ChatGPT Plus', price: 20.0, category: 'Software', color: '#10A37F' },
  { name: 'Dropbox', price: 11.99, category: 'Software', color: '#0061FF' },
]
