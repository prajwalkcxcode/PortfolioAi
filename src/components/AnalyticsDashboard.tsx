import { useState, useEffect } from 'react'
import { Eye, MousePointerClick, Users, TrendingUp } from 'lucide-react'

interface AnalyticsData {
  daily: Array<{
    date: string
    views: number
    clicks: number
    unique_visitors: number
  }>
  totals: {
    views: number
    clicks: number
    uniqueVisitors: number
  }
}

interface AnalyticsDashboardProps {
  portfolioId: string
}

export default function AnalyticsDashboard({ portfolioId }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    fetchAnalytics()
  }, [portfolioId, days])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`http://localhost:3001/analytics/${portfolioId}?days=${days}`)
      const result = await response.json()
      if (result.error) throw new Error(result.error)
      setAnalytics(result.data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-card rounded-lg border p-6">
        <div className="text-center py-8">
          <div className="text-muted-foreground">Loading analytics...</div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="bg-card rounded-lg border p-6">
        <div className="text-center py-8">
          <div className="text-muted-foreground">No analytics data available</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Total Views</span>
          </div>
          <div className="text-2xl font-bold">{analytics.totals.views}</div>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Unique Visitors</span>
          </div>
          <div className="text-2xl font-bold">{analytics.totals.uniqueVisitors}</div>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <MousePointerClick className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Total Clicks</span>
          </div>
          <div className="text-2xl font-bold">{analytics.totals.clicks}</div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Show:</span>
        {[7, 30, 90].map((dayOption) => (
          <button
            key={dayOption}
            onClick={() => setDays(dayOption)}
            className={`px-3 py-1 rounded text-sm ${
              days === dayOption
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {dayOption} days
          </button>
        ))}
      </div>

      {/* Daily Chart */}
      <div className="bg-card rounded-lg border p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Daily Analytics
        </h3>
        <div className="space-y-2">
          {analytics.daily.map((day) => (
            <div key={day.date} className="flex items-center gap-4 text-sm">
              <div className="w-24 text-muted-foreground">
                {new Date(day.date).toLocaleDateString()}
              </div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${Math.min((day.views / Math.max(...analytics.daily.map(d => d.views))) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
              <div className="w-16 text-right font-medium">{day.views} views</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
