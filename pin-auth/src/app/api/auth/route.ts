import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, clearSession, getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { username, pin } = await request.json();

    if (!username || !pin) {
      return NextResponse.json({ error: "Username and PIN are required" }, { status: 400 });
    }

    const workspace = await prisma.workspace.findUnique({ where: { username } });
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    // Check if locked
    if (workspace.lockedUntil && workspace.lockedUntil > new Date()) {
      const mins = Math.ceil((workspace.lockedUntil.getTime() - Date.now()) / 60000);
      return NextResponse.json({ error: `Too many attempts. Try again in ${mins} minutes.` }, { status: 429 });
    }

    const valid = await bcrypt.compare(pin, workspace.pinHash);

    if (!valid) {
      const attempts = workspace.failedAttempts + 1;
      const update: { failedAttempts: number; lockedUntil?: Date } = { failedAttempts: attempts };

      if (attempts >= 5) {
        update.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lock
      }

      await prisma.workspace.update({ where: { id: workspace.id }, data: update });
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }

    // Reset failed attempts on success
    await prisma.workspace.update({
      where: { id: workspace.id },
      data: { failedAttempts: 0, lockedUntil: null },
    });

    await createSession(workspace.id);
    return NextResponse.json({ username: workspace.username });
  } catch {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

export async function GET() {
  const workspaceId = await getSession();
  if (!workspaceId) {
    return NextResponse.json({ authenticated: false });
  }

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { username: true },
  });

  if (!workspace) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({ authenticated: true, username: workspace.username });
}

export async function DELETE() {
  await clearSession();
  return NextResponse.json({ success: true });
}
