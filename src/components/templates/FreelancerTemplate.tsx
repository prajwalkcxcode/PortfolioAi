import { PersonalInfo, Skill, Project } from '../../types/portfolio'
import { Mail, MapPin, Star, MessageSquare } from 'lucide-react'

interface FreelancerTemplateProps {
  personalInfo: PersonalInfo
  skills: Skill[]
  projects: Project[]
  customStyles?: any
}

export default function FreelancerTemplate({ personalInfo, skills, projects, customStyles }: FreelancerTemplateProps) {
  const fontClass = customStyles?.font || 'Inter, sans-serif'

  return (
    <div 
      className="min-h-screen bg-[#fafafa] text-neutral-800 border border-neutral-200 rounded-2xl font-sans overflow-hidden p-6 md:p-12 select-text"
      style={{ fontFamily: fontClass }}
    >
      <div className="max-w-4xl mx-auto py-8">
        
        {/* Conversion-Oriented Hero */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            <div className="flex items-center gap-5 select-none">
              {personalInfo.avatar && (
                <img
                  src={personalInfo.avatar}
                  alt={personalInfo.fullName}
                  className="w-20 h-20 rounded-xl border object-cover shadow-sm bg-white"
                />
              )}
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-black">{personalInfo.fullName}</h1>
                <p className="text-xs font-mono text-neutral-500 mt-1 uppercase tracking-wide">{personalInfo.title}</p>
              </div>
            </div>

            {/* Main CTA */}
            {personalInfo.email && (
              <a
                href={`mailto:${personalInfo.email}`}
                className="inline-flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shadow-sm select-none"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Work With Me
              </a>
            )}
          </div>

          <p className="text-base text-neutral-600 font-light leading-relaxed max-w-2xl">
            {personalInfo.bio}
          </p>

          <div className="flex flex-wrap gap-4 mt-6 text-xs text-neutral-400 select-none">
            {personalInfo.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1.5 hover:text-black transition-colors">
                <Mail className="h-3.5 w-3.5 text-neutral-400" />
                {personalInfo.email}
              </a>
            )}
          </div>
        </header>

        {/* Stats Section */}
        <section className="mb-16 grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
          <div className="bg-white border p-5 rounded-xl text-center shadow-sm">
            <div className="text-xl font-bold text-black">{projects.length}</div>
            <div className="text-[10px] text-neutral-400 font-semibold uppercase mt-1">Delivered Projects</div>
          </div>
          <div className="bg-white border p-5 rounded-xl text-center shadow-sm">
            <div className="text-xl font-bold text-black">{skills.length}</div>
            <div className="text-[10px] text-neutral-400 font-semibold uppercase mt-1">Services Offered</div>
          </div>
          <div className="bg-white border p-5 rounded-xl text-center shadow-sm">
            <div className="text-xl font-bold text-black">100%</div>
            <div className="text-[10px] text-neutral-400 font-semibold uppercase mt-1">Satisfaction Rate</div>
          </div>
          <div className="bg-white border p-5 rounded-xl text-center shadow-sm">
            <div className="text-xl font-bold text-black">24h</div>
            <div className="text-[10px] text-neutral-400 font-semibold uppercase mt-1">Response Time</div>
          </div>
        </section>

        {/* Services & Skills */}
        <section className="mb-16">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-8 border-b pb-3 select-none">
            Services & Expertise
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div 
                key={skill.id} 
                className="bg-white border p-5 rounded-xl shadow-sm hover:border-neutral-400 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-bold text-black">{skill.name}</h3>
                  <div className="flex gap-0.5">
                    {[...Array(4)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < (skill.level === 'Expert' ? 4 : skill.level === 'Advanced' ? 3 : skill.level === 'Intermediate' ? 2 : 1)
                            ? 'text-black fill-black'
                            : 'text-neutral-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-neutral-400 font-mono uppercase tracking-wide">{skill.category} • {skill.level}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Case Studies / Projects */}
        <section className="mb-16">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-8 border-b pb-3 select-none">
            Featured Projects
          </h2>

          <div className="space-y-6">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="bg-white border rounded-xl overflow-hidden hover:shadow-sm transition-all"
              >
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-56 object-cover border-b"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-sm font-bold text-black mb-2">{project.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 border text-neutral-700 bg-neutral-50 rounded text-[9px] font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 border-t pt-3 select-none text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                        Code
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                        Live site
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final Bottom CTA */}
        {personalInfo.email && (
          <section className="bg-white border rounded-xl p-8 text-center shadow-sm select-none">
            <h2 className="text-base font-bold text-black mb-2">Have a project in mind?</h2>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-6 leading-relaxed">
              Let's collaborate to build products that deliver business results.
            </p>
            <a
              href={`mailto:${personalInfo.email}`}
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
            >
              Get In Touch
            </a>
          </section>
        )}
      </div>
    </div>
  )
}
