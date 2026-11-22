import { Type, Contrast, Moon, Eye, Volume2, Settings2, Check } from 'lucide-react'
import { useAccessibility } from '../context/AccessibilityContext'
import toast from 'react-hot-toast'

const TEXT_SIZES = [
  { value: 'normal', label: 'Normal', desc: 'Standard text size' },
  { value: 'large', label: 'Large', desc: 'Bigger text for easier reading' },
  { value: 'xl-access', label: 'Extra Large', desc: 'Maximum text size' },
]

const SPEECH_RATES = [
  { value: 0.75, label: 'Slow (0.75×)' },
  { value: 1, label: 'Normal (1×)' },
  { value: 1.25, label: 'Fast (1.25×)' },
  { value: 1.5, label: 'Faster (1.5×)' },
]

function ToggleSetting({ label, desc, icon: Icon, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl border border-primary-100 bg-white">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 flex-shrink-0">
          <Icon size={20} />
        </div>
        <div>
          <p className="font-semibold text-primary-800 text-sm">{label}</p>
          <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        className={`relative flex h-7 w-13 flex-shrink-0 rounded-full border-2 transition ${
          checked ? 'bg-primary-600 border-primary-600' : 'bg-gray-200 border-gray-200'
        }`}
        style={{ width: '52px' }}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-0.5'}`}
        />
        <span className="sr-only">{checked ? 'On' : 'Off'}</span>
      </button>
    </div>
  )
}

export default function AccessibilitySettings() {
  const { preferences, updatePreference } = useAccessibility()

  const save = () => toast.success('Accessibility preferences saved!')

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-16">
      <div>
        <span className="badge-green text-xs mb-2">Accessibility</span>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-primary-900 mt-1">
          Accessibility Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Customize FormSaathi to work best for you. Changes apply immediately.
        </p>
      </div>

      {/* Text Size */}
      <section>
        <h2 className="font-heading text-base font-bold text-primary-800 mb-4 flex items-center gap-2">
          <Type size={18} className="text-primary-500" />
          Text Size
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {TEXT_SIZES.map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => updatePreference('textSize', value)}
              className={`p-4 rounded-2xl border text-left transition ${
                preferences.textSize === value
                  ? 'bg-primary-600 border-primary-600 text-white shadow-green'
                  : 'bg-white border-primary-100 hover:border-primary-300 hover:bg-primary-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-bold ${preferences.textSize === value ? 'text-white' : 'text-primary-800'} ${
                  value === 'normal' ? 'text-sm' : value === 'large' ? 'text-base' : 'text-lg'
                }`}>{label}</span>
                {preferences.textSize === value && <Check size={14} className="text-white" />}
              </div>
              <p className={`text-xs ${preferences.textSize === value ? 'text-primary-100' : 'text-gray-500'}`}>{desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Visual Options */}
      <section>
        <h2 className="font-heading text-base font-bold text-primary-800 mb-4 flex items-center gap-2">
          <Eye size={18} className="text-primary-500" />
          Visual Options
        </h2>
        <div className="space-y-3">
          <ToggleSetting
            label="Dark Mode"
            desc="Dark background, easier on eyes in low light"
            icon={Moon}
            checked={preferences.darkMode}
            onChange={(v) => updatePreference('darkMode', v)}
          />
          <ToggleSetting
            label="High Contrast"
            desc="Increase contrast for better readability"
            icon={Contrast}
            checked={preferences.highContrast}
            onChange={(v) => updatePreference('highContrast', v)}
          />
          <ToggleSetting
            label="Reduce Motion"
            desc="Disable animations for sensitive users"
            icon={Settings2}
            checked={preferences.reduceMotion}
            onChange={(v) => updatePreference('reduceMotion', v)}
          />
        </div>
      </section>

      {/* Speech Rate */}
      <section>
        <h2 className="font-heading text-base font-bold text-primary-800 mb-4 flex items-center gap-2">
          <Volume2 size={18} className="text-primary-500" />
          Read Aloud Speed
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SPEECH_RATES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updatePreference('speechRate', value)}
              className={`p-4 rounded-2xl border text-center text-sm transition ${
                preferences.speechRate === value
                  ? 'bg-primary-600 border-primary-600 text-white shadow-green'
                  : 'bg-white border-primary-100 hover:border-primary-300'
              }`}
            >
              <span className={`font-semibold ${preferences.speechRate === value ? 'text-white' : 'text-primary-800'}`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Keyboard navigation note */}
      <div className="rounded-2xl bg-primary-50 border border-primary-100 p-5">
        <h3 className="font-semibold text-primary-800 text-sm mb-2">⌨️ Keyboard Navigation</h3>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• <kbd className="bg-white border border-gray-200 rounded px-1.5 py-0.5 font-mono text-xs">Tab</kbd> — Move to next interactive element</p>
          <p>• <kbd className="bg-white border border-gray-200 rounded px-1.5 py-0.5 font-mono text-xs">Enter / Space</kbd> — Activate buttons and links</p>
          <p>• <kbd className="bg-white border border-gray-200 rounded px-1.5 py-0.5 font-mono text-xs">Escape</kbd> — Close modals and dropdowns</p>
          <p>• All interactive elements have visible focus indicators (green outline)</p>
        </div>
      </div>

      <button
        onClick={save}
        className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-2xl text-sm font-bold transition shadow-green"
      >
        <Check size={16} />
        Save Preferences
      </button>
    </div>
  )
}
