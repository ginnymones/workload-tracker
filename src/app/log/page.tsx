"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { WorkloadEntry, WorkCategory, CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/types";
import EntryForm from "@/components/EntryForm";
import CapacityMeter from "@/components/CapacityMeter";

export default function LogPage() {
  const { status } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState<WorkloadEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [capacity, setCapacity] = useState({ maxHours: 8, warningThreshold: 0.85 });

  const today = new Date().toISOString().split("T")[0];

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch(`/api/entries?startDate=${today}&endDate=${today}`);
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (err) {
      console.error("Failed to fetch entries:", err);
    }
  }, [today]);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setCapacity(data.capacity);
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    if (status === "authenticated") {
      fetchEntries();
      fetchSettings();
    }
  }, [fetchEntries, fetchSettings, status, router]);

  const handleSubmit = async (entry: {
    date: string;
    category: WorkCategory;
    hours: number;
    description: string;
  }) => {
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });

      if (res.ok) {
        setSuccessMessage("Entry logged successfully");
        fetchEntries();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const data = await res.json();
        console.error("Failed to log entry:", data.error);
      }
    } catch (err) {
      console.error("Failed to log entry:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/entries?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchEntries();
      }
    } catch (err) {
      console.error("Failed to delete entry:", err);
    }
  };

  const todayHours = entries.reduce((sum, e) => sum + e.hours, 0);

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
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                Log Workload
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
            <a
              href="/"
              className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:opacity-80"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              ← Dashboard
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Capacity overview */}
        <div
          className="rounded-xl p-5 border"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <CapacityMeter
            hoursUsed={todayHours}
            maxHours={capacity.maxHours}
            warningThreshold={capacity.warningThreshold}
          />
        </div>

        {/* Entry form */}
        <div
          className="rounded-xl p-5 border"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <h2 className="text-sm font-medium mb-4" style={{ color: "var(--text-secondary)" }}>
            New Entry
          </h2>

          {successMessage && (
            <div
              className="mb-4 px-3 py-2 rounded-lg text-xs font-medium"
              style={{
                backgroundColor: "rgba(52, 211, 153, 0.1)",
                color: "var(--success)",
                border: "1px solid rgba(52, 211, 153, 0.2)",
              }}
            >
              {successMessage}
            </div>
          )}

          <EntryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>

        {/* Today's entries */}
        <div
          className="rounded-xl p-5 border"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Today&apos;s Entries
            </h2>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {entries.length} {entries.length === 1 ? "entry" : "entries"} · {todayHours.toFixed(1)}h
            </span>
          </div>

          {entries.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: "var(--text-muted)" }}>
              No entries logged today yet. Start by adding one above.
            </p>
          ) : (
            <div className="space-y-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 p-3 rounded-lg group"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[entry.category as WorkCategory] }}
                  />
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
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 rounded"
                    style={{ color: "var(--danger)" }}
                    aria-label={`Delete ${CATEGORY_LABELS[entry.category as WorkCategory]} entry`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
