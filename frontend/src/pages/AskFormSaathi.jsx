import { Link } from 'react-router-dom'
import { FileText, Upload, ArrowLeft } from 'lucide-react'
import ChatInterface from '../components/ChatInterface'
import { useDocument } from '../context/DocumentContext'

export default function AskFormSaathi() {
  const { currentDocument, outputLanguage } = useDocument()

  if (!currentDocument) {
    return (
      <div className="py-16 sm:py-24 bg-canvas">
        <div className="max-w-md mx-auto px-4 text-center animate-fade-in">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-50 text-primary-600 mx-auto mb-5 border border-primary-100">
            <FileText size={36} />
          </div>
          <h2 className="font-heading text-2xl font-bold text-primary-950 mb-2">
            No Document Selected
          </h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Please upload a document first before asking questions. FormSaathi answers questions
            strictly based on the content of your document.
          </p>
          <Link
            to="/app/upload"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white px-6 py-3.5 text-sm font-bold shadow-green transition"
          >
            <Upload size={16} />
            <span>Upload Document</span>
          </Link>
        </div>
      </div>
    )
  }

  const docTitle =
    currentDocument.important_information?.document_type ||
    currentDocument.filename ||
    'Active Document'

  const displayLanguage =
    outputLanguage ||
    (typeof currentDocument.output_language === 'string'
      ? currentDocument.output_language
      : 'English')

  return (
    <div className="py-8 sm:py-12 bg-canvas">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 animate-fade-in">
        {/* Back Link & Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <Link
              to="/app/documents"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary-700 mb-1 transition"
            >
              <ArrowLeft size={14} />
              <span>Back to Results Dashboard</span>
            </Link>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-primary-950">
              Ask About Your Document
            </h1>
          </div>

          <Link
            to="/app/upload"
            className="flex items-center gap-1.5 rounded-xl border border-primary-200 bg-white px-3.5 py-2 text-xs font-bold text-primary-800 hover:bg-primary-50 transition"
          >
            <Upload size={14} />
            <span className="hidden sm:inline">Upload New</span>
          </Link>
        </div>

        {/* Chat Component */}
        <ChatInterface
          documentText={
            currentDocument.extracted_text || currentDocument.ai_analysis || ''
          }
          outputLanguage={displayLanguage}
          documentTitle={docTitle}
          documentId={currentDocument.id}
        />
      </div>
    </div>
  )
}
