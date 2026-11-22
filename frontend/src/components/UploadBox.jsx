import { useRef, useState } from 'react'
import {
  Upload as UploadIcon,
  FileText,
  FileImage,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png']
const ALLOWED_MIME = ['application/pdf', 'image/jpeg', 'image/png']
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

function formatBytes(bytes) {
  if (!bytes) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function UploadBox({ file, setFile, error, setError, disabled = false }) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const validateAndSet = (selected) => {
    if (!selected) return

    const ext = '.' + (selected.name.split('.').pop() || '').toLowerCase()
    const isValidType =
      ALLOWED_MIME.includes(selected.type) || ALLOWED_EXTENSIONS.includes(ext)

    if (!isValidType) {
      setError?.('Please upload a valid PDF, JPG, JPEG, or PNG document.')
      return
    }

    if (selected.size > MAX_FILE_SIZE_BYTES) {
      setError?.('File size exceeds the 10 MB limit. Please select a smaller file.')
      return
    }

    if (selected.size === 0) {
      setError?.('The selected file is empty. Please choose a valid document.')
      return
    }

    setError?.('')
    setFile(selected)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (disabled) return

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      validateAndSet(droppedFile)
    }
  }

  const handleInputChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected) {
      validateAndSet(selected)
    }
  }

  const handleRemove = (e) => {
    e?.stopPropagation()
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const isPdf = file?.type === 'application/pdf' || file?.name?.toLowerCase().endsWith('.pdf')

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        className="sr-only"
        onChange={handleInputChange}
        disabled={disabled}
        id="document-upload-input"
        aria-label="Upload document file"
      />

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
              fileInputRef.current?.click()
            }
          }}
          tabIndex={disabled ? -1 : 0}
          role="button"
          aria-label="Click or drag and drop a document to upload"
          className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition cursor-pointer select-none ${
            isDragging
              ? 'border-primary-600 bg-primary-100/60 scale-[1.01]'
              : 'border-primary-200 bg-white hover:border-primary-500 hover:bg-primary-50/40 shadow-sm'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {/* Upload Icon circle */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 mb-4 shadow-sm">
            <UploadIcon size={30} />
          </div>

          <h3 className="font-heading text-lg font-bold text-primary-950">
            {isDragging ? 'Drop your document here' : 'Drag & drop your document'}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            or{' '}
            <span className="font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-800">
              browse from your device
            </span>
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400">
            <span className="rounded-full bg-canvas px-3 py-1 font-medium border border-gray-200">
              PDF, JPG, JPEG, PNG
            </span>
            <span>•</span>
            <span>Up to 10 MB</span>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border-2 border-primary-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
              {isPdf ? <FileText size={28} /> : <FileImage size={28} />}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-base font-bold text-primary-950">{file.name}</p>
                <CheckCircle2 size={16} className="text-primary-600 flex-shrink-0" />
              </div>
              <p className="mt-0.5 text-xs text-gray-500">
                <span className="font-semibold uppercase text-primary-800">
                  {isPdf ? 'PDF Document' : 'Image File'}
                </span>{' '}
                • {formatBytes(file.size)}
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:border-primary-300 hover:bg-primary-50 transition"
                title="Replace file"
                aria-label="Replace file"
              >
                <RefreshCw size={13} />
                <span className="hidden sm:inline">Replace</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition"
                title="Remove file"
                aria-label="Remove selected file"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mt-3 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800"
        >
          <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="flex-1 font-medium">{error}</p>
        </div>
      )}
    </div>
  )
}
