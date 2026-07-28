import { Search, Globe } from 'lucide-react'

interface SEOSettingsProps {
  data: {
    metaTitle: string
    metaDescription: string
    ogImage: string
  }
  onChange: (data: any) => void
}

export default function SEOSettings({ data, onChange }: SEOSettingsProps) {
  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <Search className="h-6 w-6" />
        SEO Settings
      </h2>
      <p className="text-muted-foreground">
        Optimize your portfolio for search engines and social media sharing.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="metaTitle" className="text-sm font-medium">
            Meta Title
          </label>
          <input
            id="metaTitle"
            type="text"
            value={data.metaTitle}
            onChange={(e) => handleChange('metaTitle', e.target.value)}
            className="w-full px-3 py-2 rounded-md border bg-background"
            placeholder="Your Name - Portfolio"
            maxLength={60}
          />
          <p className="text-xs text-muted-foreground">
            {data.metaTitle.length}/60 characters
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="metaDescription" className="text-sm font-medium">
            Meta Description
          </label>
          <textarea
            id="metaDescription"
            value={data.metaDescription}
            onChange={(e) => handleChange('metaDescription', e.target.value)}
            className="w-full px-3 py-2 rounded-md border bg-background min-h-[100px]"
            placeholder="A brief description of your portfolio for search engines..."
            maxLength={160}
          />
          <p className="text-xs text-muted-foreground">
            {data.metaDescription.length}/160 characters
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="ogImage" className="text-sm font-medium">
            Open Graph Image URL
          </label>
          <div className="flex gap-2">
            <input
              id="ogImage"
              type="url"
              value={data.ogImage}
              onChange={(e) => handleChange('ogImage', e.target.value)}
              className="flex-1 px-3 py-2 rounded-md border bg-background"
              placeholder="https://example.com/og-image.jpg"
            />
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              Optional
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Image shown when your portfolio is shared on social media
          </p>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Preview</h3>
        <div className="bg-white p-4 rounded-lg border max-w-md">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500 truncate">
                portfolioai.com
              </p>
              <p className="text-blue-600 font-medium truncate">
                {data.metaTitle || 'Your Portfolio Title'}
              </p>
              <p className="text-sm text-gray-600 line-clamp-2">
                {data.metaDescription || 'Your portfolio description will appear here...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
