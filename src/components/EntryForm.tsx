"use client";

import { useState } from "react";
import { WorkCategory, CATEGORY_LABELS } from "@/lib/types";

interface EntryFormProps {
  onSubmit: (entry: {
    date: string;
    category: WorkCategory;
    hours: number;
    description: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export default function EntryForm({ onSubmit, isSubmitting }: EntryFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState<WorkCategory>("deep-work");
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const numHours = parseFloat(hours);
    if (!hours || isNaN(numHours) || numHours <= 0) {
      setError("Please enter a valid number of hours");
      return;
    }
    if (numHours > 24) {
      setError("Hours cannot exceed 24");
      return;
    }

    await onSubmit({ date, category, hours: numHours, description });
    // Reset form
    setHours("");
    setDescription("");
  };

  const categories = Object.entries(CATEGORY_LABELS) as [WorkCategory, string][];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Date */}
      <div>
        <label
          htmlFor="entry-date"
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--text-secondary)" }}
        >
          Date
        </label>
        <input
          id="entry-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm border outline-none transition-colors focus:border-[var(--accent)]"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="entry-category"
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--text-secondary)" }}
        >
          Category
        </label>
        <select
          id="entry-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as WorkCategory)}
          className="w-full px-3 py-2 rounded-lg text-sm border outline-none transition-colors focus:border-[var(--accent)]"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
        >
          {categories.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Hours */}
      <div>
        <label
          htmlFor="entry-hours"
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--text-secondary)" }}
        >
          Hours
        </label>
        <input
          id="entry-hours"
          type="number"
          step="0.25"
          min="0.25"
          max="24"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="e.g. 2.5"
          className="w-full px-3 py-2 rounded-lg text-sm border outline-none transition-colors focus:border-[var(--accent)]"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="entry-description"
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--text-secondary)" }}
        >
          Description <span style={{ color: "var(--text-muted)" }}>(optional)</span>
        </label>
        <input
          id="entry-description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What did you work on?"
          className="w-full px-3 py-2 rounded-lg text-sm border outline-none transition-colors focus:border-[var(--accent)]"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50"
        style={{
          backgroundColor: "var(--accent-button)",
          color: "#ffffff",
        }}
      >
        {isSubmitting ? "Logging..." : "Log Entry"}
      </button>
    </form>
  );
}
