import React from 'react';
import { formatLocalDate } from '../../utils/streakCalculator';

interface WeekCalendarStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  completedDatesCountMap?: Record<string, number>;
}

export const WeekCalendarStrip: React.FC<WeekCalendarStripProps> = ({
  selectedDate,
  onSelectDate,
  completedDatesCountMap = {},
}) => {
  const today = new Date();
  const todayStr = formatLocalDate(today);
  const selectedStr = formatLocalDate(selectedDate);

  // Generate 7 days centered or relative to today: 3 days past, today, 3 days future
  const days: Date[] = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex items-center justify-between gap-1.5 py-1">
      {days.map((date) => {
        const dateStr = formatLocalDate(date);
        const isSelected = dateStr === selectedStr;
        const isToday = dateStr === todayStr;
        const dayName = dayNames[date.getDay()];
        const dayNumber = date.getDate();
        const hasCompletions = (completedDatesCountMap[dateStr] || 0) > 0;

        return (
          <button
            key={dateStr}
            onClick={() => onSelectDate(date)}
            className={`flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-2xl transition-all duration-200 relative ${
              isSelected
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20 scale-[1.03]'
                : isToday
                ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
                : 'bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60'
            }`}
          >
            <span
              className={`text-[10px] font-semibold tracking-wider uppercase ${
                isSelected
                  ? 'text-sky-100'
                  : isToday
                  ? 'text-sky-600 dark:text-sky-400'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {dayName}
            </span>
            <span className="text-sm font-bold mt-0.5">{dayNumber}</span>

            {/* Completion indicator dot */}
            <div className="h-1 mt-1 flex items-center justify-center">
              {hasCompletions && (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSelected ? 'bg-white' : 'bg-emerald-500'
                  }`}
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
