import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, X, ArrowLeft, Loader2 } from 'lucide-react'

interface PricingPlan {
  id: string
  name: string
  price: number
  interval: string
  description: string
  features: string[]
  popular?: boolean
  stripePriceId: string
}

export default function Pricing() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<string | null>(null)

  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free Starter',
      price: 0,
      interval: 'month',
      description: 'Ideal for students and personal portfolios',
      features: [
        '1 Active Portfolio site',
        '50 AI Credits / month',
        'Basic developer and student templates',
        'portfolioai.com subdomain',
        'Community discussion support',
      ],
      stripePriceId: import.meta.env.VITE_STRIPE_FREE_PRICE_ID || '',
    },
    {
      id: 'pro',
      name: 'Pro Professional',
      price: 29,
      interval: 'month',
      description: 'Designed for active freelancers and developers',
      popular: true,
      features: [
        'Unlimited portfolios & hosting',
        '500 AI credits / month',
        'All Premium layouts (Vercel & Framer style)',
        'Custom domain support (SSL included)',
        'Advanced performance analytics',
        'Priority email support',
        'Complete removal of PortfolioAI branding',
      ],
      stripePriceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID || '',
    },
  ]

  const handleSubscribe = async (priceId: string, planId: string) => {
    setLoading(planId)
    try {
      const token = localStorage.getItem('sb-access-token')
      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch('http://localhost:3001/subscriptions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priceId }),
      })

      const result = await response.json()
      if (result.error) throw new Error(result.error)

      window.location.href = result.data.url
    } catch (error: any) {
      console.error('Subscription error:', error)
      alert(error.message || 'Failed to start subscription')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Simple, transparent plans</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Choose the right subscription for your career stage. Upgrade or downgrade instantly.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-20">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-xl border p-6 flex flex-col justify-between ${
                plan.popular
                  ? 'border-neutral-400 dark:border-neutral-700 bg-card shadow-sm'
                  : 'border-neutral-200 dark:border-neutral-800 bg-card'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-6 bg-primary text-primary-foreground text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  RECOMMENDED
                </div>
              )}

              <div>
                <div className="mb-6">
                  <h2 className="text-base font-bold mb-1 flex items-center gap-1.5">
                    {plan.name}
                  </h2>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{plan.description}</p>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-3xl font-extrabold">${plan.price}</span>
                    <span className="text-xs text-muted-foreground">/{plan.interval}</span>
                  </div>
                </div>

                <ul className="space-y-3.5 mb-8 border-t pt-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-neutral-600 dark:text-neutral-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSubscribe(plan.stripePriceId, plan.id)}
                disabled={loading === plan.id || plan.price === 0}
                className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-opacity ${
                  plan.popular
                    ? 'bg-primary text-primary-foreground hover:opacity-95'
                    : 'bg-secondary text-secondary-foreground hover:opacity-90'
                } disabled:opacity-50`}
              >
                {loading === plan.id ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin inline-block mr-2" />
                    Processing...
                  </>
                ) : plan.price === 0 ? (
                  'Current Plan'
                ) : (
                  'Upgrade to Pro'
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-lg font-bold mb-6 text-center">Feature Breakdown</h2>
          <div className="border rounded-xl overflow-hidden bg-card text-xs">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 dark:bg-neutral-900/30 text-left border-b">
                  <th className="p-4 font-bold text-muted-foreground">Feature</th>
                  <th className="p-4 text-center font-bold text-muted-foreground w-24">Free</th>
                  <th className="p-4 text-center font-bold text-muted-foreground w-24">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-4 font-medium">Hosting & Portfolios</td>
                  <td className="p-4 text-center text-muted-foreground">1</td>
                  <td className="p-4 text-center text-foreground font-semibold">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">AI Suggestions Credits</td>
                  <td className="p-4 text-center text-muted-foreground">50 / mo</td>
                  <td className="p-4 text-center text-foreground font-semibold">500 / mo</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Templates Level</td>
                  <td className="p-4 text-center text-muted-foreground">Basic</td>
                  <td className="p-4 text-center text-foreground font-semibold">All templates</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Custom Domains</td>
                  <td className="p-4 text-center">
                    <X className="h-4 w-4 text-neutral-300 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <Check className="h-4 w-4 text-foreground mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Analytics reports</td>
                  <td className="p-4 text-center text-muted-foreground">Basic</td>
                  <td className="p-4 text-center text-foreground font-semibold">Advanced</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Collaboration Teams</td>
                  <td className="p-4 text-center">
                    <X className="h-4 w-4 text-neutral-300 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <Check className="h-4 w-4 text-foreground mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto border-t pt-16">
          <h2 className="text-lg font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4 text-xs">
            <div className="border rounded-xl p-5 bg-card">
              <h3 className="font-bold mb-1.5 text-foreground">Can I change or cancel my plan at any time?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Yes. If you choose to cancel, your Pro subscription benefits will remain active until the end of your current monthly billing period.
              </p>
            </div>
            <div className="border rounded-xl p-5 bg-card">
              <h3 className="font-bold mb-1.5 text-foreground">Do my remaining AI credits roll over?</h3>
              <p className="text-muted-foreground leading-relaxed">
                No. Credits reset back to your plan's monthly allocation at the beginning of each billing cycle.
              </p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-16 text-center select-none">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
