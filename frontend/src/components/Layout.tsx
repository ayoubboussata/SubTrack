import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function BrandMark() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-950">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19V11M10 19V5M16 19v-5M2 19h20" />
      </svg>
    </div>
  )
}

function linkClass({ isActive }: { isActive: boolean }): string {
  return `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
    isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
  }`
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <BrandMark />
              <span className="text-lg font-semibold tracking-tight text-white">
                Sub<span className="text-emerald-400">Track</span>
              </span>
            </div>
            <nav className="flex items-center gap-1">
              <NavLink to="/" end className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/subscriptions" className={linkClass}>
                Subscriptions
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-400 sm:inline">{user?.email}</span>
            <button onClick={handleLogout} className="btn btn-ghost py-1.5">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
