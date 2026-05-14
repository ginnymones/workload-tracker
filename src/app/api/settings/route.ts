import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      maxHours: true,
      warningThreshold: true,
      dashboardPublic: true,
      username: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    capacity: {
      maxHours: user.maxHours,
      warningThreshold: user.warningThreshold,
    },
    dashboardPublic: user.dashboardPublic,
    username: user.username,
  });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { maxHours, warningThreshold, dashboardPublic, username } = body;

    const updateData: Record<string, unknown> = {};

    if (maxHours !== undefined) {
      const numMaxHours = parseFloat(maxHours);
      if (isNaN(numMaxHours) || numMaxHours <= 0 || numMaxHours > 24) {
        return NextResponse.json(
          { error: "maxHours must be between 0 and 24" },
          { status: 400 }
        );
      }
      updateData.maxHours = numMaxHours;
    }

    if (warningThreshold !== undefined) {
      const numThreshold = parseFloat(warningThreshold);
      if (isNaN(numThreshold) || numThreshold <= 0 || numThreshold > 1) {
        return NextResponse.json(
          { error: "warningThreshold must be between 0 and 1" },
          { status: 400 }
        );
      }
      updateData.warningThreshold = numThreshold;
    }

    if (dashboardPublic !== undefined) {
      updateData.dashboardPublic = Boolean(dashboardPublic);
    }

    if (username !== undefined) {
      // Validate username format
      const usernameRegex = /^[a-z0-9_-]{3,30}$/;
      if (!usernameRegex.test(username)) {
        return NextResponse.json(
          { error: "Username must be 3-30 characters, lowercase letters, numbers, hyphens, or underscores" },
          { status: 400 }
        );
      }

      // Check uniqueness
      const existing = await prisma.user.findUnique({ where: { username } });
      if (existing && existing.id !== session.user.id) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 409 }
        );
      }
      updateData.username = username;
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        maxHours: true,
        warningThreshold: true,
        dashboardPublic: true,
        username: true,
      },
    });

    return NextResponse.json({
      capacity: {
        maxHours: user.maxHours,
        warningThreshold: user.warningThreshold,
      },
      dashboardPublic: user.dashboardPublic,
      username: user.username,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
