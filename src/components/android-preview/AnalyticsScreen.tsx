import React from 'react';
import {
  TrendingUp,
  Flame,
  Award,
  Calendar,
  CheckCircle2,
  Sparkles,
  Zap,
  Crown,
  ShieldCheck,
} from 'lucide-react';
import { HabitWithStatus, HabitCompletionLog } from '../../types/habit';
import { formatLocalDate, MILESTONES } from '../../utils/streakCalculator';
import { triggerMilestoneConfetti } from '../../utils/confetti';

interface AnalyticsScreenProps {
  habits: HabitWithStatus[];
  completionLogs: HabitCompletionLog[];
  overallConsistency: number;
  bestStreak: number;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  habits,
  completionLogs,
  overallConsistency,
  bestStreak,
}) => {
  const today = new Date();

  // Weekly data computation (past 7 days Mon-Sun or last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dStr = formatLocalDate(d);
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];

    const scheduledCount = habits.filter((h) => {
      const isoDay = d.getDay() === 0 ? 7 : d.getDay();
      if (h.frequency.type === 'daily') return true;
      if (h.frequency.type === 'weekdays') return isoDay <= 5;
      if (h.frequency.type === 'weekends') return isoDay >= 6;
      return h.frequency.daysOfWeek.includes(isoDay);
    }).length;

    const completedCount = completionLogs.filter((l) => l.date === dStr).length;

    return {
      dateStr: dStr,
      dayName,
      scheduledCount,
      completedCount,
      ratio: scheduledCount > 0 ? Math.min(completedCount / scheduledCount, 1) : 0,
    };
  });

  // 30-day heatmap grid
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    const dStr = formatLocalDate(d);
    const count = completionLogs.filter((l) => l.date === dStr).length;
    return { dateStr: dStr, count };
  });

  const getHeatmapColor = (count: number) => {
    if (count === 0) return 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700/60';
    if (count <= 1) return 'bg-sky-200 dark:bg-sky-900/60 border-sky-300 dark:border-sky-800 text-sky-900';
    if (count <= 3) return 'bg-sky-400 dark:bg-sky-700 border-sky-500 text-white';
    return 'bg-emerald-500 dark:bg-emerald-600 border-emerald-600 text-white';
  };

  const renderMilestoneIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-indigo-500" />;
      case 'Trophy':
        return <Award className="w-5 h-5 text-amber-500" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-purple-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-sky-500" />;
    }
  };

  return (
    <div className="space-y-5 pb-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
          Analytics & Consistency
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time metrics calculated from Room completion logs
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-2xl p-3 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[11px] font-semibold">Consistency</span>
          </div>
          <div className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
            {overallConsistency}%
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">30-day average</div>
        </div>

        <div className="rounded-2xl p-3 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs">
          <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 mb-1">
            <Flame className="w-4 h-4" />
            <span className="text-[11px] font-semibold">Best Streak</span>
          </div>
          <div className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
            {bestStreak}d
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Personal record</div>
        </div>

        <div className="rounded-2xl p-3 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs">
          <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[11px] font-semibold">Total Logs</span>
          </div>
          <div className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
            {completionLogs.length}
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Check-ins</div>
        </div>
      </div>

      {/* 7-Day Completion Bar Chart */}
      <div className="rounded-2xl p-4 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Weekly Adherence
            </h3>
            <p className="text-[11px] text-slate-400">Scheduled vs Completed</p>
          </div>
          <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
            Last 7 Days
          </span>
        </div>

        <div className="flex items-end justify-between gap-2 h-32 pt-4 px-1">
          {last7Days.map((day) => {
            const heightPercent = Math.max(Math.round(day.ratio * 100), 10);
            const isFull = day.ratio >= 1 && day.completedCount > 0;

            return (
              <div key={day.dateStr} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  {day.completedCount}
                </span>
                <div className="w-full bg-slate-100 dark:bg-slate-700/60 rounded-t-lg h-20 flex items-end overflow-hidden p-0.5">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      isFull
                        ? 'bg-gradient-to-t from-emerald-600 to-teal-400'
                        : 'bg-gradient-to-t from-sky-600 to-sky-400'
                    }`}
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-400">
                  {day.dayName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 30-Day Contribution Heatmap */}
      <div className="rounded-2xl p-4 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              30-Day Activity Heatmap
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">Daily check-in intensity</span>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-10 gap-1.5 py-2">
          {last30Days.map((cell) => (
            <div
              key={cell.dateStr}
              title={`${cell.dateStr}: ${cell.count} habits completed`}
              className={`aspect-square rounded-md border flex items-center justify-center text-[9px] font-semibold transition-all hover:scale-110 cursor-pointer ${getHeatmapColor(
                cell.count
              )}`}
            >
              {cell.count > 0 ? cell.count : ''}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-1.5 text-[10px] text-slate-400 mt-2">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-xs bg-slate-200 dark:bg-slate-700" />
          <span className="w-2.5 h-2.5 rounded-xs bg-sky-300 dark:bg-sky-800" />
          <span className="w-2.5 h-2.5 rounded-xs bg-sky-500" />
          <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
          <span>More</span>
        </div>
      </div>

      {/* Streak Milestones */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            Streak Milestones
          </h3>
          <span className="text-xs text-slate-400">
            {MILESTONES.filter((m) => bestStreak >= m.requiredStreak).length} of {MILESTONES.length} unlocked
          </span>
        </div>

        <div className="space-y-2">
          {MILESTONES.map((m) => {
            const unlocked = bestStreak >= m.requiredStreak;
            const progress = Math.min(Math.round((bestStreak / m.requiredStreak) * 100), 100);

            return (
              <div
                key={m.id}
                onClick={() => {
                  if (unlocked) triggerMilestoneConfetti();
                }}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  unlocked
                    ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300/80 dark:border-amber-700/60 shadow-xs cursor-pointer hover:scale-[1.01]'
                    : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 opacity-70'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    unlocked
                      ? 'bg-amber-100 dark:bg-amber-900/60 ring-2 ring-amber-400/40'
                      : 'bg-slate-100 dark:bg-slate-700'
                  }`}
                >
                  {renderMilestoneIcon(m.badgeIcon)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {m.title}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        unlocked
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                      }`}
                    >
                      {unlocked ? 'UNLOCKED' : `${bestStreak}/${m.requiredStreak}d`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {m.description}
                  </p>

                  {!unlocked && (
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        style={{ width: `${progress}%` }}
                        className="bg-amber-500 h-full rounded-full transition-all duration-300"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
