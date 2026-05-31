'use client';

interface MacroRingProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  size?: number;
}

export function MacroRing({ label, current, target, unit, color, size = 80 }: MacroRingProps) {
  const pct = Math.min(1, target > 0 ? current / target : 0);
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={6}
            className="text-slate-200 dark:text-slate-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={6}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
            {Math.round(current)}
          </span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</div>
        <div className="text-xs text-slate-500 dark:text-slate-500">/ {target}{unit}</div>
      </div>
    </div>
  );
}

interface MacroBarProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

export function MacroBar({ label, current, target, unit, color }: MacroBarProps) {
  const pct = Math.min(100, target > 0 ? (current / target) * 100 : 0);
  const over = current > target;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <span className={over ? 'text-red-500 font-semibold' : 'text-slate-500 dark:text-slate-400'}>
          {Math.round(current)}&thinsp;/&thinsp;{target}&thinsp;{unit}
        </span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
