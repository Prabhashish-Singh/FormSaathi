import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, Trash2, ArrowRight, Upload, AlertCircle, FileSearch,
  Search,
} from 'lucide-react'
import { getDocumentHistory, deleteDocument } from '../services/documentService'
import toast from 'react-hot-toast'

function StatusBadge({ status }) {
  const map = {
    completed: { label: 'Analyzed', cls: 'bg-primary-50 text-primary-700 border-primary-100' },
    processing: { label: 'Processing', cls: 'bg-gold-50 text-gold-700 border-gold-100' },
    failed: { label: 'Failed', cls: 'bg-red-50 text-red-700 border-red-100' },
  }
  const { label, cls } = map[status] || { label: status || 'Unknown', cls: 'bg-gray-50 text-gray-600 border-gray-100' }
  return <span className={`inline-flex px-2 py-0.5 rounded-lg border text-xs font-semibold ${cls}`}>{label}</span>
}

export default function Documents() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [search, setSearch] = useState('')

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
      toast.error(err.message || 'Could not delete.')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = docs.filter((d) => d.name?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span className="badge-green text-xs mb-2">My Documents</span>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-primary-900 mt-1">All Documents</h1>
          <p className="text-sm text-gray-500 mt-1">
            {docs.length} document{docs.length !== 1 ? 's' : ''} uploaded
          </p>
        </div>
        <Link to="/app/upload" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-xl text-sm font-bold transition shadow-green flex-shrink-0">
          <Upload size={16} /> Upload New
        </Link>
      </div>

      {/* Search */}
      {docs.length > 3 && (
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition"
          />
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-primary-50 animate-pulse" />)}
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-5 rounded-2xl bg-red-50 border border-red-100">
          <AlertCircle size={20} className="text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border-2 border-dashed border-primary-200 bg-primary-50/40">
          <FileSearch size={48} className="text-primary-200 mx-auto mb-4" />
          <h3 className="font-heading text-lg font-bold text-primary-800 mb-2">
            {search ? 'No documents found' : 'No Documents Yet'}
          </h3>
          {!search && (
            <Link to="/app/upload" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl text-sm font-bold mt-5 transition shadow-green">
              <Upload size={16} /> Upload First Document
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-primary-100 hover:border-primary-200 shadow-card hover:shadow-card-hover transition group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 flex-shrink-0">
                <FileText size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-primary-800 text-sm truncate">{doc.name}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <StatusBadge status={doc.status} />
                  {doc.category && (
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{doc.category}</span>
                  )}
                  <span className="text-xs text-gray-400">
                    {doc.date ? new Date(doc.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition flex-shrink-0">
                <Link to={`/app/results/${doc.id}`} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition">
                  View <ArrowRight size={12} />
                </Link>
                <button
                  onClick={() => handleDelete(doc.id)}
                  disabled={deleting === doc.id}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
                  aria-label="Delete"
                >
                  {deleting === doc.id ? <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" /> : <Trash2 size={15} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
