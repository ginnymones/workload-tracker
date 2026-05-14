import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_CATEGORIES = [
  "deep-work",
  "meetings",
  "code-review",
  "planning",
  "admin",
  "mentoring",
  "learning",
  "other",
];

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const where: { userId: string; date?: { gte: string; lte: string } } = {
    userId: session.user.id,
  };

  if (startDate && endDate) {
    where.date = { gte: startDate, lte: endDate };
  }

  const entries = await prisma.workloadEntry.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(entries);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { date, category, hours, description } = body;

    // Validation
    if (!date || !category || hours === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: date, category, hours" },
        { status: 400 }
      );
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }

    const numHours = parseFloat(hours);
    if (isNaN(numHours) || numHours <= 0 || numHours > 24) {
      return NextResponse.json(
        { error: "Hours must be a number between 0 and 24" },
        { status: 400 }
      );
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: "Date must be in YYYY-MM-DD format" },
        { status: 400 }
      );
    }

    const entry = await prisma.workloadEntry.create({
      data: {
        userId: session.user.id,
        date,
        category,
        hours: numHours,
        description: description || null,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing required parameter: id" },
      { status: 400 }
    );
  }

  // Ensure user owns this entry
  const entry = await prisma.workloadEntry.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!entry) {
    return NextResponse.json(
      { error: "Entry not found" },
      { status: 404 }
    );
  }

  await prisma.workloadEntry.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
