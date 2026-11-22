/**
 * DocumentContext - stores the current document analysis result
 * so users can navigate between Results and Ask pages without re-uploading
 */
import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const DocumentContext = createContext(null)

const STORAGE_KEY = 'formsaathi_active_document'

export function DocumentProvider({ children }) {
  const [currentDocument, setCurrentDocumentState] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [extractedText, setExtractedText] = useState(() => currentDocument?.extracted_text || '')
  const [ocrLanguage, setOcrLanguage] = useState('Auto Detect')
  const [outputLanguage, setOutputLanguage] = useState('English')

  const setDocument = useCallback((doc) => {
    setCurrentDocumentState(doc)
    if (doc?.extracted_text) {
      setExtractedText(doc.extracted_text)
    } else if (doc?.ai_analysis) {
      setExtractedText(doc.ai_analysis)
    }
    if (doc) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(doc))
      } catch (err) {
        console.warn('Could not cache document to sessionStorage', err)
      }
    }
  }, [])

  const clearDocument = useCallback(() => {
    setCurrentDocumentState(null)
    setExtractedText('')
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch (err) {
      // ignore
    }
  }, [])

  // Sync extractedText if currentDocument changes externally
  useEffect(() => {
    if (currentDocument?.extracted_text) {
      setExtractedText(currentDocument.extracted_text)
    }
  }, [currentDocument])

  return (
    <DocumentContext.Provider
      value={{
        currentDocument,
        extractedText,
        ocrLanguage,
        setOcrLanguage,
        outputLanguage,
        setOutputLanguage,
        setDocument,
        clearDocument,
      }}
    >
      {children}
    </DocumentContext.Provider>
  )
}

export function useDocument() {
  const ctx = useContext(DocumentContext)
  if (!ctx) throw new Error('useDocument must be used within DocumentProvider')
  return ctx
}
