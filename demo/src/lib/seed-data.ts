import { WorkloadEntry } from "./types";

function getDateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

export const SEED_ENTRIES: WorkloadEntry[] = [
  // Today
  { id: "1", date: getDateStr(0), category: "deep-work", hours: 3, description: "Feature implementation — auth module", createdAt: new Date().toISOString() },
  { id: "2", date: getDateStr(0), category: "meetings", hours: 2, description: "Sprint planning + 1:1 with manager", createdAt: new Date().toISOString() },
  { id: "3", date: getDateStr(0), category: "code-review", hours: 1.5, description: "PR reviews for team", createdAt: new Date().toISOString() },

  // Yesterday
  { id: "4", date: getDateStr(1), category: "deep-work", hours: 4, description: "API endpoint development", createdAt: new Date().toISOString() },
  { id: "5", date: getDateStr(1), category: "meetings", hours: 1.5, description: "Design review", createdAt: new Date().toISOString() },
  { id: "6", date: getDateStr(1), category: "mentoring", hours: 1, description: "Pair programming with junior dev", createdAt: new Date().toISOString() },
  { id: "7", date: getDateStr(1), category: "learning", hours: 1, description: "Reading about caching strategies", createdAt: new Date().toISOString() },

  // 2 days ago
  { id: "8", date: getDateStr(2), category: "meetings", hours: 4, description: "All-hands + retro + stakeholder sync", createdAt: new Date().toISOString() },
  { id: "9", date: getDateStr(2), category: "deep-work", hours: 2, description: "Bug fixes", createdAt: new Date().toISOString() },
  { id: "10", date: getDateStr(2), category: "admin", hours: 1.5, description: "Documentation updates", createdAt: new Date().toISOString() },

  // 3 days ago
  { id: "11", date: getDateStr(3), category: "deep-work", hours: 5, description: "Database migration work", createdAt: new Date().toISOString() },
  { id: "12", date: getDateStr(3), category: "code-review", hours: 2, description: "Large PR review", createdAt: new Date().toISOString() },
  { id: "13", date: getDateStr(3), category: "planning", hours: 1, description: "Sprint backlog grooming", createdAt: new Date().toISOString() },

  // 4 days ago
  { id: "14", date: getDateStr(4), category: "deep-work", hours: 3.5, description: "Frontend component library", createdAt: new Date().toISOString() },
  { id: "15", date: getDateStr(4), category: "meetings", hours: 2.5, description: "Cross-team alignment + standup", createdAt: new Date().toISOString() },
  { id: "16", date: getDateStr(4), category: "mentoring", hours: 1.5, description: "Code walkthrough for new hire", createdAt: new Date().toISOString() },

  // 5 days ago
  { id: "17", date: getDateStr(5), category: "deep-work", hours: 4.5, description: "Performance optimization", createdAt: new Date().toISOString() },
  { id: "18", date: getDateStr(5), category: "learning", hours: 1.5, description: "Conference talk recordings", createdAt: new Date().toISOString() },
  { id: "19", date: getDateStr(5), category: "admin", hours: 1, description: "Expense reports", createdAt: new Date().toISOString() },

  // 6 days ago
  { id: "20", date: getDateStr(6), category: "deep-work", hours: 2, description: "Prototyping new feature", createdAt: new Date().toISOString() },
  { id: "21", date: getDateStr(6), category: "meetings", hours: 3.5, description: "Client demo + feedback session", createdAt: new Date().toISOString() },
  { id: "22", date: getDateStr(6), category: "code-review", hours: 1, description: "Quick PR approvals", createdAt: new Date().toISOString() },
  { id: "23", date: getDateStr(6), category: "planning", hours: 1.5, description: "Roadmap discussion", createdAt: new Date().toISOString() },
];
