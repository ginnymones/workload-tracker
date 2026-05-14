"use client";

import { useState } from "react";

export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="relative px-4 py-3 text-center text-xs"
      style={{
        backgroundColor: "rgba(129, 140, 248, 0.1)",
        borderBottom: "1px solid rgba(129, 140, 248, 0.2)",
        color: "var(--text-secondary)",
      }}
    >
      <span className="font-medium" style={{ color: "var(--accent)" }}>Demo Mode</span>
      {" — "}
      This is a proof of concept. You can add entries and explore freely.
      No data is stored or sent anywhere — everything resets when you close the tab.
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm opacity-60 hover:opacity-100"
        style={{ color: "var(--text-muted)" }}
        aria-label="Dismiss banner"
      >
        ✕
      </button>
    </div>
  );
}
