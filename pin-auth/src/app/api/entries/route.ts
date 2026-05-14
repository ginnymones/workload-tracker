import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const VALID_CATEGORIES = ["deep-work","meetings","code-review","planning","admin","mentoring","learning","other"];

export async function GET(request: NextRequest) {
  const workspaceId = await getSession(request);
  if (!workspaceId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const where: { workspaceId: string; date?: { gte: string; lte: string } } = { workspaceId };
  if (startDate && endDate) where.date = { gte: startDate, lte: endDate };

  const entries = await prisma.workloadEntry.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json(entries);
}

export async function POST(request: NextRequest) {
  const workspaceId = await getSession(request);
  if (!workspaceId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { date, category, hours, description } = await request.json();

    if (!date || !category || hours === undefined)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    if (!VALID_CATEGORIES.includes(category))
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });

    const numHours = parseFloat(hours);
    if (isNaN(numHours) || numHours <= 0 || numHours > 24)
      return NextResponse.json({ error: "Hours must be between 0 and 24" }, { status: 400 });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
      return NextResponse.json({ error: "Date must be YYYY-MM-DD" }, { status: 400 });

    const entry = await prisma.workloadEntry.create({
      data: { workspaceId, date, category, hours: numHours, description: description || null },
    });
    return NextResponse.json(entry, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const workspaceId = await getSession(request);
  if (!workspaceId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const entry = await prisma.workloadEntry.findFirst({ where: { id, workspaceId } });
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.workloadEntry.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
