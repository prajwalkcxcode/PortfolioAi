import { PersonalInfo, Skill, Project } from '../../types/portfolio'
import { Mail, MapPin, ExternalLink, Github } from 'lucide-react'

interface MinimalTemplateProps {
  personalInfo: PersonalInfo
  skills: Skill[]
  projects: Project[]
}

export default function MinimalTemplate({ personalInfo, skills, projects }: MinimalTemplateProps) {
  return (
    <div className="max-w-3xl mx-auto bg-white p-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-light text-gray-900 mb-4">{personalInfo.fullName}</h1>
        <p className="text-xl text-gray-600 mb-6">{personalInfo.title}</p>
        <p className="text-gray-700 leading-relaxed max-w-2xl">{personalInfo.bio}</p>
      </div>

      {/* Contact */}
      <div className="mb-12 text-sm text-gray-600">
        {personalInfo.email && (
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-4 w-4" />
            <a href={`mailto:${personalInfo.email}`} className="hover:text-gray-900">
              {personalInfo.email}
            </a>
          </div>
        )}
        {personalInfo.location && (
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4" />
            <span>{personalInfo.location}</span>
          </div>
        )}
        {personalInfo.github && (
          <div className="flex items-center gap-2">
            <Github className="h-4 w-4" />
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
              GitHub
            </a>
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="mb-12">
        <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-6">Skills</h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span key={skill.id} className="text-gray-700">
              {skill.name}
              {skills.indexOf(skill) < skills.length - 1 && <span className="text-gray-300 mx-2">•</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div>
        <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-6">Projects</h2>
        <div className="space-y-8">
          {projects.map((project) => (
            <div key={project.id}>
              <h3 className="text-2xl font-light text-gray-900 mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.technologies.map((tech) => (
                  <span key={tech} className="text-sm text-gray-500">
                    {tech}
                    {project.technologies.indexOf(tech) < project.technologies.length - 1 && <span className="text-gray-300 mx-1">/</span>}
                  </span>
                ))}
              </div>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  <ExternalLink className="h-3 w-3" />
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
