"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [maxHours, setMaxHours] = useState("8");
  const [warningThreshold, setWarningThreshold] = useState("85");
  const [dashboardPublic, setDashboardPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setUsername(data.username || "");
        setMaxHours(String(data.capacity.maxHours));
        setWarningThreshold(String(Math.round(data.capacity.warningThreshold * 100)));
        setDashboardPublic(data.dashboardPublic);
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (status === "authenticated") {
      fetchSettings();
    }
  }, [status, router, fetchSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username || undefined,
          maxHours: parseFloat(maxHours),
          warningThreshold: parseFloat(warningThreshold) / 100,
          dashboardPublic,
        }),
      });

      if (res.ok) {
        setMessage("Settings saved");
        setTimeout(() => setMessage(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save settings");
      }
    } catch {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  const publicUrl = username
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/dashboard/${username}`
    : null;

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
            <h1 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Settings
            </h1>
            <a
              href="/"
              className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:opacity-80"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              ← Dashboard
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Profile */}
        <div
          className="rounded-xl p-5 border"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <h2 className="text-sm font-medium mb-4" style={{ color: "var(--text-secondary)" }}>
            Profile
          </h2>
          <div className="flex items-center gap-3 mb-4">
            {session.user?.image && (
              <img src={session.user.image} alt="" className="w-10 h-10 rounded-full" />
            )}
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {session.user?.name}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {session.user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--danger)" }}
          >
            Sign Out
          </button>
        </div>

        {/* Settings form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Username & sharing */}
          <div
            className="rounded-xl p-5 border"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
          >
            <h2 className="text-sm font-medium mb-4" style={{ color: "var(--text-secondary)" }}>
              Sharing
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                  placeholder="e.g. regmones"
                  className="w-full px-3 py-2 rounded-lg text-sm border outline-none transition-colors focus:border-[var(--accent)]"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  Used for your public dashboard URL. Letters, numbers, hyphens, underscores only.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    Public dashboard
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    Allow anyone with the link to view your workload
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDashboardPublic(!dashboardPublic)}
                  className="relative w-11 h-6 rounded-full transition-colors"
                  style={{
                    backgroundColor: dashboardPublic ? "var(--accent)" : "var(--border)",
                  }}
                  role="switch"
                  aria-checked={dashboardPublic}
                  aria-label="Toggle public dashboard"
                >
                  <span
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: dashboardPublic ? "translateX(20px)" : "translateX(0)",
                    }}
                  />
                </button>
              </div>

              {publicUrl && dashboardPublic && (
                <div
                  className="px-3 py-2 rounded-lg text-xs"
                  style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-muted)" }}
                >
                  Your public URL: <span style={{ color: "var(--accent)" }}>{publicUrl}</span>
                </div>
              )}
            </div>
          </div>

          {/* Capacity */}
          <div
            className="rounded-xl p-5 border"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
          >
            <h2 className="text-sm font-medium mb-4" style={{ color: "var(--text-secondary)" }}>
              Capacity
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="maxHours"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Max hours/day
                </label>
                <input
                  id="maxHours"
                  type="number"
                  step="0.5"
                  min="1"
                  max="24"
                  value={maxHours}
                  onChange={(e) => setMaxHours(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm border outline-none transition-colors focus:border-[var(--accent)]"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="warningThreshold"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Warning at (%)
                </label>
                <input
                  id="warningThreshold"
                  type="number"
                  step="5"
                  min="50"
                  max="100"
                  value={warningThreshold}
                  onChange={(e) => setWarningThreshold(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm border outline-none transition-colors focus:border-[var(--accent)]"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div
              className="px-3 py-2 rounded-lg text-xs font-medium"
              style={{
                backgroundColor: "rgba(52, 211, 153, 0.1)",
                color: "var(--success)",
                border: "1px solid rgba(52, 211, 153, 0.2)",
              }}
            >
              {message}
            </div>
          )}
          {error && (
            <div
              className="px-3 py-2 rounded-lg text-xs font-medium"
              style={{
                backgroundColor: "rgba(248, 113, 113, 0.1)",
                color: "var(--danger)",
                border: "1px solid rgba(248, 113, 113, 0.2)",
              }}
            >
              {error}
            </div>
          )}

          {/* Save */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "var(--accent-button)", color: "#ffffff" }}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </main>
    </div>
  );
}
