import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Sparkles, Shield, ArrowRight } from 'lucide-react'
import UploadBox from '../components/UploadBox'
import LanguageSelector from '../components/LanguageSelector'
import LoadingSpinner from '../components/LoadingSpinner'
import { analyzeDocument } from '../services/documentService'
import { useDocument } from '../context/DocumentContext'

export default function Upload() {
  const navigate = useNavigate()
  const { setDocument, ocrLanguage, setOcrLanguage, outputLanguage, setOutputLanguage } =
    useDocument()

  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!file) {
      setError('Please select a document to upload (PDF, JPG, JPEG, or PNG).')
      toast.error('Please select a document first.')
      return
    }

    setLoading(true)
    setLoadingStage(0)

    // Stage progress simulation while waiting for OCR + Gemini AI
    const timer = setInterval(() => {
      setLoadingStage((curr) => (curr < 4 ? curr + 1 : curr))
    }, 3500)

    try {
      const explanationLanguage =
        outputLanguage === 'Hindi' ? 'hi'
          : outputLanguage === 'Punjabi' ? 'pa'
            : 'en'
      const data = await analyzeDocument(file, {
        language: explanationLanguage,
        ocrLanguage,
        level: 'Simple',
        category: 'Auto Detect',
      })
      clearInterval(timer)

      // Store in context for immediate access without re-upload
      setDocument(data)
      toast.success('Document analyzed successfully!')
      navigate(`/app/results/${data.id}`)
    } catch (err) {
      clearInterval(timer)
      const msg = err.message || 'Failed to analyze the document. Please check the backend service.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-8 sm:py-12 bg-canvas">
      {loading && <LoadingSpinner stage={loadingStage} />}

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3.5 py-1 text-xs font-bold text-primary-800 mb-3 border border-primary-200">
            <Sparkles size={13} className="text-primary-600" />
            <span>AI-Powered Multilingual Analysis</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-primary-950">
            Upload Your Document
          </h1>

          <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
            Upload official government notices, certificates, application forms, or letters.
            FormSaathi will explain them simply in your language.
          </p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* 1. Document Upload Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-primary-900">
                1. Select Document File <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-gray-500">PDF, JPG, JPEG, PNG</span>
            </div>
            <UploadBox
              file={file}
              setFile={setFile}
              error={error}
              setError={setError}
              disabled={loading}
            />
          </div>

          {/* 2. Language Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-primary-900">
              2. Select Languages
            </label>
            <LanguageSelector
              ocrLanguage={ocrLanguage}
              setOcrLanguage={setOcrLanguage}
              outputLanguage={outputLanguage}
              setOutputLanguage={setOutputLanguage}
              disabled={loading}
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !file}
              className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 px-6 text-base font-bold shadow-green transition hover:-translate-y-0.5 active:translate-y-0"
              aria-label="Process and analyze document"
            >
              <Sparkles size={18} />
              <span>{loading ? 'Analyzing Document with AI...' : 'Understand This Document'}</span>
              {!loading && <ArrowRight size={18} />}
            </button>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
            <Shield size={14} className="text-primary-600" />
            <span>Privacy: Documents and extracted text are stored privately until you delete them.</span>
          </div>
        </form>
      </div>
    </div>
  )
}
