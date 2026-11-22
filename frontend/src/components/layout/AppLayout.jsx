import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, Moon, Sun, Accessibility } from 'lucide-react'
import Sidebar from './Sidebar'
import Logo from '../common/Logo'
import { useAccessibility } from '../../context/AccessibilityContext'
import { Link } from 'react-router-dom'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { preferences, updatePreference } = useAccessibility()

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-w-0 flex-1 flex flex-col">
        {/* Mobile top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-green-100 bg-white/95 backdrop-blur-md px-4 sm:px-6 lg:hidden shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-xl text-primary-700 border border-green-200 hover:bg-primary-50 transition"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu size={18} />
            </button>
            <Logo compact />
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/app/accessibility"
              className="p-2 rounded-xl border border-green-200 text-primary-600 hover:bg-primary-50 transition"
              aria-label="Accessibility settings"
            >
              <Accessibility size={16} />
            </Link>
            <button
              onClick={() => updatePreference('darkMode', !preferences.darkMode)}
              className="p-2 rounded-xl border border-green-200 text-primary-600 hover:bg-primary-50 transition"
              aria-label={preferences.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {preferences.darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        {/* Desktop top bar */}
        <header className="hidden lg:flex sticky top-0 z-30 h-16 items-center justify-between border-b border-green-100 bg-white/95 backdrop-blur-md px-6 xl:px-8 shadow-sm">
          <div />
          <div className="flex items-center gap-2">
            <Link
              to="/app/accessibility"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-200 text-sm text-primary-600 hover:bg-primary-50 transition font-medium"
            >
              <Accessibility size={14} />
              Accessibility
            </Link>
            <button
              onClick={() => updatePreference('darkMode', !preferences.darkMode)}
              className="p-2 rounded-lg border border-green-200 text-primary-600 hover:bg-primary-50 transition"
              aria-label={preferences.darkMode ? 'Light mode' : 'Dark mode'}
            >
              {preferences.darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
