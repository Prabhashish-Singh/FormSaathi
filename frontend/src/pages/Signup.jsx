import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import useAuth from '../context/useAuth'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, UserPlus } from 'lucide-react'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Signup() {
  const { register, loginWithGoogleAuth } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const update = (e) => {
    const { name, value } = e.target
    setValues((p) => ({ ...p, [name]: value }))
    setErrors((p) => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!values.name.trim()) errs.name = 'Full name is required.'
    if (!EMAIL_PATTERN.test(values.email.trim())) errs.email = 'Please enter a valid email address.'
    if (values.password.length < 8) errs.password = 'Password must be at least 8 characters.'
    if (values.password !== values.confirm) errs.confirm = 'Passwords do not match.'
    return errs
  }

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) return

    setLoading(true)
    try {
      const result = await register({ name: values.name, email: values.email, password: values.password })
      if (result.needsConfirmation) {
        toast.success('Account created. Please confirm your email before signing in.')
        navigate('/login', { replace: true })
      } else {
        toast.success('Account created! Welcome to FormSaathi.')
        navigate('/app', { replace: true })
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const signUpGoogle = async () => {
    try { await loginWithGoogleAuth() }
    catch (err) { toast.error(err.message || 'Google sign-up failed.') }
  }

  return (
    <section className="animate-fade-in" aria-labelledby="signup-title">
      <div className="mb-7">
        <span className="badge-green text-xs mb-3">Create Account</span>
        <h1 id="signup-title" className="font-heading text-3xl font-extrabold text-primary-900 mt-2">
          Join FormSaathi
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Free account. Understand documents in your language.
        </p>
      </div>

      <button
        type="button"
        onClick={signUpGoogle}
        className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-primary-300 transition mb-5"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">or create with email</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <form onSubmit={submit} noValidate className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-primary-800 mb-1.5">Full Name</label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={update}
              placeholder="Your full name"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${errors.name ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'}`}
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-red-600" role="alert">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-primary-800 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={update}
              placeholder="you@example.com"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${errors.email ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'}`}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-600" role="alert">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-primary-800 mb-1.5">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              name="password"
              type={showPass ? 'text' : 'password'}
              autoComplete="new-password"
              value={values.password}
              onChange={update}
              placeholder="At least 8 characters"
              className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${errors.password ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'}`}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Toggle password">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-600" role="alert">{errors.password}</p>}
        </div>

        {/* Confirm */}
        <div>
          <label htmlFor="confirm" className="block text-sm font-semibold text-primary-800 mb-1.5">Confirm Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="confirm"
              name="confirm"
              type={showPass ? 'text' : 'password'}
              autoComplete="new-password"
              value={values.confirm}
              onChange={update}
              placeholder="Repeat your password"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${errors.confirm ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'}`}
            />
          </div>
          {errors.confirm && <p className="mt-1 text-xs text-red-600" role="alert">{errors.confirm}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white py-3.5 rounded-xl text-sm font-bold transition shadow-green"
        >
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UserPlus size={16} />}
          {loading ? 'Creating account...' : 'Create Account'}
          {!loading && <ArrowRight size={15} />}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 hover:text-primary-800 font-semibold">Sign in →</Link>
      </p>
    </section>
  )
}
