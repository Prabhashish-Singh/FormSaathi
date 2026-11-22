import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Upload, FileText, MessageSquare, Trash2, ArrowRight,
  Plus, CheckCircle2, AlertCircle, FileSearch,
} from 'lucide-react'
import { getDocumentHistory, deleteDocument } from '../services/documentService'
import useAuth from '../context/useAuth'
import toast from 'react-hot-toast'

function StatusBadge({ status }) {
  const map = {
    completed: { label: 'Analyzed', cls: 'bg-primary-50 text-primary-700 border-primary-100' },
    processing: { label: 'Processing', cls: 'bg-gold-50 text-gold-700 border-gold-100' },
    failed: { label: 'Failed', cls: 'bg-red-50 text-red-700 border-red-100' },
  }
  const { label, cls } = map[status] || { label: status || 'Unknown', cls: 'bg-gray-50 text-gray-600 border-gray-100' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg border text-xs font-semibold ${cls}`}>
      {label}
    </span>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    setLoading(true)
    getDocumentHistory()
      .then((data) => { setDocs(data); setLoading(false) })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this document? This cannot be undone.')) return
    setDeleting(id)
    try {
      await deleteDocument(id)
      setDocs((prev) => prev.filter((d) => d.id !== id))
      toast.success('Document deleted.')
    } catch (err) {
      toast.error(err.message || 'Could not delete document.')
    } finally {
      setDeleting(null)
    }
  }

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Welcome */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span className="badge-green text-xs mb-2">My Dashboard</span>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-primary-900 mt-1">
            Welcome back, {firstName}!
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload a document to get started, or view your past analyses below.
          </p>
        </div>
        <Link
          to="/app/upload"
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-xl text-sm font-bold transition shadow-green flex-shrink-0"
        >
          <Plus size={16} />
          Upload Document
        </Link>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Upload, label: 'Upload New Document', desc: 'PDF, JPG or PNG', to: '/app/upload', accent: 'bg-primary-600 text-white hover:bg-primary-700 shadow-green' },
          { icon: MessageSquare, label: 'Ask FormSaathi', desc: 'Ask about your document', to: '/app/ask', accent: 'bg-white border border-primary-100 text-primary-700 hover:bg-primary-50' },
          { icon: FileSearch, label: 'My Documents', desc: 'View all uploaded files', to: '/app/documents', accent: 'bg-white border border-primary-100 text-primary-700 hover:bg-primary-50' },
        ].map(({ icon: Icon, label, desc, to, accent }) => (
          <Link key={label} to={to} className={`flex items-center gap-4 p-5 rounded-2xl font-medium transition ${accent}`}>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 flex-shrink-0">
              <Icon size={20} />
            </div>
            <div>
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-xs opacity-70 mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Documents */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading text-lg font-bold text-primary-900">Recent Documents</h2>
          <Link to="/app/documents" className="text-xs text-primary-600 hover:text-primary-800 font-semibold flex items-center gap-1">
            View All <ArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-primary-50 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-5 rounded-2xl bg-red-50 border border-red-100">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-700">Could not load documents</p>
              <p className="text-xs text-red-500 mt-0.5">{error}</p>
            </div>
          </div>
        ) : docs.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border-2 border-dashed border-primary-200 bg-primary-50/40">
            <FileText size={48} className="text-primary-200 mx-auto mb-4" />
            <h3 className="font-heading text-lg font-bold text-primary-800 mb-2">No Documents Yet</h3>
            <p className="text-sm text-gray-500 mb-6">Upload your first document to see it analyzed here.</p>
            <Link to="/app/upload" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition shadow-green">
              <Upload size={16} />
              Upload Your First Document
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {docs.slice(0, 5).map((doc) => (
              <div key={doc.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-primary-100 hover:border-primary-200 shadow-card hover:shadow-card-hover transition group">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 flex-shrink-0">
                  <FileText size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-primary-800 text-sm truncate">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={doc.status} />
                    <span className="text-xs text-gray-400">
                      {doc.date ? new Date(doc.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition flex-shrink-0">
                  <Link
                    to={`/app/results/${doc.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition"
                  >
                    View <ArrowRight size={12} />
                  </Link>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    disabled={deleting === doc.id}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
                    aria-label="Delete document"
                  >
                    {deleting === doc.id ? <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" /> : <Trash2 size={15} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How-to quick tips */}
      <div className="rounded-2xl bg-primary-50 border border-primary-100 p-6">
        <h3 className="font-heading text-base font-bold text-primary-800 mb-4">📋 Quick Tips</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'Upload government notices, forms or circulars in PDF, JPG or PNG format.',
            'Choose the language you want the explanation in — English, Hindi or Punjabi.',
            'After analysis, use Read Aloud to listen to the explanation.',
            'Ask FormSaathi any question about your document using the AI chat.',
          ].map((tip, i) => (
            <div key={i} className="flex gap-2.5">
              <CheckCircle2 size={16} className="text-primary-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
