import { useState } from 'react'
import {
  Calendar,
  AlertTriangle,
  IndianRupee,
  FileCheck2,
  CheckCircle,
  Copy,
  Check,
  Info,
} from 'lucide-react'
import toast from 'react-hot-toast'

function InfoCard({ title, icon: Icon, items = [], badgeColor = 'primary', emptyText = 'None identified' }) {
  const [copied, setCopied] = useState(false)

  const hasItems = Array.isArray(items) ? items.length > 0 : !!items

  const handleCopy = async () => {
    if (!hasItems) return
    const textToCopy = Array.isArray(items)
      ? items.map((it) => (typeof it === 'object' ? JSON.stringify(it) : String(it))).join('\n')
      : String(items)
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      toast.success(`${title} copied`)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy')
    }
  }

  const colorStyles = {
    primary: {
      border: 'border-primary-100',
      badge: 'bg-primary-50 text-primary-700 border-primary-200',
      icon: 'text-primary-600',
    },
    red: {
      border: 'border-red-100',
      badge: 'bg-red-50 text-red-700 border-red-200',
      icon: 'text-red-600',
    },
    gold: {
      border: 'border-gold-100',
      badge: 'bg-gold-50 text-gold-800 border-gold-200',
      icon: 'text-gold-700',
    },
    sage: {
      border: 'border-sage-200',
      badge: 'bg-sage-50 text-sage-800 border-sage-200',
      icon: 'text-sage-700',
    },
  }[badgeColor] || {
    border: 'border-primary-100',
    badge: 'bg-primary-50 text-primary-700 border-primary-200',
    icon: 'text-primary-600',
  }

  return (
    <div className={`rounded-2xl border ${colorStyles.border} bg-white p-5 shadow-sm flex flex-col justify-between`}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon size={16} className={colorStyles.icon} />
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-primary-950">
              {title}
            </h3>
          </div>

          {hasItems && (
            <button
              type="button"
              onClick={handleCopy}
              className="text-gray-400 hover:text-primary-700 transition p-1 rounded-lg hover:bg-gray-50"
              title={`Copy ${title}`}
              aria-label={`Copy ${title}`}
            >
              {copied ? <Check size={13} className="text-primary-600" /> : <Copy size={13} />}
            </button>
          )}
        </div>

        {!hasItems ? (
          <p className="text-xs italic text-gray-400 mt-2">{emptyText}</p>
        ) : Array.isArray(items) ? (
          <ul className="space-y-2 mt-2">
            {items.map((it, idx) => {
              const text = typeof it === 'object' ? it.item || it.name || JSON.stringify(it) : String(it)
              return (
                <li key={idx} className="flex items-start gap-2 text-xs text-gray-700 leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />
                  <span>{text}</span>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-xs text-gray-700 mt-2 leading-relaxed">{String(items)}</p>
        )}
      </div>
    </div>
  )
}

export default function ImportantInformation({ importantInformation = {} }) {
  const dates = importantInformation?.important_dates || []
  const deadlines = importantInformation?.deadlines || []
  const amounts = importantInformation?.amounts || []
  const requiredDocs = importantInformation?.required_documents || []
  const eligibility = importantInformation?.eligibility_conditions || []
  const conditions = importantInformation?.important_conditions || []

  return (
    <div className="rounded-3xl border border-primary-100 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-gray-100">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
          <Info size={18} />
        </span>
        <div>
          <h2 className="font-heading text-lg font-bold text-primary-950">Important Information</h2>
          <p className="text-xs text-gray-500">Key facts, dates, amounts, and eligibility requirements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Important Dates */}
        <InfoCard
          title="Important Dates"
          icon={Calendar}
          items={dates}
          badgeColor="primary"
          emptyText="No dates specified in document"
        />

        {/* Deadlines */}
        <InfoCard
          title="Deadlines"
          icon={AlertTriangle}
          items={deadlines}
          badgeColor="red"
          emptyText="No strict deadlines identified"
        />

        {/* Amounts */}
        <InfoCard
          title="Amounts & Fees"
          icon={IndianRupee}
          items={amounts}
          badgeColor="gold"
          emptyText="No financial amounts mentioned"
        />

        {/* Required Documents */}
        <InfoCard
          title="Required Documents"
          icon={FileCheck2}
          items={requiredDocs}
          badgeColor="sage"
          emptyText="No documents required"
        />

        {/* Eligibility Conditions */}
        <InfoCard
          title="Eligibility Conditions"
          icon={CheckCircle}
          items={eligibility}
          badgeColor="primary"
          emptyText="No explicit eligibility rules"
        />

        {/* Important Conditions */}
        <InfoCard
          title="Other Conditions"
          icon={Info}
          items={conditions}
          badgeColor="gold"
          emptyText="No additional conditions"
        />
      </div>
    </div>
  )
}
