import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Star, Check, ArrowRight, Loader2 } from 'lucide-react'

interface PremiumTemplate {
  id: string
  name: string
  description: string
  preview_image: string
  price: number
  features: string[]
  is_purchased: boolean
}

export default function TemplateMarketplace() {
  const [templates, setTemplates] = useState<PremiumTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('sb-access-token')
      const response = await fetch('http://localhost:3001/premium-templates', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const result = await response.json()
      if (result.error) throw new Error(result.error)
      setTemplates(result.data || [])
    } catch (error) {
      console.error('Failed to fetch templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (templateId: string) => {
    setPurchasing(templateId)
    try {
      const token = localStorage.getItem('sb-access-token')
      const response = await fetch('http://localhost:3001/premium-templates/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ templateId }),
      })
      const result = await response.json()
      if (result.error) throw new Error(result.error)

      // Redirect to Stripe Checkout
      window.location.href = result.data.url
    } catch (error: any) {
      console.error('Purchase error:', error)
      alert(error.message || 'Failed to start purchase')
    } finally {
      setPurchasing(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-muted-foreground">Loading templates...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Premium Template Marketplace</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Elevate your portfolio with professionally designed premium templates
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-card rounded-2xl border overflow-hidden hover:shadow-xl transition-shadow"
            >
              {template.preview_image ? (
                <img
                  src={template.preview_image}
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <ShoppingBag className="h-12 w-12 text-primary/50" />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{template.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">
                    ${template.price}
                  </div>
                </div>

                <p className="text-muted-foreground mb-4 text-sm">
                  {template.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {template.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {template.is_purchased ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-lg font-semibold bg-green-600 text-white cursor-not-allowed"
                  >
                    Purchased
                  </button>
                ) : (
                  <button
                    onClick={() => handlePurchase(template.id)}
                    disabled={purchasing === template.id}
                    className="w-full py-3 rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {purchasing === template.id ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Purchase Template
                        <ArrowRight className="h-5 w-5 inline ml-2" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {templates.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No premium templates available</h3>
            <p className="text-muted-foreground mb-4">
              Check back soon for new premium templates
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
