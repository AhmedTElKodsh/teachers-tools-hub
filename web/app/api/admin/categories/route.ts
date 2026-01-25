import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const categoriesFile = path.join(dataDir, 'categories.json');
const toolsFile = path.join(dataDir, 'tools.json');

// Helper to read data
async function readData(file: string) {
  try {
    const data = await fs.readFile(file, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${file}:`, error);
    return [];
  }
}

// Helper to write data
async function writeData(file: string, data: any) {
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET() {
  const categories = await readData(categoriesFile);
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  try {
    const { name, name_ar } = await request.json();
    const categories = await readData(categoriesFile);
    
    // Check if exists
    if (categories.some((c: any) => c.name === name)) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
    }

    const newCategory = {
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      name_ar: name_ar || name // Fallback
    };
    
    categories.push(newCategory);
    await writeData(categoriesFile, categories);
    
    return NextResponse.json(newCategory);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, name_ar, newIndex } = await request.json();
    let categories = await readData(categoriesFile);
    
    // Reorder operation
    if (typeof newIndex === 'number') {
      const currentIndex = categories.findIndex((c: any) => c.id === id);
      if (currentIndex === -1) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      
      const [moved] = categories.splice(currentIndex, 1);
      categories.splice(newIndex, 0, moved);
      
      await writeData(categoriesFile, categories);
      return NextResponse.json(categories);
    }

    // Rename/Update operation
    const categoryIndex = categories.findIndex((c: any) => c.id === id);
    if (categoryIndex === -1) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

    const oldName = categories[categoryIndex].name;
    
    // Update category
    categories[categoryIndex] = { 
        ...categories[categoryIndex], 
        name: name || oldName, 
        name_ar: name_ar || categories[categoryIndex].name_ar 
    };
    
    await writeData(categoriesFile, categories);

    // Update tools if name changed
    if (name && oldName !== name) {
      const tools = await readData(toolsFile);
      let toolsChanged = false;
      const updatedTools = tools.map((tool: any) => {
          if (tool.categories && tool.categories.includes(oldName)) {
              toolsChanged = true;
              return {
                  ...tool,
                  categories: tool.categories.map((c: string) => c === oldName ? name : c)
              };
          }
          return tool;
      });
      
      if (toolsChanged) {
          await writeData(toolsFile, updatedTools);
      }
    }

    return NextResponse.json(categories[categoryIndex]);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    let categories = await readData(categoriesFile);
    const categoryToRemove = categories.find((c: any) => c.id === id);
    
    if (!categoryToRemove) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    categories = categories.filter((c: any) => c.id !== id);
    await writeData(categoriesFile, categories);

    // Remove from tools
    const tools = await readData(toolsFile);
    const updatedTools = tools.map((tool: any) => ({
      ...tool,
      categories: tool.categories ? tool.categories.filter((c: string) => c !== categoryToRemove.name) : []
    }));
    await writeData(toolsFile, updatedTools);

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
