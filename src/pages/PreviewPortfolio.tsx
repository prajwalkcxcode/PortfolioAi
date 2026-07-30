import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ArrowLeft, Download, Share2, Copy } from 'lucide-react'
import { Skill, Project } from '../types/portfolio'
import { Helmet } from 'react-helmet-async'
import ModernTemplate from '../components/templates/ModernTemplate'
import MinimalTemplate from '../components/templates/MinimalTemplate'
import CreativeTemplate from '../components/templates/CreativeTemplate'
import DeveloperTemplate from '../components/templates/DeveloperTemplate'
import DesignerTemplate from '../components/templates/DesignerTemplate'
import StudentTemplate from '../components/templates/StudentTemplate'
import FreelancerTemplate from '../components/templates/FreelancerTemplate'
import AgencyTemplate from '../components/templates/AgencyTemplate'

export default function PreviewPortfolio() {
  const { id } = useParams<{ id: string }>()
  const [portfolio, setPortfolio] = useState<any>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const token = localStorage.getItem('sb-access-token')
        
        // Fetch portfolio
        const portfolioResponse = await fetch(`http://localhost:3001/portfolios/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const portfolioData = await portfolioResponse.json()
        if (portfolioData.error) throw new Error(portfolioData.error)
        setPortfolio(portfolioData.data)

        // Track portfolio view
        await fetch('http://localhost:3001/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            portfolioId: id,
            type: 'view',
          }),
        })

        // Fetch skills
        const skillsResponse = await fetch(`http://localhost:3001/portfolios/${id}/skills`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const skillsData = await skillsResponse.json()
        setSkills(
          (skillsData.data || []).map((s: any) => ({
            id: s.id,
            name: s.skill_name,
            level: s.level,
            category: s.category,
          }))
        )

        // Fetch projects
        const projectsResponse = await fetch(`http://localhost:3001/portfolios/${id}/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const projectsData = await projectsResponse.json()
        setProjects(
          (projectsData.data || []).map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            technologies: p.technologies || [],
            githubUrl: p.github_url,
            liveUrl: p.live_url,
            imageUrl: p.image_url,
            startDate: p.start_date,
            endDate: p.end_date,
          }))
        )
      } catch (error) {
        console.error('Failed to fetch portfolio:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPortfolioData()
    }
  }, [id])

  const renderTemplate = () => {
    const template = portfolio?.template || 'modern'
    const personalInfo = portfolio?.personal_info || {}
    const customStyles = portfolio?.custom_styles || {}

    switch (template) {
      case 'modern':
        return <ModernTemplate personalInfo={personalInfo} skills={skills} projects={projects} customStyles={customStyles} />
      case 'minimal':
        return <MinimalTemplate personalInfo={personalInfo} skills={skills} projects={projects} customStyles={customStyles} />
      case 'creative':
        return <CreativeTemplate personalInfo={personalInfo} skills={skills} projects={projects} customStyles={customStyles} />
      case 'developer':
        return <DeveloperTemplate personalInfo={personalInfo} skills={skills} projects={projects} customStyles={customStyles} />
      case 'designer':
        return <DesignerTemplate personalInfo={personalInfo} skills={skills} projects={projects} customStyles={customStyles} />
      case 'student':
        return <StudentTemplate personalInfo={personalInfo} skills={skills} projects={projects} customStyles={customStyles} />
      case 'freelancer':
        return <FreelancerTemplate personalInfo={personalInfo} skills={skills} projects={projects} customStyles={customStyles} />
      case 'agency':
        return <AgencyTemplate personalInfo={personalInfo} skills={skills} projects={projects} customStyles={customStyles} />
      default:
        return <ModernTemplate personalInfo={personalInfo} skills={skills} projects={projects} customStyles={customStyles} />
    }
  }

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading portfolio...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {portfolio && (
        <Helmet>
          <title>{portfolio.meta_title || `${portfolio.personal_info?.fullName || 'Portfolio'} - PortfolioAI`}</title>
          <meta name="description" content={portfolio.meta_description || portfolio.personal_info?.bio || ''} />
          {portfolio.og_image && (
            <meta property="og:image" content={portfolio.og_image} />
          )}
          <meta property="og:title" content={portfolio.meta_title || `${portfolio.personal_info?.fullName || 'Portfolio'} - PortfolioAI`} />
          <meta property="og:description" content={portfolio.meta_description || portfolio.personal_info?.bio || ''} />
          <meta property="og:type" content="website" />
        </Helmet>
      )}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 border border-border px-4 py-2 rounded-lg font-medium hover:bg-accent"
            >
              {copied ? (
                <>
                  <Copy className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  Share
                </>
              )}
            </button>
            <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {renderTemplate()}
      </div>
    </div>
  )
}
