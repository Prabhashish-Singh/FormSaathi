import { FileText, Globe, HardDrive } from 'lucide-react'

function formatBytes(bytes) {
  if (!bytes) return 'N/A'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function DocumentOverview({ document }) {
  if (!document) return null

  const docType =
    document.important_information?.document_type ||
    document.document_type ||
    'Official Document'

  const detectedLanguage =
    (typeof document.detected_language === 'object'
      ? document.detected_language?.language
      : document.detected_language) || 'Auto Detected'

  return (
    <div className="rounded-3xl border border-primary-100 bg-white p-6 sm:p-7 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
          <FileText size={16} />
        </span>
        <h2 className="font-heading text-lg font-bold text-primary-950">Document Overview</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Document Type */}
        <div className="rounded-2xl bg-canvas p-4 border border-primary-50">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Document Type
          </span>
          <p className="mt-1 text-base font-bold text-primary-950 capitalize">{docType}</p>
        </div>

        {/* 2. Detected Language */}
        <div className="rounded-2xl bg-canvas p-4 border border-primary-50">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Detected Language
            </span>
            <Globe size={13} className="text-primary-600" />
          </div>
          <p className="mt-1 text-base font-bold text-primary-950">{detectedLanguage}</p>
        </div>

        {/* 3. File Info */}
        <div className="rounded-2xl bg-canvas p-4 border border-primary-50">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              File Details
            </span>
            <HardDrive size={13} className="text-primary-600" />
          </div>
          <p className="mt-1 text-xs font-semibold text-primary-950 truncate" title={document.filename}>
            {document.filename || 'Uploaded Document'}
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {document.file_type?.replace('.', '').toUpperCase()} • {formatBytes(document.size_bytes)}
          </p>
        </div>
      </div>
    </div>
  )
}
