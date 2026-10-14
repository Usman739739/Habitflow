import { Habit, HabitCompletionLog, StreakStats, Milestone } from '../types/habit';

/**
 * Formats a Date object to YYYY-MM-DD in local time
 */
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse YYYY-MM-DD to Date object at local midnight
 */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Returns ISO day of week: 1 = Monday, ..., 7 = Sunday
 */
export function getIsoDayOfWeek(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 7 : day;
}

/**
 * Check if a habit is scheduled for a specific date
 */
export function isHabitScheduledOn(habit: Habit, date: Date): boolean {
  const isoDay = getIsoDayOfWeek(date);
  switch (habit.frequency.type) {
    case 'daily':
      return true;
    case 'weekdays':
      return isoDay >= 1 && isoDay <= 5;
    case 'weekends':
      return isoDay === 6 || isoDay === 7;
    case 'custom':
      return habit.frequency.daysOfWeek.includes(isoDay);
    default:
      return true;
  }
}

/**
 * Calculate streak stats for a habit based on its completion logs.
 * Equivalent to Kotlin java.time.LocalDate streak calculator.
 */
export function calculateHabitStreaks(
  habit: Habit,
  logs: HabitCompletionLog[],
  referenceDate: Date = new Date()
): StreakStats {
  const completedDateSet = new Set(
    logs.filter((log) => log.habitId === habit.id).map((l) => l.date)
  );

  const totalCompletions = completedDateSet.size;

  // Evaluate current streak backward from today
  const todayStr = formatLocalDate(referenceDate);
  const isCompletedToday = completedDateSet.has(todayStr);

  let currentStreak = 0;
  const cursorDate = new Date(referenceDate);

  // If today is scheduled and completed, count today
  // If today is scheduled but not completed yet, streak can continue from yesterday
  if (isHabitScheduledOn(habit, cursorDate)) {
    if (isCompletedToday) {
      currentStreak++;
      cursorDate.setDate(cursorDate.getDate() - 1);
    } else {
      // today not done yet, start checking from yesterday
      cursorDate.setDate(cursorDate.getDate() - 1);
    }
  } else {
    // today is not scheduled, streak continues from last scheduled day
    cursorDate.setDate(cursorDate.getDate() - 1);
  }

  // Count backwards
  let safetyCounter = 365;
  while (safetyCounter-- > 0) {
    if (isHabitScheduledOn(habit, cursorDate)) {
      const dateStr = formatLocalDate(cursorDate);
      if (completedDateSet.has(dateStr)) {
        currentStreak++;
        cursorDate.setDate(cursorDate.getDate() - 1);
      } else {
        break; // Streak broken
      }
    } else {
      // Non-scheduled day does not break streak
      cursorDate.setDate(cursorDate.getDate() - 1);
    }
  }

  // Calculate longest streak across history
  let longestStreak = currentStreak;
  let tempStreak = 0;
  const evalDate = new Date(referenceDate);
  evalDate.setDate(evalDate.getDate() - 90); // evaluate past 90 days

  let scheduledDaysPast30 = 0;
  let completedDaysPast30 = 0;

  for (let i = 0; i <= 90; i++) {
    const curStr = formatLocalDate(evalDate);
    const isSched = isHabitScheduledOn(habit, evalDate);

    if (i >= 60) {
      // Last 30 days
      if (isSched) {
        scheduledDaysPast30++;
        if (completedDateSet.has(curStr)) {
          completedDaysPast30++;
        }
      }
    }

    if (isSched) {
      if (completedDateSet.has(curStr)) {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    }

    evalDate.setDate(evalDate.getDate() + 1);
  }

  const completionRate =
    scheduledDaysPast30 > 0
      ? Math.round((completedDaysPast30 / scheduledDaysPast30) * 100)
      : totalCompletions > 0
      ? 100
      : 0;

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalCompletions,
    completionRate,
  };
}

/**
 * Standard streak milestones
 */
export const MILESTONES: Omit<Milestone, 'unlocked' | 'unlockedDate'>[] = [
  {
    id: 'm1',
    title: '3-Day Spark',
    description: 'Complete habits 3 days in a row',
    requiredStreak: 3,
    badgeIcon: 'Sparkles',
  },
  {
    id: 'm2',
    title: '7-Day Momentum',
    description: 'Hit a full 1-week streak',
    requiredStreak: 7,
    badgeIcon: 'Flame',
  },
  {
    id: 'm3',
    title: '14-Day Iron Habit',
    description: 'Maintain habit consistency for 2 weeks',
    requiredStreak: 14,
    badgeIcon: 'ShieldCheck',
  },
  {
    id: 'm4',
    title: '30-Day Master',
    description: 'Full monthly habit locked in your lifestyle',
    requiredStreak: 30,
    badgeIcon: 'Trophy',
  },
  {
    id: 'm5',
    title: '60-Day Titan',
    description: 'Two continuous months of excellence',
    requiredStreak: 60,
    badgeIcon: 'Zap',
  },
  {
    id: 'm6',
    title: '100-Day Legend',
    description: 'Centurion achievement! Unbreakable discipline',
    requiredStreak: 100,
    badgeIcon: 'Crown',
  },
];
