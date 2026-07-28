import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import CreatePortfolio from './pages/CreatePortfolio'
import PreviewPortfolio from './pages/PreviewPortfolio'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Pricing from './pages/Pricing'
import TemplateMarketplace from './pages/TemplateMarketplace'
import { useAuth } from './contexts/AuthContext'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }
  
  if (user) {
    return <Navigate to="/dashboard" />
  }
  
  return <>{children}</>
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes without layout */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected routes with layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <CreatePortfolio />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/preview/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <PreviewPortfolio />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Public routes with layout */}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/pricing"
            element={
              <Layout>
                <Pricing />
              </Layout>
            }
          />
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <Layout>
                  <TemplateMarketplace />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
