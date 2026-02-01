import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
export const TOOLS_FILE = path.join(DATA_DIR, 'tools.json');
export const SUGGESTIONS_FILE = path.join(DATA_DIR, 'suggestions.json');

export interface Tool {
  id: string;
  name: string;
  description: string;
  description_ar?: string;
  freeTier: string;
  freeTier_ar?: string;
  limitations?: string;
  limitations_ar?: string;
  categories: string[];
  bestFor: string;
  url: string;
  pricingModel?: string;
  email?: string;
}

export interface Suggestion {
  id: string;
  toolName: string;
  toolUrl: string;
  category: string;
  description: string;
  pricingModel: string;
  hasFreeTier: string;
  additionalInfo?: string;
  email?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export async function getTools(): Promise<Tool[]> {
  try {
    const data = await fs.readFile(TOOLS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading tools.json:", error);
    return [];
  }
}

export async function saveTools(tools: Tool[]) {
  await fs.writeFile(TOOLS_FILE, JSON.stringify(tools, null, 2));
}

export async function getSuggestions(): Promise<Suggestion[]> {
  try {
    const data = await fs.readFile(SUGGESTIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

export async function saveSuggestions(suggestions: Suggestion[]) {
  await fs.writeFile(SUGGESTIONS_FILE, JSON.stringify(suggestions, null, 2));
}

export async function addSuggestion(suggestion: Suggestion) {
  const suggestions = await getSuggestions();
  suggestions.push(suggestion);
  await saveSuggestions(suggestions);
}

export async function updateSuggestionStatus(id: string, status: 'approved' | 'rejected') {
  const suggestions = await getSuggestions();
  const index = suggestions.findIndex(s => s.id === id);
  if (index !== -1) {
    suggestions[index].status = status;
    await saveSuggestions(suggestions);
    return suggestions[index];
  }
  return null;
}
