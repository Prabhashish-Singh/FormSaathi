import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Globe } from 'lucide-react'
import { languages } from '../../i18n'

export default function LanguageSelector({ compact = false }) {
  const { i18n, t } = useTranslation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const selected = languages.find((language) => language.code === i18n.resolvedLanguage) || languages[0]

  useEffect(() => {
    const close = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    const escape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', escape)
    }
  }, [])

  const choose = (code) => {
    i18n.changeLanguage(code)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition shadow-xs"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('language.websiteSelector')}
      >
        <Globe size={16} className="shrink-0 text-primary-600 dark:text-primary-400" />
        {!compact && <span>{selected.label}</span>}
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t('language.websiteSelector')}
          className="absolute right-0 z-50 mt-2 min-w-40 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 p-1.5 shadow-xl shadow-slate-900/10"
        >
          {languages.map((language) => (
            <button
              key={language.code}
              role="option"
              aria-selected={language.code === i18n.resolvedLanguage}
              type="button"
              onClick={() => choose(language.code)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                language.code === i18n.resolvedLanguage
                  ? 'bg-blue-50 dark:bg-blue-950/70 font-bold text-primary-600 dark:text-primary-400'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <span>{language.label}</span>
              {language.code === i18n.resolvedLanguage && (
                <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
