import React, { useState } from 'react';
import {
  Check,
  Flame,
  Clock,
  MoreVertical,
  Edit2,
  Trash2,
  Calendar,
} from 'lucide-react';
import { HabitWithStatus } from '../../types/habit';

interface HabitCardProps {
  habit: HabitWithStatus;
  onToggle: (habitId: string) => void;
  onEdit: (habit: HabitWithStatus) => void;
  onDelete: (habitId: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'health':
        return {
          bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
          label: 'Health',
        };
      case 'productivity':
        return {
          bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
          label: 'Productivity',
        };
      case 'fitness':
        return {
          bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
          label: 'Fitness',
        };
      case 'mindfulness':
        return {
          bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          label: 'Mindfulness',
        };
      case 'learning':
        return {
          bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          label: 'Learning',
        };
      case 'finance':
        return {
          bg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
          label: 'Finance',
        };
      default:
        return {
          bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
          label: 'General',
        };
    }
  };

  const catStyle = getCategoryStyles(habit.category);

  return (
    <div
      className={`group relative rounded-2xl p-4 transition-all duration-300 border ${
        habit.isCompletedToday
          ? 'bg-slate-50/80 dark:bg-slate-800/40 border-emerald-500/30 dark:border-emerald-500/20 shadow-sm'
          : 'bg-white dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Toggle Checkbox Button with ripple/spring animation */}
        <button
          onClick={() => onToggle(habit.id)}
          aria-label={habit.isCompletedToday ? 'Mark incomplete' : 'Mark complete'}
          className={`relative mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 ${
            habit.isCompletedToday
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-100 ring-4 ring-emerald-500/10'
              : 'border-2 border-slate-300 dark:border-slate-600 hover:border-sky-500 dark:hover:border-sky-400 text-transparent hover:text-slate-300 bg-transparent'
          }`}
        >
          <Check
            className={`w-4 h-4 stroke-[3] transition-transform duration-200 ${
              habit.isCompletedToday ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          />
        </button>

        {/* Habit Content */}
        <div className="flex-1 min-w-0" onClick={() => onToggle(habit.id)}>
          <div className="flex items-center gap-2">
            <h4
              className={`font-semibold text-sm transition-all duration-200 truncate ${
                habit.isCompletedToday
                  ? 'text-slate-400 dark:text-slate-500 line-through'
                  : 'text-slate-800 dark:text-slate-100'
              }`}
            >
              {habit.title}
            </h4>
          </div>

          {habit.description && (
            <p
              className={`text-xs mt-0.5 line-clamp-1 transition-all ${
                habit.isCompletedToday
                  ? 'text-slate-400/80 dark:text-slate-600'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {habit.description}
            </p>
          )}

          {/* Badges row: Category, Time, Frequency, Streak */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${catStyle.bg}`}
            >
              {catStyle.label}
            </span>

            {habit.targetTime && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                <Clock className="w-3 h-3" />
                {habit.targetTime}
              </span>
            )}

            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
              <Calendar className="w-3 h-3" />
              {habit.frequency.type === 'daily'
                ? 'Daily'
                : habit.frequency.type === 'weekdays'
                ? 'Weekdays'
                : habit.frequency.type === 'weekends'
                ? 'Weekends'
                : 'Custom'}
            </span>

            {/* Streak Counter */}
            <div className="ml-auto flex items-center gap-1.5">
              <div
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold transition-colors ${
                  habit.streakStats.currentStreak > 0
                    ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-400 dark:text-slate-500'
                }`}
                title={`Current streak: ${habit.streakStats.currentStreak} days (Best: ${habit.streakStats.longestStreak} days)`}
              >
                <Flame
                  className={`w-3.5 h-3.5 ${
                    habit.streakStats.currentStreak > 0
                      ? 'text-orange-500 animate-pulse fill-orange-500'
                      : 'text-slate-400'
                  }`}
                />
                <span>{habit.streakStats.currentStreak}d</span>
              </div>
            </div>
          </div>
        </div>

        {/* Options Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div
                className="absolute right-0 top-8 z-30 w-36 py-1 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 text-xs animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(habit);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-sky-500" />
                  Edit Habit
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(habit.id);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
