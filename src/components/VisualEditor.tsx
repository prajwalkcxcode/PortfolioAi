import { useState } from 'react'
import { Palette, Type, Layout } from 'lucide-react'

interface VisualEditorProps {
  customStyles: any
  onChange: (styles: any) => void
}

export default function VisualEditor({ customStyles, onChange }: VisualEditorProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'layout'>('colors')

  const colorPresets = [
    { name: 'Blue', primary: '#3b82f6', secondary: '#1e40af' },
    { name: 'Purple', primary: '#8b5cf6', secondary: '#6d28d9' },
    { name: 'Green', primary: '#10b981', secondary: '#047857' },
    { name: 'Orange', primary: '#f97316', secondary: '#c2410c' },
    { name: 'Pink', primary: '#ec4899', secondary: '#be185d' },
    { name: 'Cyan', primary: '#06b6d4', secondary: '#0891b2' },
  ]

  const fontPresets = [
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Poppins', value: 'Poppins, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif' },
    { name: 'Lato', value: 'Lato, sans-serif' },
  ]

  const layoutPresets = [
    { name: 'Centered', value: 'centered' },
    { name: 'Left Aligned', value: 'left' },
    { name: 'Wide', value: 'wide' },
    { name: 'Compact', value: 'compact' },
  ]

  const handleColorChange = (primary: string, secondary: string) => {
    onChange({
      ...customStyles,
      colors: { primary, secondary },
    })
  }

  const handleFontChange = (font: string) => {
    onChange({
      ...customStyles,
      font,
    })
  }

  const handleLayoutChange = (layout: string) => {
    onChange({
      ...customStyles,
      layout,
    })
  }

  return (
    <div className="bg-card border rounded-lg p-6 space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Palette className="h-5 w-5" />
        Visual Editor
      </h3>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('colors')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'colors'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Palette className="h-4 w-4 inline mr-2" />
          Colors
        </button>
        <button
          onClick={() => setActiveTab('fonts')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'fonts'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Type className="h-4 w-4 inline mr-2" />
          Fonts
        </button>
        <button
          onClick={() => setActiveTab('layout')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'layout'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Layout className="h-4 w-4 inline mr-2" />
          Layout
        </button>
      </div>

      {/* Colors Tab */}
      {activeTab === 'colors' && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-3 block">Color Presets</label>
            <div className="grid grid-cols-3 gap-3">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleColorChange(preset.primary, preset.secondary)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    customStyles?.colors?.primary === preset.primary
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex gap-2 mb-2">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: preset.secondary }}
                    />
                  </div>
                  <span className="text-xs font-medium">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Primary Color</label>
              <input
                type="color"
                value={customStyles?.colors?.primary || '#3b82f6'}
                onChange={(e) =>
                  handleColorChange(e.target.value, customStyles?.colors?.secondary || '#1e40af')
                }
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Secondary Color</label>
              <input
                type="color"
                value={customStyles?.colors?.secondary || '#1e40af'}
                onChange={(e) =>
                  handleColorChange(customStyles?.colors?.primary || '#3b82f6', e.target.value)
                }
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Fonts Tab */}
      {activeTab === 'fonts' && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-3 block">Font Family</label>
            <div className="space-y-2">
              {fontPresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handleFontChange(preset.value)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    customStyles?.font === preset.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  style={{ fontFamily: preset.value }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Layout Tab */}
      {activeTab === 'layout' && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-3 block">Layout Style</label>
            <div className="grid grid-cols-2 gap-3">
              {layoutPresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handleLayoutChange(preset.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    customStyles?.layout === preset.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Layout className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
