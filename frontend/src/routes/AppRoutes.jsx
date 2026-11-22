import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import AppLayout from '../components/layout/AppLayout'
import AuthLayout from '../components/layout/AuthLayout'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'

// Pages
import Home from '../pages/Home'
import Upload from '../pages/Upload'
import Results from '../pages/Results'
import AskFormSaathi from '../pages/AskFormSaathi'
import AccessibilitySettings from '../pages/AccessibilitySettings'
import HowItWorks from '../pages/HowItWorks'
import About from '../pages/About'
import Dashboard from '../pages/Dashboard'
import Documents from '../pages/Documents'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import ForgotPassword from '../pages/ForgotPassword'

function LegacyResultsRoute() {
  const { id } = useParams()
  return <Navigate to={`/app/results/${id}`} replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
      </Route>

      {/* Authentication pages */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
      </Route>

      {/* Protected application routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/upload" element={<Navigate to="/app/upload" replace />} />
        <Route path="/results" element={<Navigate to="/app/documents" replace />} />
        <Route path="/results/:id" element={<LegacyResultsRoute />} />
        <Route path="/ask" element={<Navigate to="/app/ask" replace />} />
        <Route path="/accessibility" element={<Navigate to="/app/accessibility" replace />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<Upload />} />
          <Route path="documents" element={<Documents />} />
          <Route path="results/:id" element={<Results />} />
          <Route path="ask" element={<AskFormSaathi />} />
          <Route path="accessibility" element={<AccessibilitySettings />} />
        </Route>
      </Route>

      {/* 4. Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
