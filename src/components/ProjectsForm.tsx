import { useState } from 'react'
import { Plus, X, ExternalLink, Github, Sparkles, Loader2 } from 'lucide-react'
import { Project } from '../types/portfolio'

interface ProjectsFormProps {
  projects: Project[]
  onChange: (projects: Project[]) => void
}

export default function ProjectsForm({ projects, onChange }: ProjectsFormProps) {
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    title: '',
    description: '',
    technologies: [],
    liveUrl: '',
    githubUrl: '',
    imageUrl: '',
    startDate: '',
    endDate: '',
  })
  const [techInput, setTechInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const addProject = () => {
    if (newProject.title && newProject.description && newProject.startDate) {
      onChange([
        ...projects,
        { ...newProject, id: Date.now().toString() },
      ])
      setNewProject({
        title: '',
        description: '',
        technologies: [],
        liveUrl: '',
        githubUrl: '',
        imageUrl: '',
        startDate: '',
        endDate: '',
      })
      setTechInput('')
    }
  }

  const removeProject = (id: string) => {
    onChange(projects.filter((project) => project.id !== id))
  }

  const addTechnology = () => {
    if (techInput && !newProject.technologies.includes(techInput)) {
      setNewProject({ ...newProject, technologies: [...newProject.technologies, techInput] })
      setTechInput('')
    }
  }

  const handleGenerateProject = async () => {
    if (!newProject.title || newProject.technologies.length === 0) {
      setError('Please enter project name and at least one technology')
      return
    }

    const token = localStorage.getItem('sb-access-token')
    if (!token) {
      setError('Please log in to use AI generation')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3001/ai/improve-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectName: newProject.title,
          technologies: newProject.technologies,
        }),
      })

      const result = await response.json()
      if (result.error) throw new Error(result.error)

      setNewProject({
        ...newProject,
        description: result.data.description,
      })
    } catch (err: any) {
      setError(err.message || 'Failed to improve project')
    } finally {
      setIsGenerating(false)
    }
  }

  const removeTechnology = (tech: string) => {
    setNewProject({
      ...newProject,
      technologies: newProject.technologies.filter((t) => t !== tech),
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Projects</h2>
      <p className="text-muted-foreground">
        Showcase your best projects with descriptions and technologies used.
      </p>

      <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="projectTitle" className="text-sm font-medium">
              Project Title *
            </label>
            <input
              id="projectTitle"
              type="text"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              className="w-full px-3 py-2 rounded-md border bg-background"
              placeholder="My Awesome Project"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <label htmlFor="projectDescription" className="text-sm font-medium">
                Description *
              </label>
              <button
                onClick={handleGenerateProject}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Improving...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3" />
                    AI Improve
                  </>
                )}
              </button>
            </div>
            <textarea
              id="projectDescription"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="w-full px-3 py-2 rounded-md border bg-background min-h-[100px]"
              placeholder="Describe your project..."
            />
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="startDate" className="text-sm font-medium">
              Start Date *
            </label>
            <input
              id="startDate"
              type="month"
              value={newProject.startDate}
              onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
              className="w-full px-3 py-2 rounded-md border bg-background"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="endDate" className="text-sm font-medium">
              End Date
            </label>
            <input
              id="endDate"
              type="month"
              value={newProject.endDate}
              onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
              className="w-full px-3 py-2 rounded-md border bg-background"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="liveUrl" className="text-sm font-medium">
              Live URL
            </label>
            <input
              id="liveUrl"
              type="url"
              value={newProject.liveUrl}
              onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-md border bg-background"
              placeholder="https://myproject.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="githubUrl" className="text-sm font-medium">
              GitHub URL
            </label>
            <input
              id="githubUrl"
              type="url"
              value={newProject.githubUrl}
              onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-md border bg-background"
              placeholder="https://github.com/user/repo"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="imageUrl" className="text-sm font-medium">
              Image URL
            </label>
            <input
              id="imageUrl"
              type="url"
              value={newProject.imageUrl}
              onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-md border bg-background"
              placeholder="https://example.com/project-image.png"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="technologies" className="text-sm font-medium">
              Technologies
            </label>
            <div className="flex gap-2">
              <input
                id="technologies"
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                className="flex-1 px-3 py-2 rounded-md border bg-background"
                placeholder="React, TypeScript, etc."
              />
              <button
                onClick={addTechnology}
                disabled={!techInput}
                className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md font-medium hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
            {newProject.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {newProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                  >
                    {tech}
                    <button
                      onClick={() => removeTechnology(tech)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={addProject}
          disabled={!newProject.title || !newProject.description || !newProject.startDate}
          className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      {projects.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Added Projects ({projects.length})</h3>
          <div className="grid gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-4 border rounded-lg bg-card"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-lg">{project.title}</h4>
                  <button
                    onClick={() => removeProject(project.id)}
                    className="inline-flex items-center justify-center p-2 rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-muted-foreground mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 rounded-md bg-muted text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-primary"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-primary"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
