import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Menu,
  X,
  Upload,
  FileText,
  Accessibility,
  Sun,
  Moon,
  LogIn,
} from 'lucide-react'
import Logo from './Logo'
import useAuth from '../../context/useAuth'
import { useDocument } from '../../context/DocumentContext'
import { useAccessibility } from '../../context/AccessibilityContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const { currentDocument } = useDocument()
  const { preferences, updatePreference } = useAccessibility()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Upload Document', to: user ? '/app/upload' : '/login' },
    ...(currentDocument
      ? [
          { label: 'Results', to: '/results' },
          { label: 'Ask FormSaathi', to: '/ask' },
        ]
      : []),
    { label: 'How It Works', to: '/how-it-works' },
    { label: 'About', to: '/about' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-primary-100 shadow-sm">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        <Logo />

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                isActive(to)
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:text-primary-800 hover:bg-primary-50/60'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Action Controls & CTA */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Quick Accessibility Toggles */}
          <Link
            to="/accessibility"
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:text-primary-700 hover:border-primary-300 hover:bg-primary-50 transition"
            title="Accessibility Settings"
            aria-label="Accessibility settings"
          >
            <Accessibility size={17} />
          </Link>

          <button
            type="button"
            onClick={() => updatePreference('darkMode', !preferences.darkMode)}
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:text-primary-700 hover:border-primary-300 hover:bg-primary-50 transition"
            title={preferences.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={preferences.darkMode ? 'Light mode' : 'Dark mode'}
          >
            {preferences.darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Primary CTA */}
          <Link
            to={user ? '/app/upload' : '/login'}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-green hover:-translate-y-0.5"
          >
            <Upload size={15} />
            <span>Upload Document</span>
          </Link>

          {user && (
            <Link
              to="/app"
              className="flex items-center gap-1.5 border border-primary-200 text-primary-800 hover:bg-primary-50 px-3.5 py-2 rounded-xl text-xs font-bold transition"
            >
              <FileText size={14} />
              <span>Dashboard</span>
            </Link>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 sm:hidden">
          <Link
            to="/accessibility"
            className="p-2 rounded-xl border border-gray-200 text-gray-600"
            aria-label="Accessibility settings"
          >
            <Accessibility size={18} />
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-xl border border-primary-200 text-primary-800 hover:bg-primary-50"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="sm:hidden border-t border-primary-100 bg-white px-4 py-4 space-y-2 animate-fade-in shadow-xl">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                isActive(to)
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-primary-50'
              }`}
            >
              {label}
            </Link>
          ))}

          <div className="pt-3 border-t border-gray-100 space-y-2">
            <Link
              to={user ? '/app/upload' : '/login'}
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-primary-600 text-white py-3 rounded-xl text-sm font-bold shadow-green"
            >
              <Upload size={16} />
              <span>Upload Document</span>
            </Link>
            {user ? (
              <Link
                to="/app"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full border border-primary-200 text-primary-800 py-2.5 rounded-xl text-sm font-semibold"
              >
                <FileText size={16} />
                <span>My Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold"
              >
                <LogIn size={16} />
                <span>Sign In (Optional)</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
