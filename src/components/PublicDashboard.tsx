"use client";

import { useState } from "react";
import { WorkloadEntry } from "@/lib/types";
import CapacityMeter from "@/components/CapacityMeter";
import WorkloadChart from "@/components/WorkloadChart";
import TrendChart from "@/components/TrendChart";
import WeeklyBarChart from "@/components/WeeklyBarChart";
import ProductivityNote from "@/components/ProductivityNote";
import EntryList from "@/components/EntryList";

type ViewMode = "daily" | "weekly";

interface PublicDashboardProps {
  user: {
    name: string | null;
    image: string | null;
    username: string;
    maxHours: number;
    warningThreshold: number;
  };
  entries: WorkloadEntry[];
}

export default function PublicDashboard({ user, entries }: PublicDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("daily");

  const today = new Date().toISOString().split("T")[0];
  const todayEntries = entries.filter((e) => e.date === today);
  const todayHours = todayEntries.reduce((sum, e) => sum + e.hours, 0);
  const displayEntries = viewMode === "daily" ? todayEntries : entries;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 border-b backdrop-blur-md"
        style={{
          backgroundColor: "rgba(26, 26, 46, 0.85)",
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user.image && (
                <img
                  src={user.image}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div>
                <h1 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                  {user.name || user.username}&apos;s Workload
                </h1>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {new Date(today).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* View toggle */}
            <div
              className="flex rounded-lg p-0.5"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <button
                onClick={() => setViewMode("daily")}
                className="px-3 py-1.5 text-xs font-medium rounded-md transition-all"
                style={{
                  backgroundColor: viewMode === "daily" ? "var(--accent-button)" : "transparent",
                  color: viewMode === "daily" ? "#fff" : "var(--text-muted)",
                }}
              >
                Today
              </button>
              <button
                onClick={() => setViewMode("weekly")}
                className="px-3 py-1.5 text-xs font-medium rounded-md transition-all"
                style={{
                  backgroundColor: viewMode === "weekly" ? "var(--accent-button)" : "transparent",
                  color: viewMode === "weekly" ? "#fff" : "var(--text-muted)",
                }}
              >
                This Week
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {entries.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">📊</p>
            <h2 className="text-lg font-medium mb-2" style={{ color: "var(--text-primary)" }}>
              No workload data this week
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {user.name || user.username} hasn&apos;t logged any work entries recently.
            </p>
          </div>
        ) : (
          <>
            {/* Productivity assessment */}
            <div className="mb-6">
              <ProductivityNote entries={todayEntries} maxHours={user.maxHours} />
            </div>

            {/* Top row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div
                className="rounded-xl p-5 border"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                <CapacityMeter
                  hoursUsed={todayHours}
                  maxHours={user.maxHours}
                  warningThreshold={user.warningThreshold}
                />
              </div>

              <div
                className="rounded-xl p-5 border"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                <WorkloadChart
                  entries={displayEntries}
                  title={viewMode === "daily" ? "Today's Breakdown" : "Weekly Breakdown"}
                />
              </div>

              <div
                className="rounded-xl p-5 border md:col-span-2 lg:col-span-1"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                <WeeklyBarChart entries={entries} maxHours={user.maxHours} />
              </div>
            </div>

            {/* Trend chart */}
            <div
              className="rounded-xl p-5 border mb-6"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <TrendChart entries={entries} />
            </div>

            {/* Entry list */}
            <div
              className="rounded-xl p-5 border"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  {viewMode === "daily" ? "Today's Log" : "This Week's Log"}
                </h3>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {displayEntries.length} {displayEntries.length === 1 ? "entry" : "entries"}
                </span>
              </div>
              <EntryList entries={displayEntries} />
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-4 mt-8" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
            Workload Tracker · Built for visibility and balance
          </p>
        </div>
      </footer>
    </div>
  );
}
