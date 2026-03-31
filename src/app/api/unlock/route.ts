import { NextRequest, NextResponse } from "next/server";
import { createUnlockSession, verifyAccess } from "@/lib/mainlayer";

export async function POST(request: NextRequest) {
  let body: { action: string; contentSlug: string; token?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action, contentSlug, token } = body;

  if (!contentSlug || typeof contentSlug !== "string") {
    return NextResponse.json({ error: "contentSlug is required" }, { status: 400 });
  }

  // Sanitize slug to prevent path traversal
  const safeSlug = contentSlug.replace(/[^a-zA-Z0-9-_]/g, "");
  if (safeSlug !== contentSlug) {
    return NextResponse.json({ error: "Invalid contentSlug" }, { status: 400 });
  }

  switch (action) {
    case "create": {
      const result = await createUnlockSession(safeSlug);
      return NextResponse.json(result);
    }

    case "verify": {
      if (!token || typeof token !== "string") {
        return NextResponse.json({ error: "token is required for verify" }, { status: 400 });
      }
      const result = await verifyAccess(token, safeSlug);
      return NextResponse.json(result);
    }

    default:
      return NextResponse.json(
        { error: `Unknown action: ${action}. Supported: create, verify` },
        { status: 400 }
      );
  }
}
