import { PersonalInfo, Skill, Project } from '../../types/portfolio'
import { Github, Linkedin, Mail, MapPin, ArrowUpRight } from 'lucide-react'

interface DesignerTemplateProps {
  personalInfo: PersonalInfo
  skills: Skill[]
  projects: Project[]
  customStyles?: any
}

export default function DesignerTemplate({ personalInfo, skills, projects, customStyles }: DesignerTemplateProps) {
  const fontClass = customStyles?.font || 'Inter, sans-serif'

  return (
    <div 
      className="min-h-screen bg-[#fafafa] text-neutral-900 border border-neutral-200 rounded-2xl font-sans overflow-hidden p-6 md:p-12 select-text"
      style={{ fontFamily: fontClass }}
    >
      <div className="max-w-4xl mx-auto py-12">
        {/* Header Hero Section */}
        <header className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
            {personalInfo.avatar && (
              <img
                src={personalInfo.avatar}
                alt={personalInfo.fullName}
                className="w-20 h-20 rounded-2xl border object-cover shadow-sm bg-white"
              />
            )}
            
            <div className="flex gap-3 select-none">
              {personalInfo.email && (
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="p-2 border bg-white text-neutral-700 hover:text-black rounded-lg transition-colors hover:border-neutral-400"
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
              {personalInfo.github && (
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border bg-white text-neutral-700 hover:text-black rounded-lg transition-colors hover:border-neutral-400"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
              {personalInfo.linkedin && (
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border bg-white text-neutral-700 hover:text-black rounded-lg transition-colors hover:border-neutral-400"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-black mb-4 select-none">
            {personalInfo.fullName}
          </h1>
          <p className="text-lg font-medium text-neutral-500 mb-6">{personalInfo.title}</p>
          
          <p className="text-base text-neutral-600 font-light leading-relaxed max-w-2xl">
            {personalInfo.bio}
          </p>

          {personalInfo.location && (
            <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-6 select-none">
              <MapPin className="h-3.5 w-3.5" />
              {personalInfo.location}
            </p>
          )}
        </header>

        {/* Selected Work (Grid) */}
        <section className="mb-20">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-8 border-b pb-3 select-none">
            Selected Creative Work
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group border bg-white rounded-xl overflow-hidden hover:shadow-md hover:border-neutral-400 transition-all flex flex-col justify-between"
              >
                <div>
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-44 object-cover border-b"
                    />
                  )}
                  <div className="p-5">
                    <h3 className="text-sm font-bold text-black tracking-tight flex items-center gap-1">
                      {project.title}
                      <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed font-light mt-1.5">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 border text-neutral-600 bg-neutral-50 rounded text-[9px] font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 border-t pt-3 select-none text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                        Repository
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                        Interactive site
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skill tags */}
        <section>
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-8 border-b pb-3 select-none">
            Specializations
          </h2>

          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="px-4 py-2 border bg-white rounded-lg hover:border-neutral-400 transition-colors flex items-center gap-2 text-xs font-semibold text-neutral-800"
              >
                <span>{skill.name}</span>
                <span className="text-[10px] text-neutral-400 font-light">• {skill.level}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
