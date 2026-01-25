# Teachers Tools Hub 🎓

A bilingual (English/Arabic) web application showcasing 25+ verified, genuinely free AI tools designed to save K-12 educators 7-10 hours weekly.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AhmedTElKodsh/teachers-tools-hub)

## ✨ Features

- 🌍 **Bilingual Support**: Full English and Arabic translations with RTL layout
- 🎨 **Modern UI**: Gradient color palette with smooth animations
- 🌓 **Dark/Light Mode**: Theme toggle with system preference detection
- 📱 **Fully Responsive**: Optimized for mobile, tablet, and desktop
- ⚡ **Fast Performance**: Built with Next.js 16 and Turbopack
- 🔍 **Search & Filter**: Find tools by name, category, or workflow
- 🎯 **25+ AI Tools**: Curated collection for lesson planning, assessment, content creation, and more

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/AhmedTElKodsh/teachers-tools-hub.git

# Navigate to the web directory
cd teachers-tools-hub/web

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
web/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles
│   ├── error.tsx          # Error boundary
│   ├── loading.tsx        # Loading state
│   └── not-found.tsx      # 404 page
├── components/            # React components
│   ├── ClientProviders.tsx
│   ├── FilterSidebar.tsx
│   ├── LanguageToggle.tsx
│   ├── ThemeToggle.tsx
│   ├── ToolCard.tsx
│   └── ToolGrid.tsx
├── contexts/              # React contexts
│   ├── LanguageContext.tsx
│   └── ThemeContext.tsx
├── data/                  # Application data
│   └── tools.json         # 25 AI tools with translations
├── locales/               # Translation files
│   ├── en.json
│   └── ar.json
├── public/                # Static assets
└── types/                 # TypeScript types
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.4
- **React**: 19.2.3
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4
- **Fonts**: Google Fonts (Inter, Cairo)
- **Deployment**: Vercel

## 🌐 Deployment

### Deploy to Vercel (Recommended)

Click the button below to deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AhmedTElKodsh/teachers-tools-hub)

Or manually:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd web
vercel --prod
```

### Configuration

- **Root Directory**: `web`
- **Framework**: Next.js (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

## 🎨 Features in Detail

### Bilingual Support

- Complete English and Arabic translations
- RTL (Right-to-Left) layout for Arabic
- English tool names remain LTR in Arabic layout
- Translated descriptions, categories, and UI elements

### Tool Categories

- General Assistants (ChatGPT, Gemini, Perplexity, etc.)
- Lesson Planning (MagicSchool AI, Curipod, Diffit, etc.)
- Presentation Tools (Canva, Gamma, Beautiful.ai, etc.)
- Student Assessment (Formative, Gradescope, Writable)
- Study & Review (Quizlet, Quizizz, Knowt)
- Video Creation (Fliki, InVideo, Synthesia)
- Visual Content (DALL-E, Midjourney)

### Each Tool Includes

- Name and description
- Free tier information
- Limitations (if any)
- Direct link to the tool
- Category classification

## 📝 Adding New Tools

Edit `web/data/tools.json`:

```json
{
  "id": "tool-id",
  "name": "Tool Name",
  "description": "English description",
  "description_ar": "Arabic description",
  "freeTier": "Free tier info",
  "freeTier_ar": "معلومات المستوى المجاني",
  "limitations": "Any limitations",
  "limitations_ar": "أي قيود",
  "categories": ["Category Name"],
  "bestFor": "Best use case",
  "url": "https://tool-url.com"
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- All the amazing AI tool creators
- The Next.js and React teams
- The open-source community

## 📧 Contact

Ahmed Tawfik - [@AhmedTElKodsh](https://github.com/AhmedTElKodsh)

Project Link: [https://github.com/AhmedTElKodsh/teachers-tools-hub](https://github.com/AhmedTElKodsh/teachers-tools-hub)

---

**Built with ❤️ for educators worldwide**
