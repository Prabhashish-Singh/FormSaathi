import { useState } from 'react'
import { X, Search, Compass, ExternalLink, Bookmark, ChevronRight, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'

export const GOVERNMENT_SCHEMES = [
  {
    id: 'pm-jay',
    name: 'Ayushman Bharat – Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    category: 'Healthcare',
    benefit: 'Up to ₹5,00,000 per family/year for cashless hospitalization in empaneled hospitals.',
    eligibility: 'Deprived rural households, specified occupational urban workers, and all senior citizens aged 70+.',
    documents: ['Aadhaar Card', 'Ration Card', 'Mobile Number'],
    portalUrl: 'https://pmjay.gov.in',
  },
  {
    id: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    category: 'Agriculture',
    benefit: '₹6,000 per year delivered in 3 equal four-monthly installments directly to bank account.',
    eligibility: 'All landholding farmer families with cultivable land holdings in their names.',
    documents: ['Aadhaar Card', 'Land Ownership Records (Khatauni)', 'Bank Account Details'],
    portalUrl: 'https://pmkisan.gov.in',
  },
  {
    id: 'pmay',
    name: 'Pradhan Mantri Awas Yojana (PMAY-Gramin & Urban)',
    category: 'Housing',
    benefit: 'Financial assistance of up to ₹1.20 - ₹2.67 Lakh for constructing pucca house.',
    eligibility: 'Families without a pucca house or living in zero/one/two room kutcha houses.',
    documents: ['Aadhaar Card', 'Income Certificate', 'Bank Passbook', 'Land Documents'],
    portalUrl: 'https://pmaymis.gov.in',
  },
  {
    id: 'ssy',
    name: 'Sukanya Samriddhi Yojana (SSY)',
    category: 'Education',
    benefit: 'High-interest tax-exempt savings scheme (8.2% p.a.) for parents of girl children.',
    eligibility: 'Parents or legal guardians of a girl child below 10 years of age.',
    documents: ['Girl Child Birth Certificate', 'Guardian Identity & Address Proof'],
    portalUrl: 'https://www.india.gov.in',
  },
  {
    id: 'pm-vishwakarma',
    name: 'PM Vishwakarma Scheme',
    category: 'Social Welfare',
    benefit: 'Collateral-free credit up to ₹3 Lakh at 5% interest rate + ₹15,000 toolkit incentive.',
    eligibility: 'Traditional artisans and craftspeople engaged in 18 specified manual trades.',
    documents: ['Aadhaar Card', 'Bank Passbook', 'Skill Trade Certificate/Self-declaration'],
    portalUrl: 'https://pmvishwakarma.gov.in',
  },
  {
    id: 'passport-seva',
    name: 'Fresh Indian Passport (Normal / Tatkaal)',
    category: 'Passport Seva',
    benefit: 'Official government travel document & supreme identity credential.',
    eligibility: 'Any Indian citizen above 18 years (or minors through guardian representation).',
    documents: ['Proof of Address', 'Proof of Date of Birth', 'Aadhaar / Voter ID'],
    portalUrl: 'https://passportindia.gov.in',
  },
]

export default function SchemesModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [bookmarked, setBookmarked] = useState(['pm-jay', 'pm-kisan'])

  if (!isOpen) return null

  const categories = ['All', 'Healthcare', 'Agriculture', 'Housing', 'Education', 'Social Welfare', 'Passport Seva']

  const filtered = GOVERNMENT_SCHEMES.filter((scheme) => {
    const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory
    const matchesSearch =
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.benefit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.category.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleBookmark = (id) => {
    setBookmarked((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 dark:bg-blue-950 text-primary-600">
              <Compass size={22} />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                Government Welfare Schemes & Programs
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified central and state citizen assistance programs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              type="text"
              placeholder="Search by scheme name or benefit (e.g. Ayushman, PM Kisan, House)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Scheme List Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-slate-500">No schemes found matching your search.</p>
            </div>
          ) : (
            filtered.map((scheme) => (
              <div
                key={scheme.id}
                className="group rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/60 p-5 shadow-xs hover:border-blue-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 dark:bg-blue-950 px-2.5 py-1 text-xs font-semibold text-primary-700 dark:text-primary-300">
                      <Tag size={12} />
                      {scheme.category}
                    </span>
                    <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition">
                      {scheme.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBookmark(scheme.id)}
                      className={`p-2 rounded-xl border transition ${
                        bookmarked.includes(scheme.id)
                          ? 'border-saffron-200 bg-saffron-50 text-saffron-600'
                          : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                      }`}
                      title={bookmarked.includes(scheme.id) ? 'Remove Bookmark' : 'Bookmark Scheme'}
                    >
                      <Bookmark size={16} fill={bookmarked.includes(scheme.id) ? 'currentColor' : 'none'} />
                    </button>
                    <a
                      href={scheme.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-primary-600 hover:bg-blue-50 transition"
                      title="Open Official Portal"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-800 dark:text-white">Benefit: </strong>
                  {scheme.benefit}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
                  <div>
                    <strong className="text-slate-700 dark:text-slate-300">Eligibility: </strong>
                    {scheme.eligibility}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-slate-700 dark:text-slate-300">Documents: </strong>
                    {scheme.documents.join(', ')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Have an official notice or circular? Use the Explainer to break it down.
          </p>
          <Link
            to="/app/upload"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-xs font-bold text-white hover:bg-primary-700 transition"
          >
            Explain My Document
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
