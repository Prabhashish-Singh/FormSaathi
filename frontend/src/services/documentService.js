import { api, getApiErrorMessage } from './api'

function mapDocument(document) {
  const analysis = document.analysis
  return {
    ...document,
    id: document.id,
    filename: document.original_filename,
    file_type: document.file_type,
    size_bytes: document.file_size,
    detected_language: { language: document.original_language || 'Not specified' },
    output_language: {
      en: 'English', hi: 'Hindi', pa: 'Punjabi', bn: 'Bengali',
      gu: 'Gujarati', mr: 'Marathi', ta: 'Tamil', te: 'Telugu',
      kn: 'Kannada', ml: 'Malayalam', or: 'Odia', ur: 'Urdu',
    }[document.explanation_language] || document.explanation_language,
    ai_analysis: analysis?.simplified_explanation || '',
    important_information: {
      document_type: analysis?.document_title,
      summary: analysis?.summary,
      eligibility_conditions: analysis?.eligibility || [],
      important_dates: analysis?.important_dates || [],
      amounts: analysis?.financial_information || [],
      required_documents: analysis?.required_documents || [],
      deadlines: [],
      important_conditions: analysis?.conditions || [],
      missing_information: [],
      action_checklist: analysis?.action_checklist || [],
    },
    status: document.processing_status,
    analyzed_at: analysis?.created_at || document.updated_at || document.created_at,
  }
}

export async function analyzeDocument(file, { language, level, category, ocrLanguage = 'Auto Detect' }) {
  const body = new FormData()
  body.append('file', file)
  body.append('explanation_language', language)
  body.append('explanation_level', level)
  body.append('category', category)
  body.append('ocr_language', ocrLanguage)
  try {
    const response = await api.post('/documents/upload', body)
    return mapDocument(response.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export async function getDocumentResults(id) {
  try {
    const response = await api.get(`/documents/${id}`)
    return mapDocument(response.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export async function getDocumentHistory() {
  try {
    const response = await api.get('/documents')
    return response.data.map((document) => ({
      id: document.id,
      name: document.original_filename,
      category: document.document_category || document.file_type?.replace('.', '').toUpperCase() || 'Document',
      date: document.created_at,
      status: document.processing_status,
    }))
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export async function getLatestDocument() {
  const history = await getDocumentHistory()
  if (!history.length) return null
  return getDocumentResults(history[0].id)
}

export async function deleteDocument(id) {
  try {
    await api.delete(`/documents/${id}`)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}
