import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

/** Module-scoped Resend singleton — avoids re-instantiating per request. */
const resend = new Resend(process.env.RESEND_API_KEY);

/** Simple token-bucket rate limiter keyed by IP (memory-based, not cross-instance). */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

/** Basic email format validation (server-side). */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting by IP (NextRequest has no .ip — use headers only)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM ?? "lance@lanceabuan.tech",
      to: [process.env.RESEND_TO ?? "assistant@lanceabuan.tech"],
      subject: `Portfolio contact from ${name}`,
      text: `${message}\n\n— ${name} (${email})`,
      replyTo: email,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message. Try again later." },
      { status: 500 }
    );
  }
}
