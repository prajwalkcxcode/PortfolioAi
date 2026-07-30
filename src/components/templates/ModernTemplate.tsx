import { PersonalInfo, Skill, Project } from '../../types/portfolio'
import { Mail, MapPin, Linkedin, Github, ExternalLink, ArrowUpRight } from 'lucide-react'

interface ModernTemplateProps {
  personalInfo: PersonalInfo
  skills: Skill[]
  projects: Project[]
  customStyles?: any
}

export default function ModernTemplate({ personalInfo, skills, projects, customStyles }: ModernTemplateProps) {
  const fontClass = customStyles?.font || 'Inter, sans-serif'

  return (
    <div 
      className="min-h-screen bg-[#000] text-[#fff] border border-neutral-800 rounded-2xl font-sans overflow-hidden select-text"
      style={{ fontFamily: fontClass }}
    >
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        
        {/* Minimal Hero Header */}
        <header className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8 select-none">
            {personalInfo.avatar && (
              <img 
                src={personalInfo.avatar} 
                alt={personalInfo.fullName} 
                className="w-20 h-20 rounded-full border border-neutral-800 object-cover"
              />
            )}
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#fff]">{personalInfo.fullName}</h1>
              <p className="text-sm font-mono text-neutral-400 mt-1">{personalInfo.title}</p>
            </div>
          </div>
          
          <p className="text-base text-neutral-300 leading-relaxed max-w-2xl font-light">
            {personalInfo.bio}
          </p>

          <div className="flex flex-wrap gap-4 mt-8 text-xs text-neutral-400 select-none">
            {personalInfo.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-neutral-500" />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Mail className="h-3.5 w-3.5 text-neutral-500" />
                {personalInfo.email}
              </a>
            )}
            {personalInfo.github && (
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Github className="h-3.5 w-3.5 text-neutral-500" />
                GitHub
              </a>
            )}
            {personalInfo.linkedin && (
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Linkedin className="h-3.5 w-3.5 text-neutral-500" />
                LinkedIn
              </a>
            )}
          </div>
        </header>

        {/* Projects / Products Grid */}
        <section className="mb-20">
          <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-neutral-500 mb-8 border-b border-neutral-800 pb-3 select-none">
            Selected Products & Work
          </h2>

          <div className="space-y-4">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="group border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 bg-neutral-950 p-6 flex flex-col md:flex-row justify-between gap-6 transition-all duration-300"
              >
                <div className="space-y-4 max-w-xl">
                  <div>
                    <h3 className="text-base font-bold text-[#fff] tracking-tight group-hover:text-neutral-200 transition-colors flex items-center gap-1.5">
                      {project.title}
                      <ArrowUpRight className="h-3.5 w-3.5 text-neutral-500 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-light mt-1.5">
                      {project.description}
                    </p>
                  </div>
                  
                  {/* Monospace tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span 
                        key={tech} 
                        className="px-2 py-0.5 rounded font-mono text-[9px] text-neutral-400 bg-neutral-900 border border-neutral-800 uppercase"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center md:justify-end gap-3 mt-auto shrink-0 select-none text-[11px] text-neutral-400">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-neutral-800 hover:text-white hover:bg-neutral-900 transition-all font-medium"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Launch
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-neutral-800 hover:text-white hover:bg-neutral-900 transition-all font-medium"
                    >
                      <Github className="h-3 w-3" />
                      Repository
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills & Technologies Grid */}
        <section>
          <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-neutral-500 mb-8 border-b border-neutral-800 pb-3 select-none">
            Domain Expertise
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div 
                key={skill.id} 
                className="border border-neutral-800 p-5 rounded-xl bg-neutral-950/50 hover:bg-neutral-950 transition-colors flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xs font-semibold text-[#fff] tracking-tight">{skill.name}</h3>
                  <p className="text-[10px] font-mono text-neutral-500 uppercase mt-1">{skill.category}</p>
                </div>
                <div className="text-[9px] font-mono text-neutral-400 border border-neutral-800 px-2 py-0.5 rounded bg-neutral-900 uppercase">
                  {skill.level}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
