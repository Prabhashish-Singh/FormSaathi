import { Languages, Sparkles } from 'lucide-react'

export const SUPPORTED_LANGUAGES = [
  { code: 'English', label: 'English', native: 'English' },
  { code: 'Hindi', label: 'Hindi', native: 'हिंदी' },
  { code: 'Punjabi', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'Bengali', label: 'Bengali', native: 'বাংলা' },
  { code: 'Gujarati', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'Marathi', label: 'Marathi', native: 'मराठी' },
  { code: 'Tamil', label: 'Tamil', native: 'தமிழ்' },
  { code: 'Telugu', label: 'Telugu', native: 'తెలుగు' },
  { code: 'Kannada', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'Malayalam', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'Odia', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'Urdu', label: 'Urdu', native: 'اردو' },
]

export default function LanguageSelector({
  ocrLanguage = 'Auto Detect',
  setOcrLanguage,
  outputLanguage = 'English',
  setOutputLanguage,
  disabled = false,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {/* 1. OCR Language Selector */}
      <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="ocr-language-select"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-900"
          >
            <Sparkles size={14} className="text-primary-600" />
            Document OCR Language
          </label>
          <span className="text-[10px] font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100">
            Source Text
          </span>
        </div>

        <p className="text-xs text-gray-500 mb-3">
          Language of the text printed in the document you are uploading.
        </p>

        <select
          id="ocr-language-select"
          value={ocrLanguage}
          onChange={(e) => setOcrLanguage(e.target.value)}
          disabled={disabled}
          className="w-full rounded-xl border border-gray-200 bg-canvas px-3.5 py-2.5 text-sm font-medium text-primary-950 focus:border-primary-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100 transition disabled:opacity-50"
        >
          <option value="Auto Detect">✨ Auto Detect (Recommended)</option>
          {SUPPORTED_LANGUAGES.map(({ code, label, native }) => (
            <option key={code} value={code}>
              {label} ({native})
            </option>
          ))}
        </select>
      </div>

      {/* 2. Output Language Selector */}
      <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="output-language-select"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-900"
          >
            <Languages size={14} className="text-primary-600" />
            Explanation Language
          </label>
          <span className="text-[10px] font-semibold text-gold-700 bg-gold-50 px-2 py-0.5 rounded-full border border-gold-200">
            Your Language
          </span>
        </div>

        <p className="text-xs text-gray-500 mb-3">
          The language in which FormSaathi will explain your document to you.
        </p>

        <select
          id="output-language-select"
          value={outputLanguage}
          onChange={(e) => setOutputLanguage(e.target.value)}
          disabled={disabled}
          className="w-full rounded-xl border border-gray-200 bg-canvas px-3.5 py-2.5 text-sm font-medium text-primary-950 focus:border-primary-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100 transition disabled:opacity-50"
        >
          {SUPPORTED_LANGUAGES.map(({ code, label, native }) => (
            <option key={code} value={code}>
              {label} — {native}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
