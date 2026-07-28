import { PersonalInfo, Skill, Project } from '../../types/portfolio'
import { Github, Linkedin, Mail, MapPin, ExternalLink, Building2, Users } from 'lucide-react'

interface AgencyTemplateProps {
  personalInfo: PersonalInfo
  skills: Skill[]
  projects: Project[]
}

export default function AgencyTemplate({ personalInfo, skills, projects }: AgencyTemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Header */}
        <header className="mb-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {personalInfo.avatar && (
              <img
                src={personalInfo.avatar}
                alt={personalInfo.fullName}
                className="w-48 h-48 rounded-2xl shadow-2xl border-8 border-indigo-600"
              />
            )}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
                <Building2 className="h-8 w-8 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                  Creative Agency
                </span>
              </div>
              <h1 className="text-6xl font-bold mb-4 text-gray-900">{personalInfo.fullName}</h1>
              <p className="text-2xl text-indigo-600 mb-6">{personalInfo.title}</p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl">{personalInfo.bio}</p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
                {personalInfo.location && (
                  <span className="flex items-center gap-2 text-gray-500">
                    <MapPin className="h-5 w-5" />
                    {personalInfo.location}
                  </span>
                )}
                {personalInfo.email && (
                  <span className="flex items-center gap-2 text-gray-500">
                    <Mail className="h-5 w-5" />
                    {personalInfo.email}
                  </span>
                )}
              </div>
              <div className="flex gap-4 justify-center lg:justify-start">
                {personalInfo.github && (
                  <a
                    href={personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
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
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-semibold"
                  >
                    <Linkedin className="h-5 w-5" />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-indigo-50 rounded-2xl">
              <div className="text-4xl font-bold text-indigo-600 mb-2">{projects.length}</div>
              <div className="text-gray-600">Projects</div>
            </div>
            <div className="text-center p-8 bg-indigo-50 rounded-2xl">
              <div className="text-4xl font-bold text-indigo-600 mb-2">{skills.length}</div>
              <div className="text-gray-600">Services</div>
            </div>
            <div className="text-center p-8 bg-indigo-50 rounded-2xl">
              <div className="text-4xl font-bold text-indigo-600 mb-2">5+</div>
              <div className="text-gray-600">Years</div>
            </div>
            <div className="text-center p-8 bg-indigo-50 rounded-2xl">
              <div className="text-4xl font-bold text-indigo-600 mb-2">50+</div>
              <div className="text-gray-600">Clients</div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900 flex items-center justify-center gap-3">
            <Users className="h-10 w-10 text-indigo-600" />
            Our Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="p-8 bg-white rounded-2xl shadow-lg border-2 border-gray-100 hover:border-indigo-600 transition-all hover:shadow-xl"
              >
                <h3 className="text-2xl font-bold mb-3 text-indigo-600">{skill.name}</h3>
                <p className="text-gray-600 mb-4">{skill.category}</p>
                <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-semibold">
                  {skill.level}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border border-gray-100"
              >
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{project.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium"
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
                        className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
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
                        className="inline-flex items-center gap-2 px-5 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-semibold"
                      >
                        <ExternalLink className="h-5 w-5" />
                        Live Site
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-12 rounded-3xl">
            <h2 className="text-4xl font-bold text-white mb-4">Let's Create Something Amazing</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              We're ready to bring your vision to life. Get in touch and let's discuss your next project.
            </p>
            {personalInfo.email && (
              <a
                href={`mailto:${personalInfo.email}`}
                className="inline-block px-10 py-4 bg-white text-indigo-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Start a Project
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
