import { Link } from 'react-router-dom'
import { ArrowRight, Layout, Zap, Palette, User, Briefcase, Sparkles, Code, FileText, Layers } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Build Your Perfect Portfolio
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Create stunning, professional portfolios in minutes. Showcase your skills and projects beautifully with our easy-to-use builder.
        </p>
        {user ? (
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border hover:bg-accent transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-20 max-w-5xl mx-auto">
        <div className="text-center p-6 rounded-lg border bg-card">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
            <Layout className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Beautiful Templates</h3>
          <p className="text-muted-foreground">
            Choose from professionally designed templates that make your work stand out.
          </p>
        </div>

        <div className="text-center p-6 rounded-lg border bg-card">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Easy to Use</h3>
          <p className="text-muted-foreground">
            Create your portfolio in minutes with our intuitive multi-step builder.
          </p>
        </div>

        <div className="text-center p-6 rounded-lg border bg-card">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
            <Palette className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Fully Customizable</h3>
          <p className="text-muted-foreground">
            Personalize every aspect of your portfolio to match your unique style.
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-5xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
              1
            </div>
            <div className="flex justify-center mb-4">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Personal Info</h3>
            <p className="text-sm text-muted-foreground">
              Add your name, bio, and social links
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
              2
            </div>
            <div className="flex justify-center mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Add Skills</h3>
            <p className="text-sm text-muted-foreground">
              Showcase your technical expertise
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
              3
            </div>
            <div className="flex justify-center mb-4">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Add Projects</h3>
            <p className="text-sm text-muted-foreground">
              Display your best work with details
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
              4
            </div>
            <div className="flex justify-center mb-4">
              <Layers className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Choose Template</h3>
            <p className="text-sm text-muted-foreground">
              Pick a design that fits your style
            </p>
          </div>
        </div>
      </div>

      {/* Templates Preview Section */}
      <div className="max-w-5xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Template</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Code className="h-12 w-12 text-white" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Modern Developer</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Clean and contemporary with bold typography and blue accents
              </p>
              <Link
                to="/create"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
              >
                Use Template
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
              <FileText className="h-12 w-12 text-gray-600" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Minimal Professional</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Simple and elegant with lots of white space for focus
              </p>
              <Link
                to="/create"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
              >
                Use Template
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Palette className="h-12 w-12 text-white" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Creative Portfolio</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Bold and artistic with unique layouts and vibrant colors
              </p>
              <Link
                to="/create"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
              >
                Use Template
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Portfolio?</h2>
          <p className="text-lg mb-8 text-white/90">
            Join thousands of developers who have already created stunning portfolios with PortfolioAI.
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors"
          >
            Start Creating Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
