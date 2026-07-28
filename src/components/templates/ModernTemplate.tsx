import { PersonalInfo, Skill, Project } from '../../types/portfolio'
import { Mail, MapPin, Linkedin, Github, Twitter, ExternalLink } from 'lucide-react'

interface ModernTemplateProps {
  personalInfo: PersonalInfo
  skills: Skill[]
  projects: Project[]
}

export default function ModernTemplate({ personalInfo, skills, projects }: ModernTemplateProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
        <h1 className="text-4xl font-bold mb-2">{personalInfo.fullName}</h1>
        <p className="text-xl text-blue-100 mb-4">{personalInfo.title}</p>
        <p className="text-blue-100 max-w-2xl">{personalInfo.bio}</p>
      </div>

      {/* Contact Info */}
      <div className="p-8 border-b">
        <div className="grid md:grid-cols-2 gap-4">
          {personalInfo.email && (
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-5 w-5" />
              <a href={`mailto:${personalInfo.email}`} className="hover:text-blue-600">
                {personalInfo.email}
              </a>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2 text-gray-600">
              <Linkedin className="h-5 w-5" />
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                LinkedIn
              </a>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-2 text-gray-600">
              <Github className="h-5 w-5" />
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                GitHub
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Skills Section */}
      <div className="p-8 border-b">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Skills</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <div key={skill.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="font-semibold text-gray-800">{skill.name}</div>
              <div className="text-sm text-gray-600">{skill.category} • {skill.level}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Projects</h2>
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{project.title}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
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
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
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
    </div>
  )
}
