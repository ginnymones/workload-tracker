"use client";

import { WorkloadEntry, CATEGORY_LABELS } from "@/lib/types";

interface ProductivityNoteProps {
  entries: WorkloadEntry[];
  maxHours: number;
}

interface Assessment {
  message: string;
  type: "positive" | "neutral" | "warning";
  icon: string;
  tip?: string;
}

export default function ProductivityNote({ entries, maxHours }: ProductivityNoteProps) {
  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);

  // Calculate category breakdown
  const categoryHours: Record<string, number> = {};
  entries.forEach((e) => {
    categoryHours[e.category] = (categoryHours[e.category] || 0) + e.hours;
  });

  const deepWorkHours = categoryHours["deep-work"] || 0;
  const meetingHours = categoryHours["meetings"] || 0;
  const adminHours = categoryHours["admin"] || 0;
  const learningHours = categoryHours["learning"] || 0;
  const mentoringHours = categoryHours["mentoring"] || 0;

  const deepWorkPercentage = totalHours > 0 ? (deepWorkHours / totalHours) * 100 : 0;
  const meetingPercentage = totalHours > 0 ? (meetingHours / totalHours) * 100 : 0;
  const adminPercentage = totalHours > 0 ? (adminHours / totalHours) * 100 : 0;
  const capacityUsed = totalHours / maxHours;
  const uniqueCategories = Object.keys(categoryHours).length;

  const getAssessment = (): Assessment => {
    if (totalHours === 0) {
      return {
        message: "No entries logged yet today. Ready to start tracking?",
        type: "neutral",
        icon: "📝",
      };
    }

    // Over capacity — top priority warning
    if (totalHours > maxHours) {
      return {
        message: `You've logged ${totalHours.toFixed(1)}h — that's over your ${maxHours}h capacity. Time to wind down.`,
        type: "warning",
        icon: "⚡",
        tip: "Consider what you can delegate or defer tomorrow to recover.",
      };
    }

    // Heavy meeting day
    if (meetingPercentage >= 50) {
      return {
        message: `Meetings took ${meetingHours.toFixed(1)}h (${meetingPercentage.toFixed(0)}%) of your day.`,
        type: "warning",
        icon: "💡",
        tip: "Try to protect a 2-hour focus block tomorrow morning.",
      };
    }

    // Too much context switching (many small categories)
    if (uniqueCategories >= 5 && totalHours >= 4) {
      return {
        message: `You've touched ${uniqueCategories} different work types today — that's a lot of context switching.`,
        type: "warning",
        icon: "🔀",
        tip: "Consider batching similar tasks together to reduce mental overhead.",
      };
    }

    // Admin-heavy day
    if (adminPercentage >= 40) {
      return {
        message: `Admin work took ${adminHours.toFixed(1)}h today. Sometimes necessary, but watch the trend.`,
        type: "neutral",
        icon: "📋",
        tip: "Can any recurring admin tasks be automated or batched weekly?",
      };
    }

    // Great deep work day
    if (deepWorkPercentage >= 50) {
      return {
        message: `${deepWorkPercentage.toFixed(0)}% deep work today — solid focus session.`,
        type: "positive",
        icon: "🎯",
        tip: deepWorkHours >= 4
          ? "Excellent sustained focus. Make sure to take breaks."
          : undefined,
      };
    }

    // Good balance with learning/mentoring
    if (learningHours + mentoringHours >= 1.5) {
      return {
        message: `You invested ${(learningHours + mentoringHours).toFixed(1)}h in growth today (learning + mentoring).`,
        type: "positive",
        icon: "🌱",
        tip: "Investing in yourself and others pays compound returns.",
      };
    }

    // Nearing capacity
    if (capacityUsed >= 0.85) {
      return {
        message: `${(capacityUsed * 100).toFixed(0)}% capacity used. Almost at your limit for today.`,
        type: "neutral",
        icon: "📊",
        tip: "Wrap up what you can and save non-urgent items for tomorrow.",
      };
    }

    // Balanced day — default
    const topCategory = Object.entries(categoryHours).sort(([, a], [, b]) => b - a)[0];
    const topLabel = CATEGORY_LABELS[topCategory[0] as keyof typeof CATEGORY_LABELS] || topCategory[0];
    return {
      message: `Balanced day so far. Most time in ${topLabel} (${topCategory[1].toFixed(1)}h).`,
      type: "neutral",
      icon: "✨",
    };
  };

  const assessment = getAssessment();

  const bgColor = {
    positive: "rgba(52, 211, 153, 0.08)",
    neutral: "rgba(129, 140, 248, 0.08)",
    warning: "rgba(251, 191, 36, 0.08)",
  }[assessment.type];

  const borderColor = {
    positive: "rgba(52, 211, 153, 0.2)",
    neutral: "rgba(129, 140, 248, 0.2)",
    warning: "rgba(251, 191, 36, 0.2)",
  }[assessment.type];

  return (
    <div
      className="rounded-xl p-4 border"
      style={{ backgroundColor: bgColor, borderColor }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden="true">{assessment.icon}</span>
        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {assessment.message}
          </p>
          {assessment.tip && (
            <p className="text-xs mt-1.5" style={{ color: "var(--text-secondary)" }}>
              {assessment.tip}
            </p>
          )}
          {totalHours > 0 && (
            <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
              {entries.length} {entries.length === 1 ? "entry" : "entries"} logged · {totalHours.toFixed(1)}h total
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
