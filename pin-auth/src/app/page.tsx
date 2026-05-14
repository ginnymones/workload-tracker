"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"choose" | "create" | "access">("choose");
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    fetch("/api/auth").then(r => r.json()).then(data => {
      if (data.authenticated) {
        router.push(`/w/${data.username}`);
      } else {
        setLoading(false);
      }
    }).catch(() => setLoading(false));
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/workspace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, pin }),
    });
    const data = await res.json();
    if (res.ok) {
      router.push(`/w/${data.username}`);
    } else {
      setError(data.error);
    }
  };

  const handleAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, pin }),
    });
    const data = await res.json();
    if (res.ok) {
      router.push(`/w/${data.username}`);
    } else {
      setError(data.error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-primary)" }}>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="w-full max-w-sm rounded-xl p-8 border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
        <h1 className="text-xl font-semibold text-center mb-2" style={{ color: "var(--text-primary)" }}>
          Workload Tracker
        </h1>
        <p className="text-xs text-center mb-8" style={{ color: "var(--text-muted)" }}>
          Personal workload tracking. No email, no OAuth — just a PIN.
        </p>

        {mode === "choose" && (
          <div className="space-y-3">
            <button
              onClick={() => setMode("create")}
              className="w-full py-3 rounded-lg text-sm font-medium"
              style={{ backgroundColor: "var(--accent-button)", color: "#fff" }}
            >
              Create New Workspace
            </button>
            <button
              onClick={() => setMode("access")}
              className="w-full py-3 rounded-lg text-sm font-medium border"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)", backgroundColor: "transparent" }}
            >
              Access Existing Workspace
            </button>
          </div>
        )}

        {mode === "create" && (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Username</label>
              <input
                type="text" value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                placeholder="e.g. regmones"
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
                style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
              />
              {username && <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Your URL: /w/{username}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>PIN (4-6 digits)</label>
              <input
                type="password" inputMode="numeric" maxLength={6} value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••"
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none tracking-widest"
                style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
              />
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Used to access from other devices</p>
            </div>
            {error && <p className="text-xs" style={{ color: "var(--danger)" }}>{error}</p>}
            <button type="submit" className="w-full py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: "var(--accent-button)", color: "#fff" }}>
              Create Workspace
            </button>
            <button type="button" onClick={() => { setMode("choose"); setError(""); }} className="w-full text-xs" style={{ color: "var(--text-muted)" }}>← Back</button>
          </form>
        )}

        {mode === "access" && (
          <form onSubmit={handleAccess} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Username</label>
              <input
                type="text" value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                placeholder="your-username"
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
                style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>PIN</label>
              <input
                type="password" inputMode="numeric" maxLength={6} value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••"
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none tracking-widest"
                style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
              />
            </div>
            {error && <p className="text-xs" style={{ color: "var(--danger)" }}>{error}</p>}
            <button type="submit" className="w-full py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: "var(--accent-button)", color: "#fff" }}>
              Access Workspace
            </button>
            <button type="button" onClick={() => { setMode("choose"); setError(""); }} className="w-full text-xs" style={{ color: "var(--text-muted)" }}>← Back</button>
          </form>
        )}
      </div>
    </div>
  );
}
