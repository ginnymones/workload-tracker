"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { WorkloadEntry, WorkCategory, DailyCapacity } from "./types";
import { SEED_ENTRIES } from "./seed-data";

interface StoreContextType {
  entries: WorkloadEntry[];
  capacity: DailyCapacity;
  addEntry: (entry: { date: string; category: WorkCategory; hours: number; description: string }) => void;
  deleteEntry: (id: string) => void;
  updateCapacity: (capacity: DailyCapacity) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<WorkloadEntry[]>(SEED_ENTRIES);
  const [capacity, setCapacity] = useState<DailyCapacity>({
    maxHours: 8,
    warningThreshold: 0.85,
  });

  const addEntry = (entry: { date: string; category: WorkCategory; hours: number; description: string }) => {
    const newEntry: WorkloadEntry = {
      ...entry,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [newEntry, ...prev]);
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const updateCapacity = (newCapacity: DailyCapacity) => {
    setCapacity(newCapacity);
  };

  return (
    <StoreContext.Provider value={{ entries, capacity, addEntry, deleteEntry, updateCapacity }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
