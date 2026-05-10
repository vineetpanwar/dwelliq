"use client";

export default function BudgetTracker({
  totalBudget,
  spent,
  compact = false,
}: {
  totalBudget: number;
  spent: number;
  compact?: boolean;
}) {
  const pct = Math.round((spent / totalBudget) * 100);
  const remaining = totalBudget - spent;
  const isOver = spent > totalBudget;
  const isWarning = pct >= 80 && !isOver;

  const barColor = isOver
    ? "bg-rust"
    : isWarning
    ? "bg-gold"
    : "bg-sage";

  const textColor = isOver
    ? "text-rust"
    : isWarning
    ? "text-gold"
    : "text-sage";

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium ${textColor}`}>
          ${remaining.toLocaleString()} left
        </span>
        <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${Math.min(100, pct)}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-warm-grey uppercase tracking-wider font-medium mb-0.5">
            Budget tracker
          </p>
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-3xl font-light text-ink">
              ${remaining.toLocaleString()}
            </span>
            <span className="text-sm text-warm-grey">
              remaining of ${totalBudget.toLocaleString()}
            </span>
          </div>
        </div>
        <div className={`text-right ${textColor}`}>
          <p className="font-mono text-lg">{pct}%</p>
          <p className="text-xs">
            {isOver ? "over budget" : isWarning ? "near limit" : "allocated"}
          </p>
        </div>
      </div>
      <div className="progress-bar">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      <p className="text-xs text-warm-grey mt-2">
        Based on Option A selections · ${spent.toLocaleString()} allocated across {" "}
        {Math.ceil(spent / (totalBudget / 5))} categories
      </p>
    </div>
  );
}
