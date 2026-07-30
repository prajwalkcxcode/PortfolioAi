import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Save, Upload, FileText, Loader2 } from 'lucide-react'
import PersonalInfoForm from '../components/PersonalInfoForm'
import SkillsForm from '../components/SkillsForm'
import ProjectsForm from '../components/ProjectsForm'
import TemplateSelector from '../components/TemplateSelector'
import VisualEditor from '../components/VisualEditor'
import SEOSettings from '../components/SEOSettings'
import { PersonalInfo, Skill, Project } from '../types/portfolio'

type Step = 'personal' | 'skills' | 'projects' | 'template' | 'customize' | 'seo'

export default function CreatePortfolio() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id

  const [currentStep, setCurrentStep] = useState<Step>('personal')
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    email: '',
    location: '',
    title: '',
    bio: '',
  })
  const [skills, setSkills] = useState<Skill[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [customStyles, setCustomStyles] = useState({
    colors: { primary: '#3b82f6', secondary: '#1e40af' },
    font: 'Inter, sans-serif',
    layout: 'centered',
  })
  const [seoSettings, setSeoSettings] = useState({
    metaTitle: '',
    metaDescription: '',
    ogImage: '',
  })
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [parsingResume, setParsingResume] = useState(false)
  const [resumeError, setResumeError] = useState('')
  const [isPro, setIsPro] = useState(false)

  const steps: { key: Step; label: string }[] = [
    { key: 'personal', label: 'Personal Info' },
    { key: 'skills', label: 'Skills' },
    { key: 'projects', label: 'Projects' },
    { key: 'template', label: 'Template' },
    { key: 'customize', label: 'Customize' },
    { key: 'seo', label: 'SEO' },
  ]

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep)

  // Check subscription status on mount
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const token = localStorage.getItem('sb-access-token')
        const response = await fetch('http://localhost:3001/subscriptions/current', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const result = await response.json()
        if (result.data && result.data.plan_type === 'pro') {
          setIsPro(true)
        }
      } catch (err) {
        console.error('Failed to fetch subscription in builder:', err)
      }
    }
    checkSubscription()
  }, [])

  // Load existing data if editing
  useEffect(() => {
    if (isEditing) {
      const fetchPortfolioData = async () => {
        try {
          const token = localStorage.getItem('sb-access-token')
          
          // Fetch portfolio details
          const response = await fetch(`http://localhost:3001/portfolios/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          const portfolioRes = await response.json()
          if (portfolioRes.error) throw new Error(portfolioRes.error)
          const p = portfolioRes.data
          
          setPersonalInfo(p.personal_info || { fullName: '', email: '', location: '', title: '', bio: '' })
          setSelectedTemplate(p.template || 'modern')
          setCustomStyles(p.custom_styles || { colors: { primary: '#3b82f6', secondary: '#1e40af' }, font: 'Inter, sans-serif', layout: 'centered' })
          setSeoSettings({
            metaTitle: p.meta_title || '',
            metaDescription: p.meta_description || '',
            ogImage: p.og_image || '',
          })

          // Fetch skills
          const skillsResponse = await fetch(`http://localhost:3001/portfolios/${id}/skills`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          const skillsRes = await skillsResponse.json()
          setSkills((skillsRes.data || []).map((s: any) => ({
            id: s.id,
            name: s.skill_name,
            level: s.level,
            category: s.category,
          })))

          // Fetch projects
          const projectsResponse = await fetch(`http://localhost:3001/portfolios/${id}/projects`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          const projectsRes = await projectsResponse.json()
          setProjects((projectsRes.data || []).map((pr: any) => ({
            id: pr.id,
            title: pr.title,
            description: pr.description,
            technologies: pr.technologies || [],
            githubUrl: pr.github_url,
            liveUrl: pr.live_url,
            imageUrl: pr.image_url,
            startDate: pr.start_date,
            endDate: pr.end_date,
          })))
        } catch (error) {
          console.error('Failed to load portfolio details:', error)
          alert('Failed to load portfolio details.')
        } finally {
          setLoading(false)
        }
      }
      fetchPortfolioData()
    }
  }, [id, isEditing])

  const canProceed = () => {
    switch (currentStep) {
      case 'personal':
        return !!(personalInfo.fullName && personalInfo.email && personalInfo.title && personalInfo.bio)
      case 'skills':
        return skills.length > 0
      case 'projects':
        return projects.length > 0
      case 'template':
      case 'customize':
      case 'seo':
        return true
    }
  }

  const handleNext = () => {
    if (canProceed() && currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].key)
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].key)
    }
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setParsingResume(true)
    setResumeError('')

    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const fileData = reader.result as string
        const token = localStorage.getItem('sb-access-token')
        
        const response = await fetch('http://localhost:3001/resume/parse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            fileData,
            fileName: file.name
          })
        })

        const result = await response.json()
        if (result.error) throw new Error(result.error)

        const parsed = result.data
        if (parsed.personalInfo) {
          setPersonalInfo({
            fullName: parsed.personalInfo.fullName || '',
            email: parsed.personalInfo.email || '',
            phone: parsed.personalInfo.phone || '',
            location: parsed.personalInfo.location || '',
            title: parsed.personalInfo.title || '',
            bio: parsed.personalInfo.bio || ''
          })
        }
        if (parsed.skills && Array.isArray(parsed.skills)) {
          setSkills(parsed.skills.map((s: any, idx: number) => ({
            id: `resume-${idx}-${Date.now()}`,
            name: s.name,
            level: s.level || 'Intermediate',
            category: s.category || 'Technical'
          })))
        }
        if (parsed.projects && Array.isArray(parsed.projects)) {
          setProjects(parsed.projects.map((p: any, idx: number) => ({
            id: `resume-${idx}-${Date.now()}`,
            title: p.title,
            description: p.description,
            technologies: p.technologies || [],
            liveUrl: p.liveUrl || '',
            githubUrl: p.githubUrl || '',
            imageUrl: p.imageUrl || '',
            startDate: p.startDate || '',
            endDate: p.endDate || ''
          })))
        }
        
        alert('Resume parsed successfully! Form fields prefilled.')
      }
      reader.readAsDataURL(file)
    } catch (err: any) {
      console.error(err)
      setResumeError(err.message || 'Failed to parse resume')
    } finally {
      setParsingResume(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('sb-access-token')
      const url = isEditing ? `http://localhost:3001/portfolios/${id}` : 'http://localhost:3001/portfolios'
      const method = isEditing ? 'PUT' : 'POST'
      
      const portfolioResponse = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          template: selectedTemplate,
          theme: 'light',
          bio: personalInfo.bio,
          personal_info: personalInfo,
          custom_styles: customStyles,
          meta_title: seoSettings.metaTitle,
          meta_description: seoSettings.metaDescription,
          og_image: seoSettings.ogImage,
        }),
      })

      const portfolioData = await portfolioResponse.json()
      if (portfolioData.error) throw new Error(portfolioData.error)

      const portfolioId = isEditing ? id : portfolioData.data.id

      if (isEditing) {
        // Bulk delete existing projects and skills first
        await fetch(`http://localhost:3001/portfolios/${portfolioId}/projects`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
        await fetch(`http://localhost:3001/portfolios/${portfolioId}/skills`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
      }

      // Create skills
      for (const skill of skills) {
        await fetch('http://localhost:3001/skills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            portfolio_id: portfolioId,
            skill_name: skill.name,
            level: skill.level,
            category: skill.category,
          }),
        })
      }

      // Create projects
      for (const project of projects) {
        await fetch('http://localhost:3001/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            portfolio_id: portfolioId,
            title: project.title,
            description: project.description,
            technologies: project.technologies,
            github_url: project.githubUrl,
            live_url: project.liveUrl,
            image_url: project.imageUrl,
            start_date: project.startDate,
            end_date: project.endDate,
          }),
        })
      }

      navigate(`/preview/${portfolioId}`)
    } catch (error) {
      console.error('Failed to save portfolio:', error)
      alert('Failed to save portfolio. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading portfolio details...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-background min-h-screen text-foreground">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-extrabold mb-8 tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          {isEditing ? 'Edit Your Portfolio' : 'Create Your Portfolio'}
        </h1>

        {/* Resume Import Section */}
        {!isEditing && currentStep === 'personal' && (
          <div className="bg-card rounded-xl border border-primary/20 p-6 mb-8 bg-gradient-to-r from-primary/5 to-blue-500/5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary animate-pulse" />
                  Import from Resume (PDF / TXT)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Upload your resume to automatically prefill all details, skills, and projects!
                </p>
              </div>
              <div>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleResumeUpload}
                  className="hidden"
                  disabled={parsingResume}
                />
                <label
                  htmlFor="resume-upload"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 cursor-pointer disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                >
                  {parsingResume ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Parsing Resume...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload Resume
                    </>
                  )}
                </label>
              </div>
            </div>
            {resumeError && (
              <p className="text-xs text-destructive mt-2">{resumeError}</p>
            )}
          </div>
        )}

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center flex-1 min-w-[80px]">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => {
                    // Only allow clicking steps the user can proceed to
                    if (index <= steps.findIndex(s => s.key === currentStep) || canProceed()) {
                      setCurrentStep(step.key)
                    }
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step.key === currentStep
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110'
                      : index < currentStepIndex
                      ? 'bg-primary/80 text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {index + 1}
                </button>
                <span className="text-xs mt-2 font-medium hidden sm:block whitespace-nowrap">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full min-w-[20px] ${
                    index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-card rounded-xl border p-6 mb-6 shadow-sm">
          {currentStep === 'personal' && (
            <PersonalInfoForm data={personalInfo} onChange={setPersonalInfo} />
          )}
          {currentStep === 'skills' && (
            <SkillsForm
              skills={skills}
              onChange={setSkills}
              title={personalInfo.title}
              bio={personalInfo.bio}
            />
          )}
          {currentStep === 'projects' && (
            <ProjectsForm projects={projects} onChange={setProjects} />
          )}
          {currentStep === 'template' && (
            <TemplateSelector
              selected={selectedTemplate}
              onSelect={setSelectedTemplate}
              isPro={isPro}
            />
          )}
          {currentStep === 'customize' && (
            <VisualEditor
              customStyles={customStyles}
              onChange={setCustomStyles}
            />
          )}
          {currentStep === 'seo' && (
            <SEOSettings
              data={seoSettings}
              onChange={setSeoSettings}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {currentStep === steps[steps.length - 1].key ? (
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : (isEditing ? 'Save & Preview' : 'Create & Preview')}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
