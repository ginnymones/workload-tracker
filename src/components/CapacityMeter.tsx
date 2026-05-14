"use client";

interface CapacityMeterProps {
  hoursUsed: number;
  maxHours: number;
  warningThreshold: number;
}

export default function CapacityMeter({
  hoursUsed,
  maxHours,
  warningThreshold,
}: CapacityMeterProps) {
  const percentage = Math.min((hoursUsed / maxHours) * 100, 100);
  const isWarning = percentage >= warningThreshold * 100;
  const isOver = hoursUsed > maxHours;

  const getColor = () => {
    if (isOver) return "var(--danger)";
    if (isWarning) return "var(--warning)";
    return "var(--accent)";
  };

  const getLabel = () => {
    if (isOver) return "Over capacity";
    if (isWarning) return "Nearing capacity";
    return "On track";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Daily Capacity
        </span>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            color: getColor(),
            backgroundColor: `${getColor()}20`,
          }}
        >
          {getLabel()}
        </span>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
          {hoursUsed.toFixed(1)}
        </span>
        <span className="text-lg pb-0.5" style={{ color: "var(--text-muted)" }}>
          / {maxHours}h
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--border)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: getColor(),
          }}
        />
      </div>

      <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
        <span>0h</span>
        <span>{maxHours}h</span>
      </div>
    </div>
  );
}
