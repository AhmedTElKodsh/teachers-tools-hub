import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { getTools, saveTools, Tool } from "@/lib/data";

async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  return token?.value === 'valid_token';
}

export async function GET() {
  // Public access to tools list via this API? Maybe strictly for admin. 
  // The public usually gets it via static import or other API.
  // We'll protect this one.
  if (!await isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const tools = await getTools();
  return NextResponse.json(tools);
}

export async function POST(request: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const toolData = await request.json();
    const tools = await getTools();
    
    if (toolData.id) {
       // Update existing
       const index = tools.findIndex((t: Tool) => t.id === toolData.id);
       if (index !== -1) {
         tools[index] = { ...tools[index], ...toolData };
       } else {
         tools.push(toolData);
       }
    } else {
       // Create new
       toolData.id = crypto.randomUUID();
       tools.push(toolData);
    }
    
    await saveTools(tools);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await request.json();
    let tools = await getTools();
    tools = tools.filter((t: Tool) => t.id !== id);
    await saveTools(tools);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting" }, { status: 500 });
  }
}
