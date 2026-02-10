import { NextRequest, NextResponse } from "next/server";
import { addSuggestion, Suggestion } from "@/lib/data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      toolName, 
      toolUrl, 
      category, 
      description, 
      pricingModel, 
      hasFreeTier, 
      additionalInfo, 
      email 
    } = body;

    // Validate required fields
    if (!toolName || !toolUrl || !category || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newSuggestion: Suggestion = {
      id: crypto.randomUUID(),
      toolName,
      toolUrl,
      category,
      description,
      pricingModel: pricingModel || "Unknown",
      hasFreeTier: hasFreeTier || "Unknown",
      additionalInfo,
      email,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await addSuggestion(newSuggestion);

    return NextResponse.json(
      { message: "Suggestion received successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing suggestion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
