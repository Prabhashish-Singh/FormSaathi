import { useState } from 'react'
import {
  CheckSquare,
  Square,
  ListChecks,
  AlertCircle,
  RotateCcw,
} from 'lucide-react'

export default function ActionChecklist({
  actionChecklist = [],
  missingInformation = [],
}) {
  const [completedActions, setCompletedActions] = useState(() => new Set())
  const [completedMissing, setCompletedMissing] = useState(() => new Set())

  const toggleAction = (idx) => {
    setCompletedActions((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const toggleMissing = (idx) => {
    setCompletedMissing((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const totalActions = actionChecklist.length
  const completedCount = completedActions.size
  const progressPercent = totalActions > 0 ? Math.round((completedCount / totalActions) * 100) : 0

  return (
    <div className="space-y-6">
      {/* 1. Action Checklist Card */}
      <div className="rounded-3xl border border-primary-100 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
              <ListChecks size={18} />
            </span>
            <div>
              <h2 className="font-heading text-lg font-bold text-primary-950">Action Checklist</h2>
              <p className="text-xs text-gray-500">Step-by-step tasks you need to complete</p>
            </div>
          </div>

          {totalActions > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-primary-800">
                {completedCount} of {totalActions} done ({progressPercent}%)
              </span>
              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={() => setCompletedActions(new Set())}
                  className="text-xs text-gray-400 hover:text-primary-700 flex items-center gap-1"
                  title="Reset completed tasks"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              )}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {totalActions > 0 && (
          <div className="mt-4 mb-6">
            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full bg-primary-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {totalActions === 0 ? (
          <p className="text-xs italic text-gray-400 py-3">
            No specific action items found in this document.
          </p>
        ) : (
          <div className="space-y-2.5">
            {actionChecklist.map((item, idx) => {
              const text =
                typeof item === 'object'
                  ? item.task || item.action || item.description || JSON.stringify(item)
                  : String(item)
              const isChecked = completedActions.has(idx)

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleAction(idx)}
                  className={`w-full flex items-start gap-3 rounded-2xl border p-4 text-left transition select-none ${
                    isChecked
                      ? 'border-primary-200 bg-primary-50/60 text-gray-400'
                      : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/30 text-gray-800'
                  }`}
                  aria-pressed={isChecked}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {isChecked ? (
                      <CheckSquare size={18} className="text-primary-600" />
                    ) : (
                      <Square size={18} className="text-gray-400" />
                    )}
                  </div>
                  <span
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isChecked ? 'line-through text-gray-400' : 'font-medium'
                    }`}
                  >
                    {text}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* 2. Missing Information Checklist */}
      {missingInformation.length > 0 && (
        <div className="rounded-3xl border border-amber-200 bg-amber-50/40 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-amber-200/60">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <AlertCircle size={18} />
            </span>
            <div>
              <h2 className="font-heading text-lg font-bold text-amber-950">Missing Information</h2>
              <p className="text-xs text-amber-800">
                Details or fields you may need to fill in or obtain
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {missingInformation.map((item, idx) => {
              const text =
                typeof item === 'object'
                  ? item.item || item.field || JSON.stringify(item)
                  : String(item)
              const isChecked = completedMissing.has(idx)

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleMissing(idx)}
                  className={`w-full flex items-start gap-3 rounded-2xl border p-4 text-left transition select-none ${
                    isChecked
                      ? 'border-amber-200 bg-white/40 text-amber-600/60 line-through'
                      : 'border-amber-200 bg-white hover:border-amber-300 text-amber-950'
                  }`}
                  aria-pressed={isChecked}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {isChecked ? (
                      <CheckSquare size={18} className="text-amber-700" />
                    ) : (
                      <Square size={18} className="text-amber-500" />
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-medium leading-relaxed">{text}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
