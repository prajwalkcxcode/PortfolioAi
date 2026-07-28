import { Check } from 'lucide-react'

interface TemplateSelectorProps {
  selected: string
  onSelect: (template: string) => void
}

const templates = [
  {
    id: 'modern',
    name: 'Modern Developer',
    description: 'Clean and contemporary design with bold typography',
    preview: 'A modern template with a hero section, clean layout, and vibrant accent colors.',
  },
  {
    id: 'minimal',
    name: 'Minimal Professional',
    description: 'Simple and elegant with lots of white space',
    preview: 'A minimalist template focusing on content with subtle animations.',
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Bold and artistic with unique layouts',
    preview: 'A creative template with asymmetric layouts and artistic elements.',
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Dark theme optimized for developers',
    preview: 'Dark slate theme with cyan accents, perfect for showcasing code and technical skills.',
  },
  {
    id: 'designer',
    name: 'Designer',
    description: 'Colorful and artistic for creative professionals',
    preview: 'Gradient background with purple/pink tones, ideal for designers and creatives.',
  },
  {
    id: 'student',
    name: 'Student',
    description: 'Clean and professional for students',
    preview: 'Simple white theme with blue accents, perfect for academic and personal projects.',
  },
  {
    id: 'freelancer',
    name: 'Freelancer',
    description: 'Bold and professional for independent workers',
    preview: 'Dark theme with amber accents, designed to attract clients and showcase expertise.',
  },
  {
    id: 'agency',
    name: 'Agency',
    description: 'Corporate and professional for agencies',
    preview: 'Clean white theme with indigo accents, perfect for agencies and teams.',
  },
]

export default function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Choose a Template</h2>
      <p className="text-muted-foreground">
        Select a template that best represents your style and profession.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selected === template.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            {selected === template.id && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>
            )}
            <div className="aspect-video rounded-lg bg-muted mb-4 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="text-4xl mb-2">🎨</div>
                <div className="text-sm">Template Preview</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-1">{template.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
            <p className="text-xs text-muted-foreground">{template.preview}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
