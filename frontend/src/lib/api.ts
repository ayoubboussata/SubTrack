import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

// All requests go through the Vite dev proxy (/api -> http://localhost:5052).
const api = axios.create({ baseURL: '/api' })

// The access token lives in memory (set by AuthContext). The refresh flow is
// injected as a handler so this module stays framework-agnostic.
let accessToken: string | null = null
let refreshHandler: (() => Promise<string | null>) | null = null

export function setAccessToken(token: string | null): void {
  accessToken = token
}

export function setRefreshHandler(fn: (() => Promise<string | null>) | null): void {
  refreshHandler = fn
}

// Attach the bearer token to every request.
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// On a 401, try to refresh the token once, then replay the original request.
// Auth endpoints are excluded so a failed login/refresh doesn't loop.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
    const isAuthCall = original?.url?.includes('/auth/')

    if (error.response?.status === 401 && original && !original._retry && !isAuthCall && refreshHandler) {
      original._retry = true
      const newToken = await refreshHandler()
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      }
    }
    return Promise.reject(error)
  },
)

export default api
