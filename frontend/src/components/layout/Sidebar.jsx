import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Upload, FileText, MessageSquare,
  Settings, LogOut, X, ChevronRight,
} from 'lucide-react'
import useAuth from '../../context/useAuth'
import Logo from '../common/Logo'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/app', icon: LayoutDashboard, end: true },
  { label: 'Upload Document', to: '/app/upload', icon: Upload },
  { label: 'My Documents', to: '/app/documents', icon: FileText },
  { label: 'Ask FormSaathi', to: '/app/ask', icon: MessageSquare },
  { label: 'Accessibility', to: '/app/accessibility', icon: Settings },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/', { replace: true })
      toast.success('Signed out successfully')
    } catch {
      toast.error('Sign out failed. Please try again.')
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white border-r border-green-100 shadow-soft transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Application sidebar"
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-green-100">
          <Logo />
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-green-50 hover:text-primary-700 transition"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="px-4 py-4 border-b border-green-100">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-50">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white font-bold text-sm flex-shrink-0">
                {(user.email?.[0] || 'U').toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-primary-800 truncate">
                  {user.user_metadata?.full_name || 'Welcome!'}
                </p>
                <p className="text-xs text-primary-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Sidebar navigation">
          <p className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-sage-500">Menu</p>
          {NAV_ITEMS.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition group ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-green'
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? 'text-white' : 'text-primary-500 group-hover:text-primary-600'} />
                  <span className="flex-1">{label}</span>
                  <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition ${isActive ? 'opacity-100 text-white' : 'text-primary-400'}`} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-green-100">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
