# 🤝 Contributing to Teachers Tools Hub

Thank you for helping us build the best resource for teachers! We welcome contributions to add new verified AI tools or improve existing data.

## 🚀 How to Add a New Tool

All tool data is stored in a simple JSON file. You don't need to be a React expert to contribute data!

### Step 1: Locate the Data File
Open the file: `web/data/tools.json`

### Step 2: Create an Entry
Add a new object to the array using this template:

```json
{
  "id": "tool-name-lowercase",
  "name": "Tool Name",
  "description": "A 1-2 sentence description focusing on value for teachers.",
  "freeTier": "Explicit details (e.g., 'Forever free', '10 credits/month').",
  "limitations": "Critical blockers (e.g., 'Watermark on video', 'No export').",
  "categories": [
    "Lesson Planning", 
    "Visual Content Creation" 
    // Select from existing categories in FilterSidebar.tsx
  ],
  "bestFor": "Specific Task (e.g., 'Rubrics')",
  "url": "https://website.com"
}
```

### Step 3: Guidelines
1.  **Verify Free Tier:** We ONLY accept tools with a usable free tier. "Free trial only" tools are generally rejected unless the trial is substantial (e.g., 1 year).
2.  **Teacher-First Categorization:** Do not use "Chatbot" as a category. Use "General Assistant" or "Lesson Planning".
3.  **Honest Limitations:** Be transparent about paywalls.

### Step 4: Submit
Save the file and submit a Pull Request (or commit the change if you have direct access).

## 🐛 Reporting Bugs
If a link is broken or a "Free" tool has become paid, please open an Issue or contact the maintainers immediately.

---
*Maintained by BMad Master*
