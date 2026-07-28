import { PersonalInfo, Skill, Project } from '../../types/portfolio'
import { Github, Linkedin, Mail, MapPin, ExternalLink, GraduationCap } from 'lucide-react'

interface StudentTemplateProps {
  personalInfo: PersonalInfo
  skills: Skill[]
  projects: Project[]
}

export default function StudentTemplate({ personalInfo, skills, projects }: StudentTemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-16 border-b pb-12">
          {personalInfo.avatar && (
            <img
              src={personalInfo.avatar}
              alt={personalInfo.fullName}
              className="w-28 h-28 rounded-full mx-auto mb-6 border-4 border-blue-500"
            />
          )}
          <h1 className="text-4xl font-bold mb-2 text-gray-900">{personalInfo.fullName}</h1>
          <p className="text-xl text-blue-600 mb-4">{personalInfo.title}</p>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">{personalInfo.bio}</p>
          <div className="flex justify-center gap-4">
            {personalInfo.github && (
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Github className="h-5 w-5" />
                GitHub
              </a>
            )}
            {personalInfo.linkedin && (
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                LinkedIn
              </a>
            )}
            {personalInfo.email && (
              <a
                href={`mailto:${personalInfo.email}`}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Mail className="h-5 w-5" />
                Contact
              </a>
            )}
          </div>
          {personalInfo.location && (
            <p className="text-gray-500 mt-4 flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4" />
              {personalInfo.location}
            </p>
          )}
        </header>

        {/* Skills */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            Skills & Technologies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className="p-4 bg-blue-50 rounded-lg border-2 border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-1">{skill.name}</h3>
                <p className="text-sm text-blue-700">{skill.level}</p>
                <p className="text-xs text-blue-600 mt-1">{skill.category}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Academic & Personal Projects</h2>
          <div className="space-y-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                  {project.startDate && (
                    <span className="text-sm text-gray-500">
                      {new Date(project.startDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                    >
                      <Github className="h-4 w-4" />
                      Source Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm py-8 border-t">
          <p>© {new Date().getFullYear()} {personalInfo.fullName}. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
