"use client";

import { useState } from "react";
import { WorkCategory, CATEGORY_LABELS } from "@/lib/types";

interface QuickAddProps {
  onAdd: (entry: {
    date: string;
    category: WorkCategory;
    hours: number;
    description: string;
  }) => Promise<void>;
}

export default function QuickAdd({ onAdd }: QuickAddProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<WorkCategory>("deep-work");
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numHours = parseFloat(hours);
    if (!hours || isNaN(numHours) || numHours <= 0) return;

    setIsSubmitting(true);
    await onAdd({ date: today, category, hours: numHours, description });
    setHours("");
    setDescription("");
    setIsSubmitting(false);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-3 rounded-xl border border-dashed text-sm transition-all hover:border-solid"
        style={{
          borderColor: "var(--border)",
          color: "var(--text-muted)",
          backgroundColor: "transparent",
        }}
      >
        + Quick add entry
      </button>
    );
  }

  const categories = Object.entries(CATEGORY_LABELS) as [WorkCategory, string][];

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl p-4 border"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as WorkCategory)}
          className="px-3 py-2 rounded-lg text-sm border outline-none"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
          aria-label="Category"
        >
          {categories.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <input
          type="number"
          step="0.25"
          min="0.25"
          max="24"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="Hours"
          className="px-3 py-2 rounded-lg text-sm border outline-none"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
          aria-label="Hours"
        />

        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="px-3 py-2 rounded-lg text-sm border outline-none"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
          aria-label="Description"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting || !hours}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "var(--accent-button)", color: "#ffffff" }}
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-3 py-2 rounded-lg text-sm border transition-opacity hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            ✕
          </button>
        </div>
      </div>
    </form>
  );
}
