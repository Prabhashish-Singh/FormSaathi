import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from './context/AppContext'
import { AccessibilityProvider } from './context/AccessibilityContext'
import { AuthProvider } from './context/AuthContext.jsx'
import { DocumentProvider } from './context/DocumentContext.jsx'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <AccessibilityProvider>
        <AppProvider>
          <AuthProvider>
            <DocumentProvider>
              <AppRoutes />
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: '#fff',
                    color: '#14532d',
                    border: '1px solid #bbf7d0',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                  },
                  success: {
                    iconTheme: { primary: '#16a34a', secondary: '#fff' },
                  },
                  error: {
                    iconTheme: { primary: '#dc2626', secondary: '#fff' },
                    style: {
                      border: '1px solid #fecaca',
                      color: '#991b1b',
                    },
                  },
                }}
              />
            </DocumentProvider>
          </AuthProvider>
        </AppProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  )
}
