import { createContext, useContext, useMemo, useState } from 'react'

const AppContext = createContext(null)
export function AppProvider({ children }) {
  const [documents, setDocuments] = useState([])
  const [documentLanguage, setDocumentLanguageState] = useState(() => localStorage.getItem('formsaathi-document-language') || 'en')
  const setDocumentLanguage = (language) => {
    setDocumentLanguageState(language)
    localStorage.setItem('formsaathi-document-language', language)
  }
  const value = useMemo(() => ({ documents, setDocuments, documentLanguage, setDocumentLanguage }), [documents, documentLanguage])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
export const useApp = () => useContext(AppContext)
