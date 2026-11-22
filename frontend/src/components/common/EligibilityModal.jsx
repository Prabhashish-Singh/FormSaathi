import { useState } from 'react'
import { X, ShieldCheck, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GOVERNMENT_SCHEMES } from './SchemesModal'

export default function EligibilityModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState({
    age: '',
    category: '',
    income: '',
    occupation: '',
    hasLand: '',
    hasPuccaHouse: '',
  })
  const [eligibleSchemes, setEligibleSchemes] = useState([])

  if (!isOpen) return null

  const calculateEligibility = () => {
    const results = []
    
    // PM-JAY check
    if (answers.age === '70+' || answers.income === 'below-2.5l' || answers.category === 'BPL/EWS') {
      results.push(GOVERNMENT_SCHEMES[0]) // Ayushman Bharat
    }
    // PM-KISAN check
    if (answers.hasLand === 'yes' || answers.occupation === 'farmer') {
      results.push(GOVERNMENT_SCHEMES[1]) // PM-KISAN
    }
    // PMAY check
    if (answers.hasPuccaHouse === 'no' || answers.income === 'below-2.5l') {
      results.push(GOVERNMENT_SCHEMES[2]) // PMAY
    }
    // SSY check
    if (answers.category === 'girl-child') {
      results.push(GOVERNMENT_SCHEMES[3]) // Sukanya Samriddhi
    }
    // Vishwakarma check
    if (answers.occupation === 'artisan') {
      results.push(GOVERNMENT_SCHEMES[4]) // PM Vishwakarma
    }
    // Passport check
    results.push(GOVERNMENT_SCHEMES[5]) // Passport Seva

    setEligibleSchemes(results)
    setStep(4) // Results step
  }

  const resetForm = () => {
    setAnswers({
      age: '',
      category: '',
      income: '',
      occupation: '',
      hasLand: '',
      hasPuccaHouse: '',
    })
    setEligibleSchemes([])
    setStep(1)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-saffron-50 dark:bg-saffron-950/60 text-saffron-600">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
              Citizen Scheme Eligibility Checker
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Answer 3 simple questions to uncover welfare schemes you qualify for
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                step >= s ? 'bg-saffron-500' : 'bg-slate-100 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Form Steps */}
        <div className="mt-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Step 1: Your Age & Demographics
              </h3>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Select your age bracket:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['18 - 40 years', '41 - 69 years', '70+ Senior'].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, age: label === '70+ Senior' ? '70+' : 'adult' }))}
                      className={`p-3 rounded-xl border text-xs font-semibold text-center transition ${
                        (label === '70+ Senior' && answers.age === '70+') || (label !== '70+ Senior' && answers.age === 'adult')
                          ? 'border-saffron-500 bg-saffron-50/50 text-saffron-700'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Primary occupation or background:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ['Farmer / Agriculture', 'farmer'],
                    ['Artisan / Craftsman', 'artisan'],
                    ['Salaried / Self-Employed', 'general'],
                    ['Student / Seeking Education', 'student'],
                  ].map(([label, val]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, occupation: val }))}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition ${
                        answers.occupation === val
                          ? 'border-saffron-500 bg-saffron-50/50 text-saffron-700'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                disabled={!answers.age || !answers.occupation}
                onClick={() => setStep(2)}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 disabled:opacity-50 text-white font-bold py-3 text-sm transition"
              >
                Next Step
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Step 2: Household Income & Housing
              </h3>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Annual household income:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ['Below ₹2.5 Lakh', 'below-2.5l'],
                    ['₹2.5L - ₹8 Lakh', 'mid'],
                    ['Above ₹8 Lakh', 'above-8l'],
                  ].map(([label, val]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, income: val }))}
                      className={`p-3 rounded-xl border text-xs font-semibold text-center transition ${
                        answers.income === val
                          ? 'border-saffron-500 bg-saffron-50/50 text-saffron-700'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Do you currently own a permanent pucca house?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ['Yes, own pucca house', 'yes'],
                    ['No, kutcha/rented/homeless', 'no'],
                  ].map(([label, val]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, hasPuccaHouse: val }))}
                      className={`p-3 rounded-xl border text-xs font-semibold text-center transition ${
                        answers.hasPuccaHouse === val
                          ? 'border-saffron-500 bg-saffron-50/50 text-saffron-700'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!answers.income || !answers.hasPuccaHouse}
                  onClick={() => setStep(3)}
                  className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 disabled:opacity-50 text-white font-bold py-3 text-sm transition"
                >
                  Next Step
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Step 3: Land & Special Categories
              </h3>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Do you or your family hold cultivable agricultural land?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ['Yes, cultivable land holder', 'yes'],
                    ['No agricultural land', 'no'],
                  ].map(([label, val]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, hasLand: val }))}
                      className={`p-3 rounded-xl border text-xs font-semibold text-center transition ${
                        answers.hasLand === val
                          ? 'border-saffron-500 bg-saffron-50/50 text-saffron-700'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!answers.hasLand}
                  onClick={calculateEligibility}
                  className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 disabled:opacity-50 text-white font-bold py-3 text-sm transition shadow-md shadow-saffron-600/20"
                >
                  See My Eligible Schemes
                  <ShieldCheck size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 flex items-center gap-3">
                <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    You qualify for {eligibleSchemes.length} verified government welfare programs!
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    Based on your citizen profile inputs
                  </p>
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
                {eligibleSchemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 bg-slate-50/50 dark:bg-slate-800/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary-600">{scheme.category}</span>
                      <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Eligible
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">{scheme.name}</p>
                    <p className="mt-1 text-[11px] text-slate-500 leading-normal">{scheme.benefit}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center justify-center gap-1.5 w-1/3 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  <RotateCcw size={14} />
                  Retest
                </button>
                <Link
                  to="/app/upload"
                  onClick={onClose}
                  className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 text-xs transition"
                >
                  Analyze My Documents Now
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
