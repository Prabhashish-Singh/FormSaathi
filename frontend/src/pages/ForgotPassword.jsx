import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { requestPasswordReset } from '../services/authService'
import { Mail, ArrowLeft, Send } from 'lucide-react'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    try {
      await requestPasswordReset(email.trim())
      setSent(true)
      toast.success('Password reset email sent!')
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="animate-fade-in" aria-labelledby="reset-title">
      <Link to="/login" className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-800 font-medium mb-7">
        <ArrowLeft size={15} /> Back to Login
      </Link>

      {sent ? (
        <div className="text-center py-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 mx-auto mb-5">
            <Mail size={28} className="text-primary-600" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-primary-900 mb-3">Check Your Email</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            We sent a password reset link to <strong className="text-primary-700">{email}</strong>.
            Check your inbox and follow the instructions.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-7">
            <span className="badge-green text-xs mb-3">Account Recovery</span>
            <h1 id="reset-title" className="font-heading text-3xl font-extrabold text-primary-900 mt-2">Forgot Password?</h1>
            <p className="mt-2 text-sm text-gray-500">Enter your email and we'll send a reset link.</p>
          </div>
          <form onSubmit={submit} noValidate>
            <div className="mb-4">
              <label htmlFor="reset-email" className="block text-sm font-semibold text-primary-800 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${error ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'}`}
                />
              </div>
              {error && <p className="mt-1 text-xs text-red-600" role="alert">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white py-3.5 rounded-xl text-sm font-bold transition shadow-green"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={16} />}
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </>
      )}
    </section>
  )
}
