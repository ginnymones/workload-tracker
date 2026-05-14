"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { WorkloadEntry, CATEGORY_LABELS, CATEGORY_COLORS, WorkCategory } from "@/lib/types";

interface WorkloadChartProps {
  entries: WorkloadEntry[];
  title: string;
}

export default function WorkloadChart({ entries, title }: WorkloadChartProps) {
  // Aggregate hours by category
  const categoryData: Record<string, number> = {};
  entries.forEach((entry) => {
    categoryData[entry.category] = (categoryData[entry.category] || 0) + entry.hours;
  });

  const chartData = Object.entries(categoryData)
    .map(([category, hours]) => ({
      name: CATEGORY_LABELS[category as WorkCategory] || category,
      value: parseFloat(hours.toFixed(1)),
      color: CATEGORY_COLORS[category as WorkCategory] || "#64748b",
    }))
    .sort((a, b) => b.value - a.value);

  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm" style={{ color: "var(--text-muted)" }}>
        No data to display
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          {title}
        </h3>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {totalHours.toFixed(1)}h total
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--text-primary)",
              fontSize: "12px",
            }}
            formatter={(value) => [`${value}h`, ""]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: "var(--text-secondary)", fontSize: "11px" }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
