import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import api, { setAccessToken, setRefreshHandler } from '../lib/api'
import type { AuthResponse } from '../types'

interface AuthUser {
  email: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  booting: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const REFRESH_KEY = 'subtrack_refresh_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [booting, setBooting] = useState(true)

  const applyAuth = useCallback((data: AuthResponse) => {
    setAccessToken(data.accessToken) // in-memory, for api.ts
    setUser({ email: data.email })
    localStorage.setItem(REFRESH_KEY, data.refreshToken)
  }, [])

  const clearAuth = useCallback(() => {
    setAccessToken(null)
    setUser(null)
    localStorage.removeItem(REFRESH_KEY)
  }, [])

  // Exchange the stored refresh token for a fresh pair. Returns the new access
  // token (or null on failure). Used both on boot and by the 401 interceptor.
  const refresh = useCallback(async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem(REFRESH_KEY)
    if (!refreshToken) {
      clearAuth()
      return null
    }
    try {
      const { data } = await api.post<AuthResponse>('/auth/refresh', { refreshToken })
      applyAuth(data)
      return data.accessToken
    } catch {
      clearAuth()
      return null
    }
  }, [applyAuth, clearAuth])

  // Keep the interceptor's refresh handler pointed at the latest closure.
  useEffect(() => {
    setRefreshHandler(refresh)
  }, [refresh])

  // Bootstrap a session from the stored refresh token on first load.
  useEffect(() => {
    const stored = localStorage.getItem(REFRESH_KEY)
    if (stored) {
      refresh().finally(() => setBooting(false))
    } else {
      setBooting(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
      applyAuth(data)
    },
    [applyAuth],
  )

  const register = useCallback(
    async (email: string, password: string) => {
      const { data } = await api.post<AuthResponse>('/auth/register', { email, password })
      applyAuth(data)
    },
    [applyAuth],
  )

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      /* revoke is best-effort */
    }
    clearAuth()
  }, [clearAuth])

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    booting,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
