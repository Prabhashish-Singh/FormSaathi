import axios from 'axios'
import { supabase } from './supabase'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 240000,
})

// Attach Supabase auth token if available (optional, doesn't block unauthenticated calls)
api.interceptors.request.use(async (config) => {
  try {
    const { data } = await supabase.auth.getSession()
    if (data?.session?.access_token) {
      config.headers.Authorization = `Bearer ${data.session.access_token}`
    }
  } catch {
    // Auth optional; continue without Authorization header
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await supabase.auth.signOut({ scope: 'global' }).catch(() => {})
    }
    return Promise.reject(error)
  },
)

export function getApiErrorMessage(error) {
  const detail = error.response?.data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    const messages = detail.map((item) => item?.msg).filter(Boolean)
    if (messages.length) return messages.join(' ')
  }
  return (
    error.response?.data?.message ||
    error.message ||
    'The server could not complete the request. Please verify the backend is running.'
  )
}

/**
 * Standard upload API as specified:
 * POST /api/upload
 * multipart/form-data:
 * - file
 * - language (OCR language)
 * - output_language
 */
export async function uploadDocument(file, language = 'Auto Detect', outputLanguage = 'English') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('language', language)
  formData.append('output_language', outputLanguage)

  try {
    // Note: Do not set Content-Type header manually so axios/browser adds multipart boundary
    const response = await api.post('/upload', formData)
    return response.data
  } catch (error) {
    // If /upload returned 404, fallback to /documents/upload for backward compatibility
    if (error.response?.status === 404) {
      const fallbackData = new FormData()
      fallbackData.append('file', file)
      fallbackData.append('explanation_language', outputLanguage === 'Hindi' ? 'hi' : outputLanguage === 'Punjabi' ? 'pa' : 'en')
      fallbackData.append('explanation_level', 'Simple')
      fallbackData.append('category', 'Auto Detect')
      const fallbackRes = await api.post('/documents/upload', fallbackData)
      const data = fallbackRes.data
      const analysis = data.analysis || {}
      return {
        message: 'Document processed successfully',
        filename: data.original_filename,
        file_type: data.file_type,
        size_bytes: data.file_size,
        extracted_text: data.extracted_text || '',
        detected_language: data.original_language || 'English',
        ai_analysis: analysis.simplified_explanation || '',
        important_information: {
          document_type: analysis.document_title || '',
          summary: analysis.summary || '',
          important_dates: analysis.important_dates || [],
          deadlines: [],
          amounts: analysis.financial_information || [],
          required_documents: analysis.required_documents || [],
          eligibility_conditions: analysis.eligibility || [],
          important_conditions: analysis.conditions || [],
          missing_information: [],
          action_checklist: analysis.action_checklist || [],
        },
        status: data.processing_status || 'success',
      }
    }
    throw new Error(getApiErrorMessage(error))
  }
}

/**
 * Standard Ask API as specified:
 * POST /api/ask
 * JSON body:
 * {
 *   "document_text": string,
 *   "question": string,
 *   "output_language": string,
 *   "conversation_history": [ { role: "user" | "assistant", content: string } ]
 * }
 */
export async function askQuestion({
  document_text,
  question,
  output_language = 'English',
  conversation_history = [],
}) {
  try {
    const payload = {
      document_text: document_text || '',
      question: question.trim(),
      output_language: output_language || 'English',
      conversation_history: (conversation_history || []).map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content || msg.text || '',
      })),
    }

    const response = await api.post('/ask', payload)
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}
