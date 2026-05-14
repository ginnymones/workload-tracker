import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { username, pin } = await request.json();

    if (!username || !pin) {
      return NextResponse.json({ error: "Username and PIN are required" }, { status: 400 });
    }

    const usernameRegex = /^[a-z0-9_-]{3,30}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json({ error: "Username must be 3-30 chars: lowercase, numbers, hyphens, underscores" }, { status: 400 });
    }

    if (!/^\d{4,6}$/.test(pin)) {
      return NextResponse.json({ error: "PIN must be 4-6 digits" }, { status: 400 });
    }

    const existing = await prisma.workspace.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }

    const pinHash = await bcrypt.hash(pin, 12);
    const workspace = await prisma.workspace.create({
      data: { username, pinHash },
    });

    await createSession(workspace.id);

    return NextResponse.json({ username: workspace.username }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create workspace" }, { status: 500 });
  }
}
