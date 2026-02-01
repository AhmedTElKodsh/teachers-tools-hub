# 🎓 Teachers Tools Hub

A curated platform showcasing **verified, genuinely free AI tools** designed to save educators 7-10 hours weekly. Built specifically for K-12 classrooms with bilingual support (English/Arabic).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AhmedTElKodsh/teachers-tools-hub)

## ✨ Features

- **🔍 Smart Search** - Find tools by name, task, or workflow
- **📊 Category Filtering** - Browse by workflow categories
- **👍 Community Ratings** - Like/dislike system with intelligent sorting
- **🌐 Bilingual Support** - Full English and Arabic localization
- **🎨 Theme Toggle** - Light and dark mode support
- **📱 Responsive Design** - Works seamlessly on all devices
- **⚡ Fast Performance** - Built with Next.js 15 and optimized for speed
- **🛠️ Tool Suggestions** - Community-driven tool recommendations
- **🐛 Issue Reporting** - Easy bug reporting system

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/AhmedTElKodsh/teachers-tools-hub.git
cd teachers-tools-hub
```

2. Navigate to the web directory:

```bash
cd web
```

3. Install dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Project Structure

```
teachers-tools-hub/
├── web/                      # Next.js application
│   ├── app/                  # App router pages
│   │   ├── page.tsx         # Home page
│   │   ├── layout.tsx       # Root layout
│   │   ├── globals.css      # Global styles
│   │   └── api/             # API routes
│   ├── components/          # React components
│   │   ├── ThemeToggle.tsx
│   │   ├── LanguageToggle.tsx
│   │   ├── ToolCard.tsx
│   │   ├── ToolGrid.tsx
│   │   ├── FilterSidebar.tsx
│   │   ├── SuggestToolModal.tsx
│   │   └── ReportIssueModal.tsx
│   ├── contexts/            # React contexts
│   │   ├── ThemeContext.tsx
│   │   └── LanguageContext.tsx
│   ├── data/                # Data files
│   │   ├── tools.json       # Tools database
│   │   ├── categories.json  # Categories
│   │   └── suggestions.json # User suggestions
│   ├── locales/             # Translations
│   │   ├── en.json          # English
│   │   └── ar.json          # Arabic
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utilities
│   └── types/               # TypeScript types
├── vercel.json              # Vercel configuration
└── README.md                # This file
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Deployment**: Vercel
- **State Management**: React Context API
- **Icons**: Heroicons (SVG)

## 📝 Adding New Tools

Tools are stored in `web/data/tools.json`. To add a new tool:

```json
{
  "id": "unique-id",
  "name": "Tool Name",
  "description": "English description",
  "description_ar": "Arabic description",
  "url": "https://tool-url.com",
  "categories": ["Category Name"],
  "freeTier": "Description of free features",
  "freeTier_ar": "Arabic free tier description",
  "limitations": "Any limitations (optional)",
  "limitations_ar": "Arabic limitations (optional)"
}
```

## 🌍 Localization

The app supports English and Arabic. Translation files are located in `web/locales/`:

- `en.json` - English translations
- `ar.json` - Arabic translations

To add a new translation key, add it to both files.

## 🎨 Theming

The app supports light and dark themes using Tailwind CSS dark mode. Theme preference is stored in localStorage.

## 📊 Sorting Options

- **Alphabetical** - Sort tools A-Z
- **Most Liked** - Tools with most likes first
- **Least Disliked** - Tools with fewest dislikes first
- **Best Rated** - Highest like-to-dislike ratio

## 🚀 Deployment

### Deploy to Vercel

The easiest way to deploy is using Vercel:

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Next.js and deploy

Or use the Vercel CLI:

```bash
npm install -g vercel
vercel
```

### Environment Variables

No environment variables are required for basic functionality. All data is stored in JSON files.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built for educators worldwide
- Inspired by the need to save teachers time
- Community-driven tool curation

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for teachers everywhere**
