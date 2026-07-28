import { PersonalInfo, Skill, Project } from '../../types/portfolio'
import { Github, Linkedin, Mail, MapPin, ExternalLink, Code2 } from 'lucide-react'

interface DeveloperTemplateProps {
  personalInfo: PersonalInfo
  skills: Skill[]
  projects: Project[]
}

export default function DeveloperTemplate({ personalInfo, skills, projects }: DeveloperTemplateProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <header className="mb-16">
          <div className="flex items-center gap-6 mb-6">
            {personalInfo.avatar && (
              <img
                src={personalInfo.avatar}
                alt={personalInfo.fullName}
                className="w-24 h-24 rounded-full border-4 border-cyan-500"
              />
            )}
            <div>
              <h1 className="text-4xl font-bold mb-2">{personalInfo.fullName}</h1>
              <p className="text-xl text-cyan-400">{personalInfo.title}</p>
              <div className="flex items-center gap-4 mt-2 text-slate-400">
                {personalInfo.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {personalInfo.location}
                  </span>
                )}
                {personalInfo.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {personalInfo.email}
                  </span>
                )}
              </div>
            </div>
          </div>
          <p className="text-lg text-slate-300 leading-relaxed">{personalInfo.bio}</p>
          <div className="flex gap-4 mt-6">
            {personalInfo.github && (
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                LinkedIn
              </a>
            )}
          </div>
        </header>

        {/* Skills */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Code2 className="h-6 w-6 text-cyan-400" />
            Skills
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className="bg-slate-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{skill.name}</span>
                  <span className="text-sm text-slate-400">{skill.level}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-cyan-500 h-2 rounded-full"
                    style={{
                      width:
                        skill.level === 'Expert'
                          ? '100%'
                          : skill.level === 'Advanced'
                          ? '80%'
                          : skill.level === 'Intermediate'
                          ? '60%'
                          : '40%',
                    }}
                  />
                </div>
                <p className="text-sm text-slate-400 mt-2">{skill.category}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Projects</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-slate-800 p-6 rounded-lg hover:bg-slate-750 transition-colors">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-slate-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-sm"
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
                      className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
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
      </div>
    </div>
  )
}
