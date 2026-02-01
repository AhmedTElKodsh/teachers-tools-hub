import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { getSuggestions, updateSuggestionStatus, addSuggestion, getTools, saveTools, Suggestion, Tool } from "@/lib/data";

async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  return token?.value === 'valid_token';
}

export async function GET() {
  if (!await isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const suggestions = await getSuggestions();
  return NextResponse.json(suggestions);
}

export async function PUT(request: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, status, toolData } = await request.json();
    
    // Update suggestion status
    const suggestion = await updateSuggestionStatus(id, status);
    
    if (status === 'approved' && toolData) {
      // Add to tools if approved
      const tools = await getTools();
      // Check if tool with same ID exists? 
      // toolData.id should be unique.
      
      const newTool: Tool = {
         id: toolData.id || crypto.randomUUID(),
         name: toolData.name,
         description: toolData.description,
         url: toolData.url,
         categories: toolData.categories || [],
         bestFor: toolData.bestFor || "",
         freeTier: toolData.freeTier || "Unknown",
         limitations: toolData.limitations || "",
         pricingModel: toolData.pricingModel,
         // Arabic fields empty by default or copied if provided
         description_ar: toolData.description_ar || toolData.description,
         freeTier_ar: toolData.freeTier_ar || toolData.freeTier,
         limitations_ar: toolData.limitations_ar || "",
      };
      
      tools.push(newTool);
      await saveTools(tools);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
