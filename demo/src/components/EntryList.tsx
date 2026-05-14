"use client";

import { WorkloadEntry, CATEGORY_LABELS, CATEGORY_COLORS, WorkCategory } from "@/lib/types";

interface EntryListProps {
  entries: WorkloadEntry[];
}

export default function EntryList({ entries }: EntryListProps) {
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (sortedEntries.length === 0) {
    return (
      <div className="text-center py-8 text-sm" style={{ color: "var(--text-muted)" }}>
        No entries for this period
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sortedEntries.map((entry) => (
        <div
          key={entry.id}
          className="flex items-center gap-3 p-3 rounded-lg transition-colors"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          {/* Category dot */}
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: CATEGORY_COLORS[entry.category as WorkCategory] }}
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {CATEGORY_LABELS[entry.category as WorkCategory]}
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {entry.hours}h
              </span>
            </div>
            {entry.description && (
              <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                {entry.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
