import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Save } from 'lucide-react'
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
  const [saving, setSaving] = useState(false)

  const steps: { key: Step; label: string }[] = [
    { key: 'personal', label: 'Personal Info' },
    { key: 'skills', label: 'Skills' },
    { key: 'projects', label: 'Projects' },
    { key: 'template', label: 'Template' },
    { key: 'customize', label: 'Customize' },
    { key: 'seo', label: 'SEO' },
  ]

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep)

  const canProceed = () => {
    switch (currentStep) {
      case 'personal':
        return personalInfo.fullName && personalInfo.email && personalInfo.title && personalInfo.bio
      case 'skills':
        return skills.length > 0
      case 'projects':
        return projects.length > 0
      case 'template':
        return true
      case 'customize':
        return true
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

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('sb-access-token')
      console.log('Token:', token ? 'exists' : 'missing')
      
      // Create portfolio
      const portfolioResponse = await fetch('http://localhost:3001/portfolios', {
        method: 'POST',
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

      console.log('Portfolio response status:', portfolioResponse.status)
      const portfolioData = await portfolioResponse.json()
      console.log('Portfolio response data:', portfolioData)
      
      if (portfolioData.error) throw new Error(portfolioData.error)

      const portfolioId = portfolioData.data.id
      console.log('Portfolio ID:', portfolioId)

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Create Your Portfolio</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    index <= currentStepIndex
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-xs mt-2 hidden sm:block">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-card rounded-lg border p-6 mb-6">
          {currentStep === 'personal' && (
            <PersonalInfoForm data={personalInfo} onChange={setPersonalInfo} />
          )}
          {currentStep === 'skills' && (
            <SkillsForm skills={skills} onChange={setSkills} />
          )}
          {currentStep === 'projects' && (
            <ProjectsForm projects={projects} onChange={setProjects} />
          )}
          {currentStep === 'template' && (
            <TemplateSelector
              selected={selectedTemplate}
              onSelect={setSelectedTemplate}
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {currentStep === steps[steps.length - 1].key ? (
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Preview Portfolio'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
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
