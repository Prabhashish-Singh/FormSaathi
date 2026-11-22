import { Link } from 'react-router-dom'
import { Shield, Leaf } from 'lucide-react'

const LANGUAGES = ['English', 'हिंदी', 'ਪੰਜਾਬੀ', 'বাংলা', 'ગુજરાતી', 'मराठी', 'தமிழ்', 'తెలుగు', 'ಕನ್ನಡ', 'മലയാളം', 'ଓଡ଼ିଆ', 'اردو']

export default function Footer() {
  return (
    <footer className="bg-[#0d1f0d] text-green-100 mt-auto">
      {/* Languages strip */}
      <div className="border-b border-green-900/50 py-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-xs text-green-400 font-semibold uppercase tracking-widest mr-2">Supported Languages:</span>
            {LANGUAGES.map((lang) => (
              <span key={lang} className="text-xs text-green-300 bg-green-900/40 px-2.5 py-1 rounded-full">
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600">
                <Leaf size={18} className="text-white" />
              </div>
              <span className="font-heading text-xl font-bold text-white">FormSaathi</span>
            </div>
            <p className="text-sm text-green-300 leading-relaxed max-w-sm">
              AI-powered multilingual document accessibility platform. Helping every Indian citizen understand important documents in their own language.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="badge-green text-xs">🇮🇳 Made for India</span>
              <span className="badge-gold text-xs">12 Languages</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'How It Works', to: '/how-it-works' },
                { label: 'Upload Document', to: '/app/upload' },
                { label: 'My Documents', to: '/app/documents' },
                { label: 'Ask FormSaathi', to: '/app/ask' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-green-300 hover:text-white transition flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Legal & Contact</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', to: '/about' },
                { label: 'Privacy Policy', to: '/privacy' },
                { label: 'Terms of Use', to: '/terms' },
                { label: 'Contact', to: '/contact' },
                { label: 'Accessibility', to: '/app/accessibility' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-green-300 hover:text-white transition flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-green-900/50 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-green-400">
            © 2026 FormSaathi. All rights reserved. Built for national-level hackathon demonstration.
          </p>
          <p className="text-xs text-green-500 flex items-center gap-1.5">
            <Shield size={12} />
            Secure & Privacy-First. Documents processed by AI.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-xl bg-green-900/30 border border-green-800/50 p-4">
          <p className="text-xs text-green-400 leading-relaxed">
            <strong className="text-green-300">Disclaimer:</strong> FormSaathi provides AI-generated document explanations for informational purposes only. The platform does not provide legal advice. Always verify important information with official government sources or qualified professionals.
          </p>
        </div>
      </div>
    </footer>
  )
}
