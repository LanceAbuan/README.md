import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message, honeypot } = body as {
      name: string;
      email: string;
      message: string;
      honeypot?: string;
    };

    // Honeypot spam check
    if (honeypot) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message is too long (max 2000 characters)" },
        { status: 400 },
      );
    }

    // TODO: Replace with actual email provider (Resend, SendGrid, etc.)
    // For now, log the message.
    console.log("[Contact Form]", { name, email, message });

    return NextResponse.json(
      { success: true, message: "Message received" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
