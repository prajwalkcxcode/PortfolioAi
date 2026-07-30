import { Link } from 'react-router-dom'
import { ArrowRight, Layout, Zap, Palette, Sparkles, Code, FileText } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border bg-neutral-50 dark:bg-neutral-900 text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-300 mb-6 tracking-wide uppercase select-none">
            <Sparkles className="h-3.5 w-3.5 text-neutral-500" />
            Designed for Developers & Creators
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1] max-w-3xl mx-auto">
            Build a professional portfolio that lands your next role.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop coding your personal site from scratch. Generate, customize, and host a premium developer portfolio in minutes with zero-config domains and real-time SEO indexing.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground h-12 px-6 rounded-lg text-sm sm:text-base font-semibold hover:opacity-95 transition-opacity w-full sm:w-auto shadow-sm"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground h-12 px-6 rounded-lg text-sm sm:text-base font-semibold hover:opacity-95 transition-opacity w-full sm:w-auto shadow-sm"
                >
                  Create Your Portfolio
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center h-12 px-6 rounded-lg border hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors text-sm sm:text-base font-semibold w-full sm:w-auto"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 md:py-28 border-t">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Built for conversion and speed.</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Every detail is engineered to impress recruiters and clients. Optimized for performance, search engines, and modern browser layouts.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border bg-card/50 transition-all hover:bg-card hover:shadow-sm">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-foreground mb-4 border">
                <Layout className="h-5 w-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold mb-2">Visual Customization</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Adjust fonts, colors, and spatial layouts. Personalize every element to fit your design standards.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-card/50 transition-all hover:bg-card hover:shadow-sm">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-foreground mb-4 border">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold mb-2">Resume Parsing</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Upload your resume in PDF/TXT. Our system parses and populates your work, skills, and projects automatically.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-card/50 transition-all hover:bg-card hover:shadow-sm">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-foreground mb-4 border">
                <Palette className="h-5 w-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold mb-2">Crafted Templates</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Choose from minimalist layouts designed specifically for developers, startup founders, and design leads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Preview Section */}
      <section className="py-20 bg-neutral-50/50 dark:bg-neutral-950/20 border-t">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Handcrafted Templates</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Select an archetype that best highlights your skills and career stage.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border rounded-xl overflow-hidden bg-card transition-all hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="aspect-video bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center border-b">
                  <Code className="h-10 w-10 text-neutral-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-sm sm:text-base font-bold mb-1.5">Modern Developer</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                    Clean, contemporary grid featuring bold headers and vibrant, customized color schemes.
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6">
                <Link
                  to="/create"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
                >
                  Use Modern Template
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="border rounded-xl overflow-hidden bg-card transition-all hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="aspect-video bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center border-b">
                  <FileText className="h-10 w-10 text-neutral-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-sm sm:text-base font-bold mb-1.5">Minimal Professional</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                    Elegant design utilizing clean space to keep client and recruiter focus purely on projects.
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6">
                <Link
                  to="/create"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
                >
                  Use Minimal Template
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="border rounded-xl overflow-hidden bg-card transition-all hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="aspect-video bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center border-b">
                  <Palette className="h-10 w-10 text-neutral-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-sm sm:text-base font-bold mb-1.5">Creative Portfolio</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                    Asymmetric, artistic styling featuring premium animations to highlight bold creative vision.
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6">
                <Link
                  to="/create"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
                >
                  Use Creative Template
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser Section */}
      <section className="py-20 md:py-28 border-t">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Transparent Pricing</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed">
            Start building for free. Upgrade to unlock premium customized styles, professional templates, and custom domain connections.
          </p>

          <div className="grid sm:grid-cols-2 gap-8 text-left max-w-2xl mx-auto mb-16">
            <div className="p-6 rounded-xl border bg-card flex flex-col justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold">Free Plan</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4">For hobbyists and students</p>
                <div className="text-3xl font-bold mb-4">$0 <span className="text-xs sm:text-sm font-normal text-muted-foreground">/ month</span></div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground mb-6">
                  <li className="flex items-center gap-2">✓ 1 Active Portfolio</li>
                  <li className="flex items-center gap-2">✓ 50 AI Generation Credits</li>
                  <li className="flex items-center gap-2">✓ Basic Templates</li>
                </ul>
              </div>
              <Link
                to="/register"
                className="w-full inline-flex items-center justify-center h-10 rounded-lg border text-xs sm:text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                Get Started
              </Link>
            </div>

            <div className="p-6 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-card flex flex-col justify-between shadow-sm relative">
              <span className="absolute -top-3 left-6 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                RECOMMENDED
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold">Pro Plan</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4">For professional job-seekers</p>
                <div className="text-3xl font-bold mb-4">$29 <span className="text-xs sm:text-sm font-normal text-muted-foreground">/ month</span></div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground mb-6">
                  <li className="flex items-center gap-2">✓ Unlimited Portfolios</li>
                  <li className="flex items-center gap-2">✓ 500 AI Credits / month</li>
                  <li className="flex items-center gap-2">✓ Premium Templates & Styles</li>
                  <li className="flex items-center gap-2">✓ Custom Domain Support</li>
                </ul>
              </div>
              <Link
                to="/pricing"
                className="w-full inline-flex items-center justify-center h-10 rounded-lg bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-neutral-50 dark:bg-neutral-950/20 border-t">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
            Build your portfolio today.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed">
            Create a custom, premium showcase of your best work and technical skills in minutes.
          </p>
          <Link
            to="/create"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground h-11 px-8 rounded-lg text-sm sm:text-base font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            Start Building Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
