import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface DailyProgressCardProps {
  completedCount: number;
  totalCount: number;
  percentage: number;
}

export const DailyProgressCard: React.FC<DailyProgressCardProps> = ({
  completedCount,
  totalCount,
  percentage,
}) => {
  // SVG circular progress calculation
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const isAllDone = totalCount > 0 && completedCount === totalCount;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white p-5 shadow-lg shadow-sky-950/20 border border-slate-700/50">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded-full border border-sky-800/60 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-400" /> Daily Target
            </span>
            {isAllDone && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> All Done!
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold tracking-tight">
            {completedCount} <span className="text-slate-400 font-normal">of</span> {totalCount} completed
          </h3>

          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {totalCount === 0
              ? 'No habits scheduled for this day.'
              : isAllDone
              ? 'Outstanding focus! All scheduled habits achieved today.'
              : completedCount > 0
              ? `${totalCount - completedCount} more to complete full daily routine.`
              : 'Tap checkboxes below to start building your momentum!'}
          </p>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-20 h-20 -rotate-90">
            {/* Background ring */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              className="text-slate-700/60"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Progress ring */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="url(#progressGradient)"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-base font-extrabold tracking-tight">{percentage}%</span>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-medium">Done</span>
          </div>
        </div>
      </div>
    </div>
  );
};
