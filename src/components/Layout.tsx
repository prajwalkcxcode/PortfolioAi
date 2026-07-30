import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Moon, Sun, Menu, X } from 'lucide-react'
import { useDarkMode } from '../hooks/useDarkMode'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { toggleDarkMode } = useDarkMode()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans select-none">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <Sparkles className="h-5 w-5 text-foreground fill-foreground" />
            <span className="text-base font-semibold tracking-tight">PortfolioAI</span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                <Link to="/create" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Create
                </Link>
                <Link to="/marketplace" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Marketplace
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Login
                </Link>
                <Link to="/register" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Register
                </Link>
              </>
            )}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Toggle dark mode"
            >
              <Moon className="h-4.5 w-4.5 dark:hidden" />
              <Sun className="h-4.5 w-4.5 hidden dark:block" />
            </button>
          </nav>

          {/* Mobile Actions Header */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Toggle dark mode"
            >
              <Moon className="h-4.5 w-4.5 dark:hidden" />
              <Sun className="h-4.5 w-4.5 hidden dark:block" />
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur-md px-6 py-4 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
            <Link to="/" onClick={closeMenu} className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1">
              Home
            </Link>
            <Link to="/pricing" onClick={closeMenu} className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1">
              Pricing
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={closeMenu} className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1">
                  Dashboard
                </Link>
                <Link to="/create" onClick={closeMenu} className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1">
                  Create
                </Link>
                <Link to="/marketplace" onClick={closeMenu} className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1">
                  Marketplace
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1">
                  Login
                </Link>
                <Link to="/register" onClick={closeMenu} className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-neutral-50/50 dark:bg-neutral-950/20 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} PortfolioAI. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
