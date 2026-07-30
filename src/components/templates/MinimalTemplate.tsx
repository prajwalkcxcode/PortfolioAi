import { PersonalInfo, Skill, Project } from '../../types/portfolio'
import { Mail, MapPin, ExternalLink, Github } from 'lucide-react'

interface MinimalTemplateProps {
  personalInfo: PersonalInfo
  skills: Skill[]
  projects: Project[]
  customStyles?: any
}

export default function MinimalTemplate({ personalInfo, skills, projects, customStyles }: MinimalTemplateProps) {
  const primaryColor = customStyles?.colors?.primary || '#3b82f6'
  const fontClass = customStyles?.font || 'Inter, sans-serif'
  const layout = customStyles?.layout || 'left'

  const alignmentClass = layout === 'centered' ? 'text-center items-center justify-center' : 'text-left items-start justify-start'

  return (
    <div 
      className="max-w-3xl mx-auto bg-white dark:bg-slate-900 p-12 rounded-2xl shadow-sm border border-border/20 dark:border-slate-800 transition-all duration-300"
      style={{ fontFamily: fontClass }}
    >
      {/* Header */}
      <div className={`mb-12 flex flex-col ${alignmentClass}`}>
        {personalInfo.avatar && (
          <img 
            src={personalInfo.avatar} 
            alt={personalInfo.fullName} 
            className="w-20 h-20 rounded-full object-cover mb-4 border"
          />
        )}
        <h1 className="text-5xl font-light text-slate-900 dark:text-slate-100 mb-4 tracking-tight">{personalInfo.fullName}</h1>
        <p className="text-xl text-muted-foreground mb-6 font-light">{personalInfo.title}</p>
        <p className={`text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl ${layout === 'centered' ? 'text-center' : 'text-left'}`}>
          {personalInfo.bio}
        </p>
      </div>

      {/* Contact */}
      <div className={`mb-12 text-sm text-muted-foreground space-y-2 flex flex-col ${layout === 'centered' ? 'items-center' : 'items-start'}`}>
        {personalInfo.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" style={{ color: primaryColor }} />
            <a href={`mailto:${personalInfo.email}`} className="hover:text-foreground hover:underline transition-colors">
              {personalInfo.email}
            </a>
          </div>
        )}
        {personalInfo.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" style={{ color: primaryColor }} />
            <span>{personalInfo.location}</span>
          </div>
        )}
        {personalInfo.github && (
          <div className="flex items-center gap-2">
            <Github className="h-4 w-4" style={{ color: primaryColor }} />
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:text-foreground hover:underline transition-colors">
              GitHub
            </a>
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="mb-12">
        <h2 
          className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-6"
          style={{ color: primaryColor }}
        >
          Skills
        </h2>
        <div className={`flex flex-wrap gap-x-6 gap-y-3 ${layout === 'centered' ? 'justify-center' : 'justify-start'}`}>
          {skills.map((skill) => (
            <span key={skill.id} className="text-slate-700 dark:text-slate-350 text-sm font-medium">
              {skill.name} <span className="text-xs text-muted-foreground font-light">({skill.level})</span>
              {skills.indexOf(skill) < skills.length - 1 && <span className="text-slate-200 dark:text-slate-800 ml-6">•</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div>
        <h2 
          className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-6"
          style={{ color: primaryColor }}
        >
          Projects
        </h2>
        <div className="space-y-10">
          {projects.map((project) => (
            <div key={project.id} className="group">
              <h3 className="text-2xl font-light text-slate-900 dark:text-slate-100 mb-2 group-hover:underline tracking-tight">{project.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.technologies.map((tech) => (
                  <span key={tech} className="text-xs text-slate-500 dark:text-slate-450 font-medium">
                    {tech}
                    {project.technologies.indexOf(tech) < project.technologies.length - 1 && <span className="text-slate-200 dark:text-slate-800 mx-2">/</span>}
                  </span>
                ))}
              </div>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                  style={{ color: primaryColor }}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Project
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
