import { PersonalInfo, Skill, Project } from '../../types/portfolio'
import { Github, Linkedin, Mail, MapPin, Code2, BookOpen, Star, GitFork } from 'lucide-react'

interface DeveloperTemplateProps {
  personalInfo: PersonalInfo
  skills: Skill[]
  projects: Project[]
  customStyles?: any
}

export default function DeveloperTemplate({ personalInfo, skills, projects, customStyles }: DeveloperTemplateProps) {
  const fontClass = customStyles?.font || 'Inter, sans-serif'

  return (
    <div 
      className="min-h-screen bg-[#0d1117] text-[#c9d1d9] border border-[#30363d] rounded-2xl overflow-hidden font-sans p-6 md:p-12 select-text"
      style={{ fontFamily: fontClass }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Left Column: Avatar & Profile */}
        <aside className="w-full md:w-1/4 flex flex-col items-center md:items-start text-center md:text-left select-none">
          {personalInfo.avatar && (
            <img
              src={personalInfo.avatar}
              alt={personalInfo.fullName}
              className="w-48 h-48 rounded-full border border-[#30363d] object-cover mb-4 bg-neutral-900 shadow-sm"
            />
          )}
          <h1 className="text-xl font-bold text-[#f0f6fc] tracking-tight">{personalInfo.fullName}</h1>
          <p className="text-sm text-[#8b949e] font-light mt-0.5">{personalInfo.title}</p>
          
          <p className="text-xs text-[#8b949e] mt-4 leading-relaxed max-w-sm md:max-w-none">
            {personalInfo.bio}
          </p>

          <div className="w-full border-t border-[#21262d] mt-6 pt-6 space-y-2.5 text-xs text-[#8b949e]">
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#8b949e] shrink-0" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#8b949e] shrink-0" />
                <a href={`mailto:${personalInfo.email}`} className="hover:text-[#58a6ff] transition-colors hover:underline">
                  {personalInfo.email}
                </a>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4 text-[#8b949e] shrink-0" />
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#58a6ff] transition-colors hover:underline truncate">
                  {personalInfo.github.replace('https://github.com/', '')}
                </a>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-[#8b949e] shrink-0" />
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#58a6ff] transition-colors hover:underline truncate">
                  LinkedIn Profile
                </a>
              </div>
            )}
          </div>
        </aside>

        {/* Right Column: Skills & Pinned Repos (Projects) */}
        <main className="w-full md:w-3/4 space-y-10">
          {/* Pinned Repositories Grid */}
          <section>
            <h2 className="text-sm font-semibold text-[#f0f6fc] border-b border-[#21262d] pb-2 mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#8b949e]" />
              Pinned Projects
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg flex flex-col justify-between hover:border-[#8b949e] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-sm text-[#58a6ff] hover:underline cursor-pointer">
                        {project.title}
                      </h3>
                      <span className="text-[9px] bg-[#111] border border-[#21262d] text-[#8b949e] font-semibold px-2 py-0.5 rounded-full uppercase">
                        Public
                      </span>
                    </div>
                    <p className="text-xs text-[#8b949e] leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Technologies list as colors */}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span 
                          key={tech} 
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#0d1117] border border-[#30363d]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#8b949e] border-t border-[#21262d] pt-3 mt-auto select-none">
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          12
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="h-3 w-3" />
                          4
                        </span>
                      </div>
                      <div className="flex gap-3">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#58a6ff] flex items-center gap-1 transition-colors">
                            Code
                          </a>
                        )}
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#58a6ff] flex items-center gap-1 transition-colors">
                            Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Languages & Skills */}
          <section>
            <h2 className="text-sm font-semibold text-[#f0f6fc] border-b border-[#21262d] pb-2 mb-4 flex items-center gap-2">
              <Code2 className="h-4 w-4 text-[#8b949e]" />
              Languages & Technologies
            </h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {skills.map((skill) => (
                <div key={skill.id} className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-[#f0f6fc]">{skill.name}</div>
                    <div className="text-[10px] text-[#8b949e] font-medium mt-1 uppercase tracking-wider">{skill.category}</div>
                  </div>
                  <span className="text-[9px] font-bold text-[#8b949e] bg-[#21262d] px-2 py-0.5 rounded">
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
