import { PersonalInfo, Skill, Project } from '../../types/portfolio'
import { Mail, MapPin, ExternalLink, Github, Sparkles } from 'lucide-react'

interface CreativeTemplateProps {
  personalInfo: PersonalInfo
  skills: Skill[]
  projects: Project[]
}

export default function CreativeTemplate({ personalInfo, skills, projects }: CreativeTemplateProps) {
  return (
    <div className="max-w-5xl mx-auto bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Creative Header */}
      <div className="p-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
          <Sparkles className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          {personalInfo.fullName}
        </h1>
        <p className="text-2xl text-gray-700 mb-6">{personalInfo.title}</p>
        <p className="text-gray-600 max-w-2xl mx-auto">{personalInfo.bio}</p>
      </div>

      {/* Contact Bar */}
      <div className="bg-white/50 backdrop-blur-sm py-6 px-12 mb-8">
        <div className="flex flex-wrap justify-center gap-8">
          {personalInfo.email && (
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="h-5 w-5 text-purple-500" />
              <a href={`mailto:${personalInfo.email}`} className="hover:text-purple-600">
                {personalInfo.email}
              </a>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-5 w-5 text-pink-500" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-2 text-gray-700">
              <Github className="h-5 w-5 text-blue-500" />
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                GitHub
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="px-12 mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">What I Do</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <div key={skill.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mb-4" />
              <h3 className="font-bold text-gray-800 mb-2">{skill.name}</h3>
              <p className="text-sm text-gray-600">{skill.category}</p>
              <div className="mt-3 text-xs font-semibold text-purple-600">{skill.level}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="px-12 pb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">My Work</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-400" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium"
                  >
                    <ExternalLink className="h-4 w-4" />
                    See Live
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
