import { Check, Crown, Lock } from 'lucide-react'

interface TemplateSelectorProps {
  selected: string
  onSelect: (template: string) => void
  isPro?: boolean
}

const templates = [
  {
    id: 'modern',
    name: 'Modern Developer',
    description: 'Clean and contemporary design with bold typography',
    preview: 'A modern template with a hero section, clean layout, and vibrant accent colors.',
    premium: false,
  },
  {
    id: 'minimal',
    name: 'Minimal Professional',
    description: 'Simple and elegant with lots of white space',
    preview: 'A minimalist template focusing on content with subtle animations.',
    premium: false,
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Bold and artistic with unique layouts',
    preview: 'A creative template with asymmetric layouts and artistic elements.',
    premium: false,
  },
  {
    id: 'student',
    name: 'Student',
    description: 'Clean and professional for students',
    preview: 'Simple white theme with blue accents, perfect for academic and personal projects.',
    premium: false,
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Dark theme optimized for developers',
    preview: 'Dark slate theme with cyan accents, perfect for showcasing code and technical skills.',
    premium: true,
  },
  {
    id: 'designer',
    name: 'Designer',
    description: 'Colorful and artistic for creative professionals',
    preview: 'Gradient background with purple/pink tones, ideal for designers and creatives.',
    premium: true,
  },
  {
    id: 'freelancer',
    name: 'Freelancer',
    description: 'Bold and professional for independent workers',
    preview: 'Dark theme with amber accents, designed to attract clients and showcase expertise.',
    premium: true,
  },
  {
    id: 'agency',
    name: 'Agency',
    description: 'Corporate and professional for agencies',
    preview: 'Clean white theme with indigo accents, perfect for agencies and teams.',
    premium: true,
  },
]

export default function TemplateSelector({ selected, onSelect, isPro = false }: TemplateSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Choose a Template</h2>
          <p className="text-muted-foreground text-sm">
            Select a template that best represents your style and profession.
          </p>
        </div>
        {!isPro && (
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs px-3 py-1.5 rounded-full font-medium">
            <Crown className="h-3 w-3" />
            Upgrade to Pro to use Premium templates
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template) => {
          const isLocked = template.premium && !isPro
          const isSelected = selected === template.id

          return (
            <div
              key={template.id}
              onClick={() => onSelect(template.id)}
              className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/40 hover:bg-muted/30'
              } ${isLocked ? 'opacity-85' : ''}`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
              )}

              {template.premium && (
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                  {isLocked ? (
                    <>
                      <Lock className="h-2.5 w-2.5" />
                      LOCKED
                    </>
                  ) : (
                    <>
                      <Crown className="h-2.5 w-2.5" />
                      PREMIUM
                    </>
                  )}
                </div>
              )}

              <div className="aspect-video rounded-lg bg-gradient-to-br from-muted/80 to-muted/30 border border-border/40 mb-4 flex items-center justify-center overflow-hidden">
                <div className="text-center text-muted-foreground">
                  <div className="text-3xl mb-1.5">
                    {template.id === 'developer' ? '💻' : template.id === 'designer' ? '🎨' : template.id === 'creative' ? '✨' : '💼'}
                  </div>
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                    {template.name}
                  </div>
                </div>
              </div>

              <h3 className="text-base font-bold mb-1 flex items-center gap-1.5">
                {template.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                {template.description}
              </p>
              
              {isLocked && (
                <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium bg-amber-500/5 py-1 px-2.5 rounded border border-amber-500/10 text-center">
                  Requires Pro subscription
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
