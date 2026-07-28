# PortfolioAI - Version 1

An AI-powered portfolio builder for developers, freelancers, and students.

## Version 1 Features

This is the initial version focusing on frontend architecture and user flow without AI features.

- **Multi-step portfolio creation wizard** with progress tracking
- **Personal information form** with profile image upload
- **Skills management** with categories and proficiency levels
- **Project showcase** with technologies, GitHub links, and live demos
- **3 beautiful portfolio templates:**
  - Modern Developer: Clean and contemporary with bold typography
  - Minimal Professional: Simple and elegant with lots of white space
  - Creative Portfolio: Bold and artistic with unique layouts
- **Live portfolio preview** with real-time rendering
- **localStorage persistence** - your data is saved automatically
- **Dark mode support** with toggle switch
- **Responsive design** for all screen sizes
- **Enhanced landing page** with How it Works section and template previews

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS with shadcn/ui design tokens
- **Icons:** Lucide React
- **Routing:** React Router DOM
- **State Management:** React hooks with localStorage persistence
- **Utilities:** clsx, tailwind-merge

## Project Structure

```
portfolioai/
├── src/
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── PersonalInfoForm.tsx
│   │   ├── SkillsForm.tsx
│   │   ├── ProjectsForm.tsx
│   │   ├── TemplateSelector.tsx
│   │   └── templates/
│   │       ├── ModernTemplate.tsx
│   │       ├── MinimalTemplate.tsx
│   │       └── CreativeTemplate.tsx
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   └── useDarkMode.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── CreatePortfolio.tsx
│   │   └── PreviewPortfolio.tsx
│   ├── types/
│   │   └── portfolio.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── index.html
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Home Page:** View features, how it works, and template previews
2. **Personal Info:** Enter your name, upload profile image, email, location, title, bio, and social links
3. **Skills:** Add your technical skills with categories and proficiency levels
4. **Projects:** Add your projects with descriptions, technologies, GitHub links, and live demos
5. **Template:** Choose from 3 beautiful portfolio templates
6. **Preview:** View your portfolio with the selected template
7. **Dark Mode:** Toggle dark/light mode using the button in the header

## Features

### localStorage Persistence
All your portfolio data is automatically saved to localStorage as you fill out the forms. If you refresh the page or close and reopen it, your data will be preserved.

### Profile Image Upload
Upload a profile picture that will be displayed in your portfolio. Supports common image formats (JPG, PNG, GIF, WebP).

### Dark Mode
Toggle between light and dark mode using the moon/sun icon in the header. Your preference is saved and remembered.

### Responsive Design
The application and all portfolio templates are fully responsive and work beautifully on desktop, tablet, and mobile devices.

## Data Structure

### PersonalInfo
```typescript
{
  fullName: string
  email: string
  phone?: string
  location: string
  title: string
  bio: string
  avatar?: string  // Base64 encoded image
  linkedin?: string
  github?: string
  twitter?: string
}
```

### Skill
```typescript
{
  id: string
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  category: string
}
```

### Project
```typescript
{
  id: string
  title: string
  description: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  imageUrl?: string
  startDate: string
  endDate?: string
}
```

## Future Versions

- **Version 2:** Authentication and database integration with Supabase
- **Version 3:** AI content generation for portfolio descriptions
- **Version 4:** Portfolio customization and publishing features
- **Version 5:** SaaS features including payments, subscriptions, analytics, and premium templates

## Development Notes

- The project uses React Router for client-side routing
- State is managed through React hooks with localStorage persistence
- Custom hooks `useLocalStorage` and `useDarkMode` for reusable logic
- Templates are designed to be easily extensible
- All forms include validation for required fields
- The application is fully responsive
- Dark mode is implemented using Tailwind's dark mode variant
- Profile images are stored as base64 strings in localStorage

## License

MIT
