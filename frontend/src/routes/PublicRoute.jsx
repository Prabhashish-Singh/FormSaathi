import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../context/useAuth'

export default function PublicRoute() {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    )
  }
  return user ? <Navigate to="/app" replace /> : <Outlet />
}
