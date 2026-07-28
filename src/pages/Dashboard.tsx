import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Edit, Sparkles, LogOut, Zap, CreditCard, TrendingUp } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface Portfolio {
  id: string
  template: string
  bio: string
  created_at: string
  personal_info?: any
}

interface Subscription {
  plan_type: string
  status: string
  current_period_end: string
}

interface AICredits {
  credits_remaining: number
  credits_used: number
  period_end: string
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [aiCredits, setAiCredits] = useState<AICredits | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPortfolios()
    fetchSubscription()
    fetchAICredits()
  }, [])

  const fetchPortfolios = async () => {
    try {
      const token = localStorage.getItem('sb-access-token')
      const response = await fetch('http://localhost:3001/portfolios', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const { data, error } = await response.json()
      if (error) throw new Error(error)
      setPortfolios(data || [])
    } catch (error) {
      console.error('Failed to fetch portfolios:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem('sb-access-token')
      const response = await fetch('http://localhost:3001/subscriptions/current', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const { data, error } = await response.json()
      if (error) throw new Error(error)
      setSubscription(data)
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
    }
  }

  const fetchAICredits = async () => {
    try {
      const token = localStorage.getItem('sb-access-token')
      const response = await fetch('http://localhost:3001/ai/usage', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const { data, error } = await response.json()
      if (error) throw new Error(error)
      setAiCredits(data)
    } catch (error) {
      console.error('Failed to fetch AI credits:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio?')) return

    try {
      const token = localStorage.getItem('sb-access-token')
      const response = await fetch(`http://localhost:3001/portfolios/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const { error } = await response.json()
      if (error) throw new Error(error)
      setPortfolios(portfolios.filter((p) => p.id !== id))
    } catch (error) {
      console.error('Failed to delete portfolio:', error)
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  const getTemplateName = (template: string) => {
    const names: Record<string, string> = {
      modern: 'Modern Developer',
      minimal: 'Minimal Professional',
      creative: 'Creative Portfolio',
    }
    return names[template] || template
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">PortfolioAI</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.user_metadata?.name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Current Plan</span>
            </div>
            <div className="text-2xl font-bold capitalize">
              {subscription?.plan_type || 'Free'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {subscription?.status === 'active' ? 'Active' : 'Inactive'}
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">AI Credits</span>
            </div>
            <div className="text-2xl font-bold">
              {aiCredits?.credits_remaining || 50}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {aiCredits?.credits_used || 0} used this month
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Portfolios</span>
            </div>
            <div className="text-2xl font-bold">
              {portfolios.length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {subscription?.plan_type === 'pro' ? 'Unlimited' : '1 max'}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Portfolios</h1>
            <p className="text-muted-foreground">
              Manage and create your portfolios
            </p>
          </div>
          <div className="flex items-center gap-3">
            {subscription?.plan_type === 'free' && (
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 border border-primary text-primary px-4 py-2 rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <CreditCard className="h-4 w-4" />
                Upgrade to Pro
              </Link>
            )}
            <Link
              to="/create"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Create Portfolio
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading portfolios...</div>
          </div>
        ) : portfolios.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No portfolios yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first portfolio to get started
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Create Portfolio
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className="bg-card rounded-lg border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold mb-1">
                      {portfolio.personal_info?.fullName || 'Untitled Portfolio'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {getTemplateName(portfolio.template)}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(portfolio.created_at).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {portfolio.bio || 'No description'}
                </p>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/preview/${portfolio.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md border hover:bg-accent text-sm"
                  >
                    <Edit className="h-4 w-4" />
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(portfolio.id)}
                    className="p-2 rounded-md border hover:bg-destructive hover:text-destructive-foreground text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
