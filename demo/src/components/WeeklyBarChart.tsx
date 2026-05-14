"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { WorkloadEntry } from "@/lib/types";

interface WeeklyBarChartProps {
  entries: WorkloadEntry[];
  maxHours: number;
}

export default function WeeklyBarChart({ entries, maxHours }: WeeklyBarChartProps) {
  // Group by date
  const dateMap: Record<string, number> = {};
  entries.forEach((entry) => {
    dateMap[entry.date] = (dateMap[entry.date] || 0) + entry.hours;
  });

  const chartData = Object.entries(dateMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, hours]) => {
      const formatted = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
      });
      return {
        date: formatted,
        hours: parseFloat(hours.toFixed(1)),
        isOver: hours > maxHours,
      };
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          Hours per Day
        </h3>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          Capacity: {maxHours}h/day
        </span>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            unit="h"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--text-primary)",
              fontSize: "12px",
            }}
            formatter={(value) => [`${value}h`, "Hours"]}
          />
          <ReferenceLine
            y={maxHours}
            stroke="var(--danger)"
            strokeDasharray="4 4"
            strokeOpacity={0.6}
          />
          <Bar
            dataKey="hours"
            radius={[4, 4, 0, 0]}
            fill="var(--accent)"
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
