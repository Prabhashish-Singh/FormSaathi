import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react'

export default function LoadingSpinner({
  title = 'Processing Document',
  message = 'Extracting content and analyzing with FormSaathi AI...',
  stage = 0,
}) {
  const stages = [
    'Uploading document securely...',
    'Extracting text using OCR technology...',
    'Analyzing content in plain language...',
    'Identifying key dates, amounts and requirements...',
    'Preparing action checklist & speech...',
  ]

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in"
    >
      <div className="w-full max-w-md rounded-3xl border border-primary-100 bg-white p-8 text-center shadow-2xl">
        {/* Animated Icon */}
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-50 text-primary-600">
          <div className="absolute inset-0 rounded-3xl border-4 border-primary-200 border-t-primary-600 animate-spin" />
          <Sparkles size={32} className="text-primary-600 animate-pulse" />
        </div>

        <h3 className="font-heading text-xl font-bold text-primary-950">{title}</h3>
        <p className="mt-2 text-xs sm:text-sm text-gray-500">{message}</p>

        {/* Progress Stages */}
        <div className="mt-6 space-y-2.5 rounded-2xl bg-canvas p-4 text-left border border-primary-50">
          {stages.map((stgText, idx) => {
            const isCompleted = stage > idx
            const isCurrent = stage === idx
            return (
              <div key={stgText} className="flex items-center gap-2.5 text-xs">
                {isCompleted ? (
                  <CheckCircle2 size={16} className="text-primary-600 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 size={16} className="text-primary-600 animate-spin flex-shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-gray-300 flex-shrink-0" />
                )}
                <span
                  className={
                    isCompleted
                      ? 'font-medium text-primary-800'
                      : isCurrent
                      ? 'font-bold text-primary-700'
                      : 'text-gray-400'
                  }
                >
                  {stgText}
                </span>
              </div>
            )
          })}
        </div>

        <p className="mt-4 text-[11px] text-gray-400">
          Please wait. Documents with multiple pages may take up to 20-30 seconds.
        </p>
      </div>
    </div>
  )
}
