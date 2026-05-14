import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PublicDashboard from "@/components/PublicDashboard";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function PublicDashboardPage({ params }: PageProps) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      image: true,
      username: true,
      dashboardPublic: true,
      maxHours: true,
      warningThreshold: true,
    },
  });

  if (!user) {
    notFound();
  }

  if (!user.dashboardPublic) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div className="text-center">
          <p className="text-4xl mb-4">🔒</p>
          <h1 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            This dashboard is private
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            The owner hasn&apos;t made their workload dashboard public yet.
          </p>
        </div>
      </div>
    );
  }

  // Fetch entries for the past 7 days
  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6);
  const weekAgoStr = weekAgo.toISOString().split("T")[0];

  const entries = await prisma.workloadEntry.findMany({
    where: {
      userId: user.id,
      date: { gte: weekAgoStr, lte: today },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PublicDashboard
      user={{
        name: user.name,
        image: user.image,
        username: user.username!,
        maxHours: user.maxHours,
        warningThreshold: user.warningThreshold,
      }}
      entries={entries.map((e) => ({
        id: e.id,
        date: e.date,
        category: e.category as import("@/lib/types").WorkCategory,
        hours: e.hours,
        description: e.description || undefined,
        createdAt: e.createdAt.toISOString(),
      }))}
    />
  );
}
