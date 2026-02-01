import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { issueType, toolName, description, email } = body;

    // Validate required fields
    if (!issueType || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // TODO: Implement your preferred submission method:
    // Option 1: Send email using a service like SendGrid, Resend, or Nodemailer
    // Option 2: Save to a database
    // Option 3: Create a GitHub issue programmatically
    // Option 4: Send to a webhook/Discord/Slack

    // For now, just log it (replace with actual implementation)
    console.log("Issue Report Received:", {
      issueType,
      toolName,
      description,
      email,
      timestamp: new Date().toISOString(),
    });

    // Example: Send email using a service (uncomment and configure)
    /*
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "noreply@yourdomain.com",
        to: "your-email@example.com",
        subject: `Issue Report: ${issueType}`,
        html: `
          <h2>New Issue Report</h2>
          <p><strong>Issue Type:</strong> ${issueType}</p>
          <p><strong>Tool Name:</strong> ${toolName || "N/A"}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Reported by:</strong> ${email || "Anonymous"}</p>
        `,
      }),
    });
    */

    return NextResponse.json(
      { message: "Report received successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
