import { PersonalInfo, Skill, Project } from '../../types/portfolio'
import { Github, Linkedin, Mail, MapPin, ExternalLink, GraduationCap, Briefcase } from 'lucide-react'

interface StudentTemplateProps {
  personalInfo: PersonalInfo
  skills: Skill[]
  projects: Project[]
  customStyles?: any
}

export default function StudentTemplate({ personalInfo, skills, projects, customStyles }: StudentTemplateProps) {
  const fontClass = customStyles?.font || 'Inter, sans-serif'

  return (
    <div 
      className="min-h-screen bg-white text-neutral-900 border border-neutral-200 rounded-2xl font-sans overflow-hidden select-text"
      style={{ fontFamily: fontClass }}
    >
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        
        {/* Recruiter-Friendly Header */}
        <header className="mb-16 border-b border-neutral-100 pb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-5 select-none">
              {personalInfo.avatar && (
                <img
                  src={personalInfo.avatar}
                  alt={personalInfo.fullName}
                  className="w-20 h-20 rounded-full border object-cover shadow-sm"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{personalInfo.fullName}</h1>
                <p className="text-sm text-neutral-500 font-medium mt-0.5">{personalInfo.title}</p>
              </div>
            </div>
            
            {/* Contact details card box */}
            <div className="bg-neutral-50 border p-4 rounded-xl text-xs space-y-2.5 min-w-[240px]">
              <h4 className="font-bold text-neutral-400 uppercase tracking-widest text-[9px] mb-1.5 select-none">Contact Details</h4>
              {personalInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-neutral-400" />
                  <a href={`mailto:${personalInfo.email}`} className="text-neutral-600 hover:text-neutral-900 font-medium hover:underline">
                    {personalInfo.email}
                  </a>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-2 text-neutral-600">
                  <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                  <span className="font-medium">{personalInfo.location}</span>
                </div>
              )}
              <div className="flex gap-4 pt-1 select-none">
                {personalInfo.github && (
                  <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-neutral-900 flex items-center gap-1 font-semibold hover:underline">
                    <Github className="h-3.5 w-3.5" />
                    GitHub
                  </a>
                )}
                {personalInfo.linkedin && (
                  <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-neutral-900 flex items-center gap-1 font-semibold hover:underline">
                    <Linkedin className="h-3.5 w-3.5" />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl font-light">
            {personalInfo.bio}
          </p>
        </header>

        {/* Skills Grouped Category Grid */}
        <section className="mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-8 flex items-center gap-2 select-none">
            <GraduationCap className="h-4 w-4 text-neutral-400" />
            Core Competencies
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className="p-4 bg-neutral-50 border rounded-xl hover:bg-neutral-100/40 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-xs font-semibold text-neutral-900">{skill.name}</h3>
                  <span className="text-[9px] bg-neutral-200 text-neutral-700 font-bold px-1.5 py-0.5 rounded">
                    {skill.level}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider mt-0.5">{skill.category}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Academic & Personal Projects */}
        <section className="mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-8 flex items-center gap-2 select-none">
            <Briefcase className="h-4 w-4 text-neutral-400" />
            Projects Showcase
          </h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-5 border rounded-xl bg-white hover:shadow-sm hover:border-neutral-300 transition-all"
              >
                <div className="flex justify-between items-start mb-2 gap-4">
                  <h3 className="text-sm font-bold text-neutral-900">{project.title}</h3>
                  {project.startDate && (
                    <span className="text-[10px] text-neutral-400 font-medium shrink-0 select-none">
                      {new Date(project.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 bg-neutral-100 text-neutral-700 border rounded text-[9px] font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 border-t pt-3 select-none text-[11px] text-neutral-500 font-semibold">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-neutral-900 flex items-center gap-1 transition-colors"
                    >
                      <Github className="h-3.5 w-3.5" />
                      Source Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-neutral-900 flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
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
