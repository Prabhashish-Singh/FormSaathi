import { useState } from 'react'
import { Sparkles, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import ReadAloud from './ReadAloud'

export default function ExplanationCard({
  explanation = '',
  language = 'English',
  summary = '',
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!explanation) return
    try {
      await navigator.clipboard.writeText(explanation)
      setCopied(true)
      toast.success('Explanation copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy to clipboard')
    }
  }

  // Format basic markdown-like structures
  const renderFormatted = (text) => {
    if (!text) return <p className="italic text-gray-400">No explanation generated.</p>

    const lines = text.split('\n')
    return (
      <div className="space-y-2.5 text-sm leading-relaxed text-gray-700">
        {lines.map((line, idx) => {
          const trimmed = line.trim()
          if (!trimmed) return <div key={idx} className="h-1.5" />

          // Headings
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-heading text-sm font-bold text-primary-900 pt-2">
                {trimmed.replace('### ', '')}
              </h4>
            )
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={idx} className="font-heading text-base font-bold text-primary-950 pt-3">
                {trimmed.replace('## ', '')}
              </h3>
            )
          }
          if (trimmed.startsWith('# ')) {
            return (
              <h2 key={idx} className="font-heading text-lg font-extrabold text-primary-950 pt-3">
                {trimmed.replace('# ', '')}
              </h2>
            )
          }

          // Bullet points
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const content = trimmed.slice(2)
            return (
              <div key={idx} className="flex items-start gap-2.5 pl-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-600 flex-shrink-0 mt-2" />
                <p className="flex-1">{content}</p>
              </div>
            )
          }

          // Numbered list
          if (/^\d+\.\s/.test(trimmed)) {
            const num = trimmed.match(/^\d+/)?.[0]
            const content = trimmed.replace(/^\d+\.\s/, '')
            return (
              <div key={idx} className="flex items-start gap-2.5 pl-2">
                <span className="font-bold text-primary-700 text-xs flex-shrink-0 mt-0.5">
                  {num}.
                </span>
                <p className="flex-1">{content}</p>
              </div>
            )
          }

          return <p key={idx}>{line}</p>
        })}
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-primary-100 bg-white p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
            <Sparkles size={18} />
          </span>
          <div>
            <h2 className="font-heading text-lg font-bold text-primary-950">Simple Explanation</h2>
            <p className="text-xs text-gray-500">
              Clear summary in {language} without legal jargon
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="self-start sm:self-auto flex items-center gap-1.5 rounded-xl border border-gray-200 bg-canvas px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-800 transition"
          aria-label="Copy explanation to clipboard"
        >
          {copied ? (
            <>
              <Check size={14} className="text-primary-600" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Read Aloud Bar */}
      <div className="my-5">
        <ReadAloud text={explanation} language={language} />
      </div>

      {/* Summary Highlight if provided */}
      {summary && (
        <div className="mb-5 rounded-2xl bg-gold-50/70 border border-gold-200/80 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gold-800">
            Executive Summary
          </span>
          <p className="mt-1 text-sm font-medium text-gold-950 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Formatted Content */}
      <div className="prose-container rounded-2xl bg-canvas p-5 sm:p-6 border border-primary-50">
        {renderFormatted(explanation)}
      </div>
    </div>
  )
}
