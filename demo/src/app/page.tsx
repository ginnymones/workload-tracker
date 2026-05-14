"use client";

import { useState } from "react";
import { WorkloadEntry, WorkCategory } from "@/lib/types";
import { StoreProvider, useStore } from "@/lib/store";
import CapacityMeter from "@/components/CapacityMeter";
import WorkloadChart from "@/components/WorkloadChart";
import TrendChart from "@/components/TrendChart";
import WeeklyBarChart from "@/components/WeeklyBarChart";
import ProductivityNote from "@/components/ProductivityNote";
import EntryList from "@/components/EntryList";
import QuickAdd from "@/components/QuickAdd";
import DemoBanner from "@/components/DemoBanner";

type ViewMode = "daily" | "weekly";

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getWeekAgo(): string {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  return d.toISOString().split("T")[0];
}

function DashboardContent() {
  const { entries, capacity, addEntry, deleteEntry } = useStore();
  const [viewMode, setViewMode] = useState<ViewMode>("daily");

  const today = getToday();
  const weekAgo = getWeekAgo();

  const weekEntries = entries.filter((e) => e.date >= weekAgo && e.date <= today);
  const todayEntries = weekEntries.filter((e) => e.date === today);
  const todayHours = todayEntries.reduce((sum, e) => sum + e.hours, 0);
  const displayEntries = viewMode === "daily" ? todayEntries : weekEntries;

  const handleQuickAdd = (entry: { date: string; category: WorkCategory; hours: number; description: string }) => {
    addEntry(entry);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <DemoBanner />

      {/* Header */}
      <header
        className="sticky top-0 z-10 border-b backdrop-blur-md"
        style={{ backgroundColor: "rgba(26, 26, 46, 0.85)", borderColor: "var(--border)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                Workload Tracker
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {new Date(today).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex rounded-lg p-0.5" style={{ backgroundColor: "var(--bg-secondary)" }}>
                <button
                  onClick={() => setViewMode("daily")}
                  className="px-3 py-1.5 text-xs font-medium rounded-md transition-all"
                  style={{ backgroundColor: viewMode === "daily" ? "var(--accent-button)" : "transparent", color: viewMode === "daily" ? "#fff" : "var(--text-muted)" }}
                >
                  Today
                </button>
                <button
                  onClick={() => setViewMode("weekly")}
                  className="px-3 py-1.5 text-xs font-medium rounded-md transition-all"
                  style={{ backgroundColor: viewMode === "weekly" ? "var(--accent-button)" : "transparent", color: viewMode === "weekly" ? "#fff" : "var(--text-muted)" }}
                >
                  This Week
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Productivity assessment */}
        <div className="mb-6">
          <ProductivityNote entries={todayEntries} maxHours={capacity.maxHours} />
        </div>

        {/* Quick add */}
        <div className="mb-6">
          <QuickAdd onAdd={handleQuickAdd} />
        </div>

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl p-5 border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
            <CapacityMeter hoursUsed={todayHours} maxHours={capacity.maxHours} warningThreshold={capacity.warningThreshold} />
          </div>
          <div className="rounded-xl p-5 border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
            <WorkloadChart entries={displayEntries} title={viewMode === "daily" ? "Today's Breakdown" : "Weekly Breakdown"} />
          </div>
          <div className="rounded-xl p-5 border md:col-span-2 lg:col-span-1" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
            <WeeklyBarChart entries={weekEntries} maxHours={capacity.maxHours} />
          </div>
        </div>

        {/* Trend chart */}
        <div className="rounded-xl p-5 border mb-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          <TrendChart entries={weekEntries} />
        </div>

        {/* Entry list */}
        <div className="rounded-xl p-5 border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
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
      </main>

      {/* Footer */}
      <footer className="border-t py-4 mt-8" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
            Workload Tracker Demo · No data is stored · Everything resets on page close
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function DemoPage() {
  return (
    <StoreProvider>
      <DashboardContent />
    </StoreProvider>
  );
}
