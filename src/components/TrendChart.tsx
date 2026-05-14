"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { WorkloadEntry, CATEGORY_COLORS, CATEGORY_LABELS, WorkCategory } from "@/lib/types";

interface TrendChartProps {
  entries: WorkloadEntry[];
}

export default function TrendChart({ entries }: TrendChartProps) {
  // Group entries by date and category
  const dateMap: Record<string, Record<string, number>> = {};

  entries.forEach((entry) => {
    if (!dateMap[entry.date]) {
      dateMap[entry.date] = {};
    }
    dateMap[entry.date][entry.category] =
      (dateMap[entry.date][entry.category] || 0) + entry.hours;
  });

  // Get all unique categories
  const categories = [...new Set(entries.map((e) => e.category))];

  // Build chart data sorted by date
  const chartData = Object.entries(dateMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, cats]) => {
      const formatted = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      return {
        date: formatted,
        ...cats,
      };
    });

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm" style={{ color: "var(--text-muted)" }}>
        No trend data available
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          Weekly Trends
        </h3>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          Past 7 days
        </span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
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
            formatter={(value, name) => [
              `${value}h`,
              CATEGORY_LABELS[name as WorkCategory] || name,
            ]}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: "var(--text-secondary)", fontSize: "11px" }}>
                {CATEGORY_LABELS[value as WorkCategory] || value}
              </span>
            )}
          />
          {categories.map((category) => (
            <Area
              key={category}
              type="monotone"
              dataKey={category}
              stackId="1"
              stroke={CATEGORY_COLORS[category as WorkCategory]}
              fill={CATEGORY_COLORS[category as WorkCategory]}
              fillOpacity={0.4}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
