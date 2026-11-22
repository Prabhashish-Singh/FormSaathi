import { api, getApiErrorMessage, askQuestion } from './api'

const LANG_CODE_MAP = {
  en: 'English',
  hi: 'Hindi',
  pa: 'Punjabi',
  bn: 'Bengali',
  gu: 'Gujarati',
  mr: 'Marathi',
  ta: 'Tamil',
  te: 'Telugu',
  kn: 'Kannada',
  ml: 'Malayalam',
  or: 'Odia',
  ur: 'Urdu',
}

export async function askDocumentQuestion(
  documentText,
  question,
  language = 'English',
  conversationHistory = [],
  documentId = null
) {
  const outputLanguage = LANG_CODE_MAP[language] || language || 'English'

  try {
    // 1. If documentId is provided, try authenticated document route first
    if (documentId) {
      try {
        const response = await api.post(`/documents/${documentId}/ask`, {
          document_text: documentText || '',
          question: question.trim(),
          output_language: outputLanguage,
          conversation_history: conversationHistory,
        })
        return response.data.answer
      } catch (err) {
        // If 404 or auth error, fallback to standalone /ask
        if (err.response?.status !== 401 && err.response?.status !== 404) {
          throw err
        }
      }
    }

    // 2. Standard POST /api/ask endpoint
    const response = await askQuestion({
      document_text: documentText,
      question,
      output_language: outputLanguage,
      conversation_history: conversationHistory,
    })
    return response.answer || response.data?.answer || ''
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}
