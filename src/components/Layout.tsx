import { Link } from 'react-router-dom'
import { Sparkles, Moon, Sun } from 'lucide-react'
import { useDarkMode } from '../hooks/useDarkMode'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { toggleDarkMode } = useDarkMode()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">PortfolioAI</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link to="/create" className="text-sm font-medium hover:text-primary transition-colors">
                  Create
                </Link>
                <Link to="/marketplace" className="text-sm font-medium hover:text-primary transition-colors">
                  Marketplace
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">
                  Login
                </Link>
                <Link to="/register" className="text-sm font-medium hover:text-primary transition-colors">
                  Register
                </Link>
              </>
            )}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle dark mode"
            >
              <Moon className="h-5 w-5 dark:hidden" />
              <Sun className="h-5 w-5 hidden dark:block" />
            </button>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2024 PortfolioAI. Build your perfect portfolio.
        </div>
      </footer>
    </div>
  )
}
