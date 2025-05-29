# Personal IT Consultant Website

A modern, responsive personal website for an IT consultant built with React, TypeScript, and Tailwind CSS.

## Features

- 🌓 Dark/Light mode support
- 📱 Fully responsive design
- ⚡ Fast performance with Vite
- 🎨 Beautiful animations and transitions
- 📧 Contact form
- 🔒 Security-focused messaging
- 📊 Portfolio showcase
- 📝 Blog section

## Getting Started

### Prerequisites

- Node.js 16+ and npm installed on your system

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The website will open automatically at http://localhost:3000

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` folder.

To preview the production build locally:

```bash
npm run preview
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

Follow the prompts. Your site will be live in minutes!

### Option 2: Netlify

1. Build the project:
```bash
npm run build
```

2. Drag and drop the `dist` folder to [Netlify](https://app.netlify.com/drop)

### Option 3: GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json scripts:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

3. Deploy:
```bash
npm run deploy
```

### Option 4: Traditional Hosting

1. Build the project:
```bash
npm run build
```

2. Upload the contents of the `dist` folder to your web hosting service

## Customization

### Personal Information

Edit `src/App.tsx` to update:
- Name and title
- Contact information
- Social media links
- Portfolio projects
- Blog posts
- Skills and certifications

### Styling

- Colors and theme can be modified in `tailwind.config.js`
- Custom CSS can be added to `src/index.css`

### Images

Replace the placeholder images with your own:
- Professional headshot
- Portfolio project screenshots

## Technology Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Lucide React** - Icons

## Performance

The site is optimized for performance with:
- Code splitting
- Lazy loading
- Optimized images
- Minimal bundle size

## Security

- Form validation
- XSS protection
- Input sanitization

## License

MIT License - feel free to use this for your own website!

## Support

If you have any questions or need help with deployment, please open an issue in the repository. 