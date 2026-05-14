"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { WorkloadEntry, DailyCapacity, WorkCategory } from "@/lib/types";
import CapacityMeter from "@/components/CapacityMeter";
import WorkloadChart from "@/components/WorkloadChart";
import TrendChart from "@/components/TrendChart";
import WeeklyBarChart from "@/components/WeeklyBarChart";
import ProductivityNote from "@/components/ProductivityNote";
import EntryList from "@/components/EntryList";
import QuickAdd from "@/components/QuickAdd";

type ViewMode = "daily" | "weekly";

export default function WorkspaceDashboard() {
  const params = useParams();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("daily");
  const [entries, setEntries] = useState<WorkloadEntry[]>([]);
  const [capacity, setCapacity] = useState<DailyCapacity>({ maxHours: 8, warningThreshold: 0.85 });
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const weekAgo = (() => { const d = new Date(); d.setDate(d.getDate() - 6); return d.toISOString().split("T")[0]; })();

  const fetchData = useCallback(async () => {
    try {
      const [entriesRes, settingsRes] = await Promise.all([
        fetch(`/api/entries?startDate=${weekAgo}&endDate=${today}`),
        fetch("/api/settings"),
      ]);
      if (entriesRes.ok) setEntries(await entriesRes.json());
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setCapacity(data.capacity);
      }
      setAuthenticated(true);
    } catch {
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [today, weekAgo]);

  useEffect(() => {
    fetch("/api/auth").then(r => r.json()).then(data => {
      if (data.authenticated && data.username === params.username) {
        fetchData();
      } else {
        setLoading(false);
        setAuthenticated(false);
      }
    }).catch(() => { setLoading(false); setAuthenticated(false); });
  }, [params.username, fetchData]);

  const handleQuickAdd = async (entry: { date: string; category: WorkCategory; hours: number; description: string }) => {
    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    if (res.ok) fetchData();
  };

  const handleSignOut = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/");
  };

  const todayEntries = entries.filter((e) => e.date === today);
  const todayHours = todayEntries.reduce((sum, e) => sum + e.hours, 0);
  const displayEntries = viewMode === "daily" ? todayEntries : entries;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-primary)" }}>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="text-center">
          <p className="text-4xl mb-4">🔒</p>
          <h1 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Access Required</h1>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>Enter your PIN to view this workspace.</p>
          <a href="/" className="text-sm font-medium px-4 py-2 rounded-lg" style={{ backgroundColor: "var(--accent-button)", color: "#fff" }}>Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <header className="sticky top-0 z-10 border-b backdrop-blur-md" style={{ backgroundColor: "rgba(26, 26, 46, 0.85)", borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Workload Tracker</h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {new Date(today).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex rounded-lg p-0.5" style={{ backgroundColor: "var(--bg-secondary)" }}>
                <button onClick={() => setViewMode("daily")} className="px-3 py-1.5 text-xs font-medium rounded-md transition-all" style={{ backgroundColor: viewMode === "daily" ? "var(--accent-button)" : "transparent", color: viewMode === "daily" ? "#fff" : "var(--text-muted)" }}>Today</button>
                <button onClick={() => setViewMode("weekly")} className="px-3 py-1.5 text-xs font-medium rounded-md transition-all" style={{ backgroundColor: viewMode === "weekly" ? "var(--accent-button)" : "transparent", color: viewMode === "weekly" ? "#fff" : "var(--text-muted)" }}>This Week</button>
              </div>
              <button onClick={handleSignOut} className="text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>Sign Out</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {entries.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">📊</p>
            <h2 className="text-lg font-medium mb-2" style={{ color: "var(--text-primary)" }}>No workload data yet</h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Use Quick Add below to start logging.</p>
            <QuickAdd onAdd={handleQuickAdd} />
          </div>
        ) : (
          <>
            <div className="mb-6"><ProductivityNote entries={todayEntries} maxHours={capacity.maxHours} /></div>
            <div className="mb-6"><QuickAdd onAdd={handleQuickAdd} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl p-5 border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
                <CapacityMeter hoursUsed={todayHours} maxHours={capacity.maxHours} warningThreshold={capacity.warningThreshold} />
              </div>
              <div className="rounded-xl p-5 border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
                <WorkloadChart entries={displayEntries} title={viewMode === "daily" ? "Today's Breakdown" : "Weekly Breakdown"} />
              </div>
              <div className="rounded-xl p-5 border md:col-span-2 lg:col-span-1" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
                <WeeklyBarChart entries={entries} maxHours={capacity.maxHours} />
              </div>
            </div>
            <div className="rounded-xl p-5 border mb-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
              <TrendChart entries={entries} />
            </div>
            <div className="rounded-xl p-5 border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{viewMode === "daily" ? "Today's Log" : "This Week's Log"}</h3>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{displayEntries.length} entries</span>
              </div>
              <EntryList entries={displayEntries} />
            </div>
          </>
        )}
      </main>

      <footer className="border-t py-4 mt-8" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>Workload Tracker · Built for visibility and balance</p>
        </div>
      </footer>
    </div>
  );
}
