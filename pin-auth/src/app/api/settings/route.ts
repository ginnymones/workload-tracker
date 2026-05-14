import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const workspaceId = await getSession(request);
  if (!workspaceId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ws = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { username: true, maxHours: true, warningThreshold: true, dashboardPublic: true },
  });
  if (!ws) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    username: ws.username,
    capacity: { maxHours: ws.maxHours, warningThreshold: ws.warningThreshold },
    dashboardPublic: ws.dashboardPublic,
  });
}

export async function PUT(request: NextRequest) {
  const workspaceId = await getSession(request);
  if (!workspaceId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const update: Record<string, unknown> = {};

    if (body.maxHours !== undefined) {
      const v = parseFloat(body.maxHours);
      if (isNaN(v) || v <= 0 || v > 24) return NextResponse.json({ error: "Invalid maxHours" }, { status: 400 });
      update.maxHours = v;
    }
    if (body.warningThreshold !== undefined) {
      const v = parseFloat(body.warningThreshold);
      if (isNaN(v) || v <= 0 || v > 1) return NextResponse.json({ error: "Invalid threshold" }, { status: 400 });
      update.warningThreshold = v;
    }
    if (body.dashboardPublic !== undefined) {
      update.dashboardPublic = Boolean(body.dashboardPublic);
    }

    const ws = await prisma.workspace.update({ where: { id: workspaceId }, data: update });
    return NextResponse.json({
      username: ws.username,
      capacity: { maxHours: ws.maxHours, warningThreshold: ws.warningThreshold },
      dashboardPublic: ws.dashboardPublic,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
