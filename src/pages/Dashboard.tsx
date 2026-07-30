import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Edit, Sparkles, LogOut, Zap, CreditCard, TrendingUp, Settings, Users, Globe, ExternalLink, Loader2, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AnalyticsDashboard from '../components/AnalyticsDashboard'

interface Portfolio {
  id: string
  template: string
  bio: string
  created_at: string
  subdomain?: string
  is_published?: boolean
  personal_info?: any
}

interface Subscription {
  plan_type: string
  status: string
  current_period_end: string
  cancel_at_period_end?: boolean
}

interface AICredits {
  credits_remaining: number
  credits_used: number
  period_end: string
}

interface CustomDomain {
  id: string
  domain: string
  verified: boolean
  ssl_status: string
  portfolio_id: string
}

interface TeamMember {
  id: string
  user_id: string
  role: string
  email?: string
}

interface Team {
  id: string
  name: string
  owner_id: string
  team_members: TeamMember[]
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'portfolios' | 'settings'>('portfolios')
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [aiCredits, setAiCredits] = useState<AICredits | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Analytics State
  const [activeAnalyticsId, setActiveAnalyticsId] = useState<string | null>(null)

  // Settings State
  const [customDomains, setCustomDomains] = useState<CustomDomain[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [newDomain, setNewDomain] = useState('')
  const [domainPortfolioId, setDomainPortfolioId] = useState('')
  const [newTeamName, setNewTeamName] = useState('')
  const [inviteEmail, setInviteEmail] = useState<Record<string, string>>({})
  const [inviteRole, setInviteRole] = useState<Record<string, string>>({})
  const [cancelingSubscription, setCancelingSubscription] = useState(false)
  const [settingsLoading, setSettingsLoading] = useState(false)

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    if (activeTab === 'settings') {
      fetchSettingsData()
    }
  }, [activeTab])

  const fetchInitialData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchPortfolios(),
        fetchSubscription(),
        fetchAICredits()
      ])
    } catch (err) {
      console.error('Error fetching initial dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchSettingsData = async () => {
    setSettingsLoading(true)
    try {
      await Promise.all([
        fetchCustomDomains(),
        fetchTeams()
      ])
    } catch (err) {
      console.error('Error fetching settings details:', err)
    } finally {
      setSettingsLoading(false)
    }
  }

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

  const fetchCustomDomains = async () => {
    try {
      const token = localStorage.getItem('sb-access-token')
      const response = await fetch('http://localhost:3001/custom-domains', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const { data, error } = await response.json()
      if (error) throw new Error(error)
      setCustomDomains(data || [])
    } catch (error) {
      console.error('Failed to fetch custom domains:', error)
    }
  }

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('sb-access-token')
      const response = await fetch('http://localhost:3001/teams', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const { data, error } = await response.json()
      if (error) throw new Error(error)
      setTeams(data || [])
    } catch (error) {
      console.error('Failed to fetch teams:', error)
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
      if (activeAnalyticsId === id) setActiveAnalyticsId(null)
    } catch (error) {
      console.error('Failed to delete portfolio:', error)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your Pro plan? Your features will remain active until the end of your billing period.')) return
    
    setCancelingSubscription(true)
    try {
      const token = localStorage.getItem('sb-access-token')
      const response = await fetch('http://localhost:3001/subscriptions/cancel', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      const { error } = await response.json()
      if (error) throw new Error(error)
      
      alert('Subscription cancelled successfully.')
      fetchSubscription()
    } catch (err: any) {
      alert(err.message || 'Failed to cancel subscription.')
    } finally {
      setCancelingSubscription(false)
    }
  }

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDomain || !domainPortfolioId) return

    try {
      const token = localStorage.getItem('sb-access-token')
      const response = await fetch('http://localhost:3001/custom-domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          domain: newDomain,
          portfolioId: domainPortfolioId
        })
      })
      const { data, error } = await response.json()
      if (error) throw new Error(error)

      setCustomDomains([...customDomains, data])
      setNewDomain('')
      alert('Custom domain linked successfully!')
    } catch (err: any) {
      alert(err.message || 'Failed to link custom domain')
    }
  }

  const handleDeleteDomain = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom domain?')) return

    try {
      const token = localStorage.getItem('sb-access-token')
      const response = await fetch(`http://localhost:3001/custom-domains/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const { error } = await response.json()
      if (error) throw new Error(error)

      setCustomDomains(customDomains.filter(d => d.id !== id))
    } catch (err: any) {
      alert(err.message || 'Failed to delete custom domain')
    }
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTeamName) return

    try {
      const token = localStorage.getItem('sb-access-token')
      const response = await fetch('http://localhost:3001/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newTeamName })
      })
      const { data, error } = await response.json()
      if (error) throw new Error(error)

      setTeams([...teams, { ...data, team_members: [] }])
      setNewTeamName('')
      alert('Team created successfully!')
    } catch (err: any) {
      alert(err.message || 'Failed to create team')
    }
  }

  const handleInviteMember = async (teamId: string) => {
    const email = inviteEmail[teamId]
    const role = inviteRole[teamId] || 'member'
    if (!email) return

    try {
      const token = localStorage.getItem('sb-access-token')
      const response = await fetch(`http://localhost:3001/teams/${teamId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email, role })
      })
      const { error } = await response.json()
      if (error) throw new Error(error)

      alert('Member added to team successfully!')
      fetchTeams()
      setInviteEmail(prev => ({ ...prev, [teamId]: '' }))
    } catch (err: any) {
      alert(err.message || 'Failed to invite team member')
    }
  }

  const handleCreateClick = (e: React.MouseEvent) => {
    const plan = subscription?.plan_type || 'free'
    if (plan === 'free' && portfolios.length >= 1) {
      e.preventDefault()
      alert('Free accounts are limited to 1 portfolio. Please upgrade to Pro to create unlimited portfolios.')
    }
  }

  const getTemplateName = (template: string) => {
    const names: Record<string, string> = {
      modern: 'SaaS Founder Portfolio',
      minimal: 'Minimal Professional',
      creative: 'Creative Portfolio',
      developer: 'Developer Portfolio',
      designer: 'Designer Portfolio',
      freelancer: 'Freelancer Portfolio',
      agency: 'Agency Portfolio',
      student: 'Student Portfolio',
    }
    return names[template] || template
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Upper Navigation Header */}
      <header className="border-b bg-card select-none">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-foreground fill-foreground" />
            <span className="text-sm font-semibold tracking-tight">PortfolioAI</span>
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Logged in as <span className="font-semibold text-foreground">{user?.user_metadata?.name || user?.email}</span>
            </span>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 text-xs font-semibold hover:text-neutral-500 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-6 border-b mb-8">
          <button
            onClick={() => setActiveTab('portfolios')}
            className={`pb-4 px-1 font-semibold text-xs flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'portfolios' 
                ? 'border-primary text-foreground' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Portfolios
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-4 px-1 font-semibold text-xs flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'settings' 
                ? 'border-primary text-foreground' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            Account & Team Settings
          </button>
        </div>

        {activeTab === 'portfolios' ? (
          <>
            {/* Stats Cards */}
            <div className="grid sm:grid-cols-3 gap-6 mb-10">
              <div className="bg-card rounded-xl border p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <CreditCard className="h-4 w-4 text-neutral-500" />
                    Subscription Plan
                  </div>
                  <span className={`w-2 h-2 rounded-full ${subscription?.status === 'active' ? 'bg-green-500' : 'bg-neutral-300'}`} />
                </div>
                <div className="text-xl font-bold capitalize text-foreground flex items-center gap-2 mt-2">
                  {subscription?.plan_type || 'Free'}
                  {subscription?.plan_type === 'pro' && (
                    <span className="text-[9px] bg-primary text-primary-foreground font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                      PRO
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground mt-2 font-medium">
                  Status: <span className="font-semibold text-foreground">{subscription?.status === 'active' ? 'Active' : 'Inactive'}</span>
                  {subscription?.cancel_at_period_end && ' (Pending cancellation)'}
                </div>
              </div>

              <div className="bg-card rounded-xl border p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <Zap className="h-4 w-4 text-neutral-500" />
                    Available AI Credits
                  </div>
                  <span className={`w-2 h-2 rounded-full ${(aiCredits?.credits_remaining || 50) > 20 ? 'bg-green-500' : 'bg-amber-500'}`} />
                </div>
                <div className="text-xl font-bold text-foreground mt-2">
                  {aiCredits?.credits_remaining !== undefined ? aiCredits.credits_remaining : 50}
                </div>
                <div className="text-[10px] text-muted-foreground mt-2 font-medium">
                  {aiCredits?.credits_used || 0} credits used this billing cycle
                </div>
              </div>

              <div className="bg-card rounded-xl border p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <TrendingUp className="h-4 w-4 text-neutral-500" />
                    Created Portfolios
                  </div>
                </div>
                <div className="text-xl font-bold text-foreground mt-2">
                  {portfolios.length}
                </div>
                <div className="text-[10px] text-muted-foreground mt-2 font-medium">
                  Limit: {subscription?.plan_type === 'pro' ? 'Unlimited' : '1 portfolio maximum'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-lg font-bold tracking-tight">Your Portfolios</h1>
                <p className="text-muted-foreground text-xs">
                  Build and manage your professional portfolios.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {(subscription?.plan_type || 'free') === 'free' && (
                  <Link
                    to="/pricing"
                    className="inline-flex items-center justify-center gap-2 border px-3 py-2 rounded-lg text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors shadow-sm"
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    Upgrade to Pro
                  </Link>
                )}
                <Link
                  to={((subscription?.plan_type || 'free') === 'free' && portfolios.length >= 1) ? '/pricing' : '/create'}
                  onClick={handleCreateClick}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create Portfolio
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16 bg-card rounded-xl border border-dashed flex flex-col items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-neutral-500 mb-2" />
                <div className="text-muted-foreground text-xs font-medium">Loading portfolios...</div>
              </div>
            ) : portfolios.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed rounded-xl bg-card/40">
                <Sparkles className="h-8 w-8 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-sm font-bold mb-1">No portfolios created yet</h3>
                <p className="text-muted-foreground text-xs mb-6 max-w-xs mx-auto">
                  Get started by creating your first portfolio with our handcrafted templates.
                </p>
                <Link
                  to="/create"
                  className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create First Portfolio
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolios.map((portfolio) => {
                    const isAnalysing = activeAnalyticsId === portfolio.id

                    return (
                      <div
                        key={portfolio.id}
                        className="bg-card rounded-xl border p-5 flex flex-col justify-between hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors"
                      >
                        <div>
                          <div className="flex items-start justify-between mb-3 gap-4">
                            <div className="min-w-0">
                              <h3 className="font-bold text-sm text-foreground truncate">
                                {portfolio.personal_info?.fullName || 'Untitled Portfolio'}
                              </h3>
                              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                                {getTemplateName(portfolio.template)}
                              </p>
                            </div>
                            <span className="text-[9px] bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded font-bold text-muted-foreground shrink-0">
                              {new Date(portfolio.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-xs text-muted-foreground mb-6 line-clamp-2 min-h-[32px] leading-relaxed">
                            {portfolio.bio || 'No profile description provided.'}
                          </p>
                        </div>

                        <div className="space-y-3">
                          {portfolio.is_published && (
                            <div className="text-[10px] text-green-600 dark:text-green-400 font-semibold bg-green-500/10 py-1.5 px-3 rounded-lg border border-green-500/20 truncate">
                              Live at: <a href={`http://${portfolio.subdomain}.portfolioai.com`} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-700">{portfolio.subdomain}.portfolioai.com</a>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-2">
                            <Link
                              to={`/preview/${portfolio.id}`}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg border hover:bg-neutral-50 dark:hover:bg-neutral-900 text-[11px] font-semibold transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View
                            </Link>
                            <Link
                              to={`/create/${portfolio.id}`}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg border hover:bg-neutral-50 dark:hover:bg-neutral-900 text-[11px] font-semibold transition-colors"
                            >
                              <Edit className="h-3 w-3" />
                              Edit
                            </Link>
                            <button
                              onClick={() => setActiveAnalyticsId(isAnalysing ? null : portfolio.id)}
                              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg border text-[11px] font-semibold transition-colors ${
                                isAnalysing ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900'
                              }`}
                            >
                              <TrendingUp className="h-3 w-3" />
                              Analytics
                            </button>
                            <button
                              onClick={() => handleDelete(portfolio.id)}
                              className="p-1.5 rounded-lg border hover:bg-destructive hover:text-destructive-foreground transition-colors text-muted-foreground shrink-0"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Expanded Analytics Dashboard Panel */}
                {activeAnalyticsId && (
                  <div className="bg-card rounded-xl border p-6 shadow-sm">
                    <div className="flex items-center justify-between border-b pb-4 mb-6">
                      <div>
                        <h2 className="text-sm font-bold flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-neutral-500" />
                          Portfolio Analytics Report
                        </h2>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Detailed visits analysis for the portfolio:{' '}
                          <span className="font-semibold text-foreground">
                            {portfolios.find(p => p.id === activeAnalyticsId)?.personal_info?.fullName || 'Selected Portfolio'}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveAnalyticsId(null)}
                        className="text-[10px] font-bold text-muted-foreground hover:text-foreground hover:underline"
                      >
                        Close Panel
                      </button>
                    </div>
                    <AnalyticsDashboard portfolioId={activeAnalyticsId} />
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* Account and Teams Settings Panel */
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column: Subscriptions & Custom Domains */}
            <div className="space-y-8">
              {/* Subscription Management */}
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="h-4.5 w-4.5 text-neutral-500" />
                  Subscription Plan
                </h3>
                <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-muted-foreground">Current Plan</span>
                    <span className="text-[9px] font-extrabold capitalize text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 tracking-wider">
                      {subscription?.plan_type || 'Free'}
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground leading-relaxed">
                    {subscription?.plan_type === 'pro' ? (
                      subscription?.cancel_at_period_end ? (
                        <span>Your plan cancels on {new Date(subscription.current_period_end).toLocaleDateString()}</span>
                      ) : (
                        <span>Auto-renews on {new Date(subscription.current_period_end).toLocaleDateString()}</span>
                      )
                    ) : (
                      <span>Free account is limited. Upgrade to connect custom domains, get premium templates, and use collaboration features.</span>
                    )}
                  </div>
                </div>

                {subscription?.plan_type === 'pro' && !subscription?.cancel_at_period_end && (
                  <button
                    onClick={handleCancelSubscription}
                    disabled={cancelingSubscription}
                    className="w-full inline-flex items-center justify-center gap-2 border border-destructive/20 hover:border-destructive text-destructive bg-destructive/5 hover:bg-destructive/10 px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                  >
                    {cancelingSubscription ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      'Cancel Subscription'
                    )}
                  </button>
                )}

                {(!subscription?.plan_type || subscription?.plan_type === 'free') && (
                  <Link
                    to="/pricing"
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold hover:opacity-95 transition-opacity"
                  >
                    Upgrade to Pro Plan
                  </Link>
                )}
              </div>

              {/* Custom Domains Linker */}
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-bold mb-1.5 flex items-center gap-2">
                  <Globe className="h-4.5 w-4.5 text-neutral-500" />
                  Custom Domains
                </h3>
                <p className="text-[10px] text-muted-foreground mb-4">
                  Link custom domains directly to your portfolios. (Requires Pro plan).
                </p>

                {/* Linked Custom Domains List */}
                {settingsLoading ? (
                  <div className="py-4 text-center text-xs text-muted-foreground">Loading domains...</div>
                ) : customDomains.length === 0 ? (
                  <div className="text-[10px] text-muted-foreground py-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg text-center border mb-4">
                    No custom domains linked yet.
                  </div>
                ) : (
                  <div className="space-y-2 mb-6">
                    {customDomains.map(d => (
                      <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border bg-neutral-50/50 dark:bg-neutral-900/20 text-xs">
                        <div className="min-w-0">
                          <span className="font-semibold text-foreground">{d.domain}</span>
                          <div className="text-[9px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <span className={d.verified ? 'text-green-600' : 'text-amber-500 font-semibold'}>{d.verified ? 'Verified' : 'Pending SSL'}</span>
                            <span>•</span>
                            <span>Linked to: {portfolios.find(p => p.id === d.portfolio_id)?.personal_info?.fullName || 'Portfolio'}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteDomain(d.id)}
                          className="text-[10px] text-destructive hover:underline font-bold"
                        >
                          Unlink
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Custom Domain Form */}
                <form onSubmit={handleAddDomain} className="space-y-3">
                  <div className="space-y-1">
                    <label htmlFor="portfolio-select" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Select Portfolio</label>
                    <select
                      id="portfolio-select"
                      value={domainPortfolioId}
                      onChange={(e) => setDomainPortfolioId(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border bg-background text-xs"
                      disabled={(subscription?.plan_type || 'free') !== 'pro'}
                    >
                      <option value="">-- Choose a portfolio --</option>
                      {portfolios.map(p => (
                        <option key={p.id} value={p.id}>{p.personal_info?.fullName || 'Untitled'}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="domain-input" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Domain name</label>
                    <input
                      id="domain-input"
                      type="text"
                      placeholder="e.g. www.johndoe.com"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border bg-background text-xs"
                      disabled={(subscription?.plan_type || 'free') !== 'pro'}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={(subscription?.plan_type || 'free') !== 'pro' || !domainPortfolioId || !newDomain}
                    className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-xs font-bold hover:opacity-95 disabled:opacity-50 transition-colors shadow-sm"
                  >
                    Link Custom Domain
                  </button>
                  {(subscription?.plan_type || 'free') !== 'pro' && (
                    <p className="text-[9px] text-amber-500 font-semibold mt-1">
                      ⚠️ Custom domains require a Pro subscription.
                    </p>
                  )}
                </form>
              </div>
            </div>

            {/* Right Column: Teams Collaboration */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold mb-1.5 flex items-center gap-2">
                <Users className="h-4.5 w-4.5 text-neutral-500" />
                Team Accounts
              </h3>
              <p className="text-[10px] text-muted-foreground mb-6">
                Collaborate and edit portfolios together with shared access rights.
              </p>

              {/* Teams List */}
              {settingsLoading ? (
                <div className="py-4 text-center text-xs text-muted-foreground">Loading teams...</div>
              ) : teams.length === 0 ? (
                <div className="text-[10px] text-muted-foreground py-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg text-center border mb-6">
                  You are not a member of any teams. Create a team below to begin collaborating.
                </div>
              ) : (
                <div className="space-y-6 mb-8">
                  {teams.map(team => {
                    const isOwner = team.owner_id === user?.id

                    return (
                      <div key={team.id} className="border rounded-xl p-4 bg-neutral-50/30 dark:bg-neutral-900/10 space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <h4 className="font-bold text-xs text-foreground">{team.name}</h4>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wider ${isOwner ? 'bg-primary/15 text-primary' : 'bg-neutral-100 dark:bg-neutral-800 text-muted-foreground'}`}>
                            {isOwner ? 'OWNER' : 'MEMBER'}
                          </span>
                        </div>

                        {/* Members list */}
                        <div className="space-y-2">
                          <h5 className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Members</h5>
                          <div className="space-y-1.5">
                            {/* Render owner */}
                            <div className="flex items-center justify-between text-xs py-0.5">
                              <span className="font-medium text-muted-foreground truncate max-w-[200px]">
                                {team.owner_id === user?.id ? 'You' : 'Team Owner'}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                                <Shield className="h-3 w-3 text-neutral-400" />
                                Owner
                              </span>
                            </div>

                            {/* Render other members */}
                            {team.team_members && team.team_members.map(member => (
                              <div key={member.id} className="flex items-center justify-between text-xs py-0.5">
                                <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                                  {member.user_id === user?.id ? 'You' : `User ID: ${member.user_id.substring(0,8)}...`}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-bold capitalize">
                                  {member.role}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Invite Member form inside team (only if owner or admin) */}
                        {isOwner && (
                          <div className="bg-background p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-2.5">
                            <h5 className="text-[10px] font-bold text-foreground uppercase tracking-wider">Invite Member</h5>
                            <div className="flex gap-2">
                              <input
                                type="email"
                                placeholder="Enter email"
                                value={inviteEmail[team.id] || ''}
                                onChange={(e) => setInviteEmail(prev => ({ ...prev, [team.id]: e.target.value }))}
                                className="flex-1 px-2.5 py-1.5 rounded border bg-background text-xs"
                              />
                              <select
                                value={inviteRole[team.id] || 'member'}
                                onChange={(e) => setInviteRole(prev => ({ ...prev, [team.id]: e.target.value }))}
                                className="px-2 py-1.5 rounded border bg-background text-xs"
                              >
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => handleInviteMember(team.id)}
                                disabled={!inviteEmail[team.id]}
                                className="bg-primary text-primary-foreground px-3 py-1.5 rounded text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                              >
                                Invite
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Create Team Form */}
              <form onSubmit={handleCreateTeam} className="border-t pt-4 space-y-3">
                <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">Create New Team</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter team name"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    required
                    className="flex-1 px-3 py-2 rounded-lg border bg-background text-xs"
                  />
                  <button
                    type="submit"
                    disabled={!newTeamName}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold hover:opacity-95 disabled:opacity-50 transition-colors shadow-sm"
                  >
                    Create Team
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
