export interface WorkloadEntry {
  id: string;
  date: string;
  category: WorkCategory;
  hours: number;
  description?: string;
  createdAt: string;
}

export type WorkCategory =
  | "deep-work" | "meetings" | "code-review" | "planning"
  | "admin" | "mentoring" | "learning" | "other";

export interface DailyCapacity {
  maxHours: number;
  warningThreshold: number;
}

export const CATEGORY_LABELS: Record<WorkCategory, string> = {
  "deep-work": "Deep Work", meetings: "Meetings", "code-review": "Code Review",
  planning: "Planning", admin: "Admin", mentoring: "Mentoring",
  learning: "Learning", other: "Other",
};

export const CATEGORY_COLORS: Record<WorkCategory, string> = {
  "deep-work": "#818cf8", meetings: "#f59e0b", "code-review": "#10b981",
  planning: "#8b5cf6", admin: "#8892a4", mentoring: "#ec4899",
  learning: "#06b6d4", other: "#78716c",
};
