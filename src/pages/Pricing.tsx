import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, X, ArrowRight, Loader2 } from 'lucide-react'

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
      name: 'Free',
      price: 0,
      interval: 'month',
      description: 'Perfect for getting started',
      features: [
        '1 portfolio',
        '50 AI credits/month',
        'Basic templates',
        'portfolioai.com subdomain',
        'Community support',
      ],
      stripePriceId: import.meta.env.VITE_STRIPE_FREE_PRICE_ID || '',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      interval: 'month',
      description: 'For professionals and businesses',
      popular: true,
      features: [
        'Unlimited portfolios',
        '500 AI credits/month',
        'Premium templates',
        'Custom domains',
        'Priority support',
        'Advanced analytics',
        'Remove PortfolioAI branding',
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

      // Redirect to Stripe Checkout
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
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Upgrade or downgrade at any time.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 p-8 ${
                plan.popular
                  ? 'border-primary bg-primary/5 shadow-2xl'
                  : 'border-border bg-card'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">{plan.name}</h2>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.interval}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.stripePriceId, plan.id)}
                disabled={loading === plan.id || plan.price === 0}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.id ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                    Processing...
                  </>
                ) : plan.price === 0 ? (
                  'Current Plan'
                ) : (
                  <>
                    Get Started
                    <ArrowRight className="h-5 w-5 inline ml-2" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Feature Comparison</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-4 text-left font-semibold">Feature</th>
                  <th className="p-4 text-center font-semibold">Free</th>
                  <th className="p-4 text-center font-semibold">Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-4">Portfolios</td>
                  <td className="p-4 text-center">1</td>
                  <td className="p-4 text-center">Unlimited</td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-4">AI Credits/month</td>
                  <td className="p-4 text-center">50</td>
                  <td className="p-4 text-center">500</td>
                </tr>
                <tr className="border-t">
                  <td className="p-4">Templates</td>
                  <td className="p-4 text-center">Basic</td>
                  <td className="p-4 text-center">Premium</td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-4">Custom Domains</td>
                  <td className="p-4 text-center">
                    <X className="h-5 w-5 text-destructive mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <Check className="h-5 w-5 text-primary mx-auto" />
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="p-4">Analytics</td>
                  <td className="p-4 text-center">Basic</td>
                  <td className="p-4 text-center">Advanced</td>
                </tr>
                <tr className="border-t bg-muted/50">
                  <td className="p-4">Support</td>
                  <td className="p-4 text-center">Community</td>
                  <td className="p-4 text-center">Priority</td>
                </tr>
                <tr className="border-t">
                  <td className="p-4">Branding</td>
                  <td className="p-4 text-center">PortfolioAI</td>
                  <td className="p-4 text-center">Custom</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Can I change plans later?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">What happens to my data if I cancel?</h3>
              <p className="text-muted-foreground">
                Your data remains accessible until the end of your billing period. You can export your portfolios at any time.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Do AI credits roll over?</h3>
              <p className="text-muted-foreground">
                AI credits reset each billing period. Unused credits do not roll over to the next month.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
