import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  FileText,
  Upload,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import DocumentOverview from '../components/DocumentOverview'
import ExplanationCard from '../components/ExplanationCard'
import ImportantInformation from '../components/ImportantInformation'
import ActionChecklist from '../components/ActionChecklist'
import ChatInterface from '../components/ChatInterface'
import { useDocument } from '../context/DocumentContext'
import { getDocumentResults } from '../services/documentService'

export default function Results() {
  const { id } = useParams()
  const { currentDocument, setDocument, outputLanguage } = useDocument()

  const [document, setDocState] = useState(currentDocument)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showExtractedText, setShowExtractedText] = useState(false)
  const [copiedText, setCopiedText] = useState(false)
  const [activeTab, setActiveTab] = useState('results') // 'results' | 'qa'

  useEffect(() => {
    // If an ID was passed in URL (from dashboard or direct link) and differs from current
    if (id && currentDocument?.id !== id) {
      setLoading(true)
      getDocumentResults(id)
        .then((data) => {
          setDocState(data)
          setDocument(data)
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message || 'Could not load the requested document.')
          setLoading(false)
        })
    } else if (currentDocument) {
      setDocState(currentDocument)
    }
  }, [id, currentDocument, setDocument])

  const handleCopyExtracted = async () => {
    if (!document?.extracted_text) return
    try {
      await navigator.clipboard.writeText(document.extracted_text)
      setCopiedText(true)
      toast.success('Extracted text copied to clipboard')
      setTimeout(() => setCopiedText(false), 2000)
    } catch {
      toast.error('Could not copy extracted text')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
        </div>
        <p className="font-heading text-sm font-semibold text-primary-800">
          Loading document analysis...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-red-600 mx-auto mb-4 border border-red-200">
          <AlertTriangle size={28} />
        </div>
        <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">Could Not Load Document</h2>
        <p className="text-sm text-gray-600 mb-6">{error}</p>
        <Link
          to="/app/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-xs font-bold text-white shadow-green"
        >
          <Upload size={14} />
          <span>Upload Another Document</span>
        </Link>
      </div>
    )
  }

  // If no document is currently loaded in context
  if (!document) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center animate-fade-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-50 text-primary-600 mx-auto mb-5 border border-primary-100">
          <FileText size={36} />
        </div>
        <h2 className="font-heading text-2xl font-bold text-primary-950 mb-2">
          No Document Analyzed Yet
        </h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Please upload a government notice, form, or circular to view its simplified explanation,
          checklist, and ask questions.
        </p>
        <Link
          to="/app/upload"
          className="inline-flex items-center gap-2 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white px-6 py-3.5 text-sm font-bold shadow-green transition"
        >
          <Upload size={16} />
          <span>Upload Your Document Now</span>
        </Link>
      </div>
    )
  }

  const importantInfo = document.important_information || {}
  const rawAnalysis = document.ai_analysis || importantInfo.summary || ''
  const displayLanguage =
    outputLanguage ||
    (typeof document.output_language === 'string'
      ? document.output_language
      : 'English')

  return (
    <div className="py-8 sm:py-12 bg-canvas">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 animate-fade-in">
        {/* Top Navigation & Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <Link
              to="/app/upload"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary-700 mb-2 transition"
            >
              <ArrowLeft size={14} />
              <span>Upload New Document</span>
            </Link>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-primary-950">
              {importantInfo.document_type || document.filename || 'Document Analysis'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Analyzed in {displayLanguage} • FormSaathi Accessibility Report
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 rounded-2xl bg-white border border-gray-200 p-1 shadow-sm self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('results')}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === 'results'
                  ? 'bg-primary-600 text-white shadow-green'
                  : 'text-gray-600 hover:text-primary-800'
              }`}
            >
              <FileText size={14} />
              <span>Overview & Checklist</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('qa')}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === 'qa'
                  ? 'bg-primary-600 text-white shadow-green'
                  : 'text-gray-600 hover:text-primary-800'
              }`}
            >
              <MessageSquare size={14} />
              <span>Ask Questions</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Results View */}
        {activeTab === 'results' && (
          <div className="space-y-8 animate-fade-in">
            {/* 1. Document Overview Card */}
            <DocumentOverview document={document} />

            {/* 2. Simple Explanation Card with Read Aloud */}
            <ExplanationCard
              explanation={rawAnalysis}
              language={displayLanguage}
              summary={importantInfo.summary}
            />

            {/* 3. Important Information Card */}
            <ImportantInformation importantInformation={importantInfo} />

            {/* 4 & 5. Action Checklist & Missing Information */}
            <ActionChecklist
              actionChecklist={importantInfo.action_checklist || []}
              missingInformation={importantInfo.missing_information || []}
            />

            {/* 6. Collapsible Extracted OCR Text */}
            <div className="rounded-3xl border border-gray-200 bg-white overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setShowExtractedText(!showExtractedText)}
                className="w-full flex items-center justify-between p-5 sm:p-6 hover:bg-canvas transition text-left"
                aria-expanded={showExtractedText}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                    <FileText size={16} />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-bold text-gray-900">
                      Original Extracted Text (OCR)
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Raw text parsed from the uploaded document
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-medium">
                    {showExtractedText ? 'Collapse' : 'Expand'}
                  </span>
                  {showExtractedText ? (
                    <ChevronUp size={16} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400" />
                  )}
                </div>
              </button>

              {showExtractedText && (
                <div className="border-t border-gray-100 p-5 sm:p-6 bg-canvas/40 animate-fade-in">
                  <div className="flex justify-end mb-3">
                    <button
                      type="button"
                      onClick={handleCopyExtracted}
                      className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-primary-300 hover:text-primary-800 transition"
                    >
                      {copiedText ? (
                        <>
                          <Check size={13} className="text-primary-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy Raw Text</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-2xl border border-gray-200 bg-white p-4 font-mono text-xs text-gray-700 leading-relaxed">
                    {document.extracted_text || 'No extracted text available.'}
                  </pre>
                </div>
              )}
            </div>

            {/* Quick action banner to ask questions */}
            <div className="rounded-3xl border border-primary-200 bg-primary-50/60 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading text-base font-bold text-primary-950">
                  Have questions about this document?
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Ask FormSaathi AI anything specific in plain language.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('qa')}
                className="flex items-center gap-2 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 text-xs sm:text-sm font-bold shadow-green transition self-start sm:self-auto"
              >
                <MessageSquare size={16} />
                <span>Ask Questions Now</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Q&A Chat View */}
        {activeTab === 'qa' && (
          <div className="animate-fade-in">
            <ChatInterface
              documentText={document.extracted_text || rawAnalysis}
              outputLanguage={displayLanguage}
              documentTitle={importantInfo.document_type || document.filename}
              documentId={document.id}
            />
          </div>
        )}
      </div>
    </div>
  )
}
