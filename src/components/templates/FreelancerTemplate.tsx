import { PersonalInfo, Skill, Project } from '../../types/portfolio'
import { Github, Linkedin, Mail, MapPin, ExternalLink, Briefcase, Star } from 'lucide-react'

interface FreelancerTemplateProps {
  personalInfo: PersonalInfo
  skills: Skill[]
  projects: Project[]
}

export default function FreelancerTemplate({ personalInfo, skills, projects }: FreelancerTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {personalInfo.avatar && (
              <img
                src={personalInfo.avatar}
                alt={personalInfo.fullName}
                className="w-40 h-40 rounded-2xl border-4 border-amber-500 shadow-2xl"
              />
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-5xl font-bold mb-3 text-white">{personalInfo.fullName}</h1>
              <p className="text-2xl text-amber-400 mb-4">{personalInfo.title}</p>
              <p className="text-gray-300 mb-6 leading-relaxed">{personalInfo.bio}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                {personalInfo.location && (
                  <span className="flex items-center gap-2 text-gray-400">
                    <MapPin className="h-5 w-5" />
                    {personalInfo.location}
                  </span>
                )}
                {personalInfo.email && (
                  <span className="flex items-center gap-2 text-gray-400">
                    <Mail className="h-5 w-5" />
                    {personalInfo.email}
                  </span>
                )}
              </div>
              <div className="flex gap-4 justify-center md:justify-start">
                {personalInfo.github && (
                  <a
                    href={personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold"
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
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-semibold"
                  >
                    <Linkedin className="h-5 w-5" />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Skills */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-white">
            <Briefcase className="h-8 w-8 text-amber-500" />
            Expertise & Services
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {skills.map((skill) => (
              <div key={skill.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-amber-500 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold text-white">{skill.name}</h3>
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i <
                          (skill.level === 'Expert'
                            ? 4
                            : skill.level === 'Advanced'
                            ? 3
                            : skill.level === 'Intermediate'
                            ? 2
                            : 1)
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-amber-400 font-medium mb-2">{skill.level}</p>
                <p className="text-gray-400 text-sm">{skill.category}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-white">Portfolio</h2>
          <div className="space-y-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-amber-500 transition-all hover:shadow-2xl"
              >
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                    {project.startDate && (
                      <span className="text-sm text-gray-400">
                        {new Date(project.startDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg text-sm font-medium"
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
                        className="inline-flex items-center gap-2 px-5 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        <Github className="h-5 w-5" />
                        View Code
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold"
                      >
                        <ExternalLink className="h-5 w-5" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 text-center">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">Let's Work Together</h2>
            <p className="text-white/90 mb-6">Ready to bring your project to life? Get in touch!</p>
            {personalInfo.email && (
              <a
                href={`mailto:${personalInfo.email}`}
                className="inline-block px-8 py-4 bg-white text-amber-600 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Contact Me
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
