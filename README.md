# Personal IT Consultant Website

A modern, responsive personal website for an IT consultant built with React, TypeScript, and Tailwind CSS.

## Features

- 🌓 Dark/Light mode support with system preference detection
- 📱 Fully responsive design optimized for all devices
- ⚡ Fast performance with Vite
- 🎨 Beautiful animations and transitions
- 📧 Contact form with validation
- 🔒 Security-focused messaging and expertise
- 📊 Portfolio showcase with detailed project cards
- 📝 Blog section with markdown support
- 🎯 Interactive UI elements
- 🔍 SEO optimized
- 🚀 Progressive Web App (PWA) ready

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed on your system

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The website will open automatically at http://localhost:5173

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

## Project Structure

```
src/
├── components/     # Reusable UI components
├── sections/       # Main page sections
├── styles/         # Global styles and Tailwind config
├── utils/          # Utility functions
└── App.tsx         # Main application component
```

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next-generation build tool
- **Lucide React** - Beautiful icons
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Features in Detail

### Dark/Light Mode
- Automatic system preference detection
- Manual toggle option
- Persistent user preference
- Smooth transitions between modes

### Contact Form
- Form validation
- Success/error notifications
- Spam protection
- Responsive design

### Portfolio
- Project cards with detailed information
- Technology stack tags
- Live demo links
- GitHub repository links

### Blog
- Markdown support
- Syntax highlighting
- Responsive images
- Reading time estimation

## Performance Optimizations

- Code splitting
- Lazy loading of components
- Optimized images
- Minimal bundle size
- Efficient CSS with Tailwind
- TypeScript for better development experience

## Security Features

- Form validation
- XSS protection
- Input sanitization
- Secure headers
- CSP implementation

## Deployment Options

### Vercel (Recommended)
1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Netlify
1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify using their dashboard or CLI

### GitHub Pages
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
- Component-specific styles in respective component files

### Images
Replace the placeholder images with your own:
- Professional headshot
- Portfolio project screenshots
- Blog post images

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - feel free to use this for your own website!

## Support

If you have any questions or need help with deployment, please open an issue in the repository. 