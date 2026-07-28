import { PersonalInfo, Skill, Project } from '../../types/portfolio'
import { Github, Linkedin, Mail, MapPin, ExternalLink, Palette } from 'lucide-react'

interface DesignerTemplateProps {
  personalInfo: PersonalInfo
  skills: Skill[]
  projects: Project[]
}

export default function DesignerTemplate({ personalInfo, skills, projects }: DesignerTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-20">
          {personalInfo.avatar && (
            <img
              src={personalInfo.avatar}
              alt={personalInfo.fullName}
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-purple-500 shadow-lg"
            />
          )}
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {personalInfo.fullName}
          </h1>
          <p className="text-2xl text-purple-700 mb-4">{personalInfo.title}</p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">{personalInfo.bio}</p>
          <div className="flex justify-center gap-4 mb-6">
            {personalInfo.github && (
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <Github className="h-6 w-6 text-purple-600" />
              </a>
            )}
            {personalInfo.linkedin && (
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <Linkedin className="h-6 w-6 text-purple-600" />
              </a>
            )}
            {personalInfo.email && (
              <a
                href={`mailto:${personalInfo.email}`}
                className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <Mail className="h-6 w-6 text-purple-600" />
              </a>
            )}
          </div>
          {personalInfo.location && (
            <p className="text-gray-500 flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4" />
              {personalInfo.location}
            </p>
          )}
        </header>

        {/* Skills */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center text-purple-800 flex items-center justify-center gap-2">
            <Palette className="h-8 w-8" />
            Creative Skills
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <span className="font-semibold text-purple-700">{skill.name}</span>
                <span className="text-purple-500 ml-2">• {skill.level}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center text-purple-800">Featured Work</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-purple-800">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 font-medium text-sm"
                      >
                        View Code
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 font-medium text-sm flex items-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Live Site
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
