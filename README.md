# Teachers Tools Hub

A Next.js application designed for K-12 educators to discover verified, genuinely free AI tools.

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

## 📂 Project Structure

- `/data`: Contains `tools.json`, the primary database of AI tools.
- `/components`: Modular UI components (`ToolCard`, `FilterSidebar`, `ToolGrid`).
- `/types`: TypeScript interfaces for the application.
- `/app`: Next.js App Router and main page logic.

## 🛠️ Data Management

To add or update tools, modify `data/tools.json`. Every tool follows this structure:

```json
{
  "id": "unique-id",
  "name": "Tool Name",
  "description": "Short description...",
  "freeTier": "What's free...",
  "limitations": "Optional limitations...",
  "categories": ["Category 1", "Category 2"],
  "bestFor": "Target use case",
  "url": "https://link-to-tool.com"
}
```

## 📝 Categories Used
The hub uses a **Workflow-First** taxonomy:
- Lesson Planning
- Student Assessment & Feedback
- Visual Content Creation
- Presentation Tools
- Study & Review
- Video Creation
- General Assistants