export type HabitCategory =
  | 'health'
  | 'productivity'
  | 'fitness'
  | 'mindfulness'
  | 'learning'
  | 'finance'
  | 'bad_habit';

export type FrequencyType = 'daily' | 'weekdays' | 'weekends' | 'custom';

export interface HabitFrequency {
  type: FrequencyType;
  /** Days of week as 1 (Monday) to 7 (Sunday) */
  daysOfWeek: number[];
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  targetTime?: string; // HH:mm format, e.g., "07:30"
  color: string; // Hex color string
  createdAt: string; // ISO date YYYY-MM-DD
  archived: boolean;
}

export interface HabitCompletionLog {
  id: string;
  habitId: string;
  date: string; // ISO date YYYY-MM-DD
  completedAt: string; // ISO timestamp
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number; // 0 to 100 percentage
}

export interface HabitWithStatus extends Habit {
  isCompletedToday: boolean;
  streakStats: StreakStats;
  isScheduledToday: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  requiredStreak: number;
  badgeIcon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

export type AppTheme = 'system' | 'light' | 'dark';

// --- Bad Habit & Relapse Tracking Types ---

export interface RelapseLog {
  id: string;
  badHabitId: string;
  timestamp: string; // ISO timestamp
  reason?: string; // e.g., "Stress at work", "Boredom", "Social pressure"
  reflection?: string;
  daysCleanBefore: number;
}

export interface BadHabit {
  id: string;
  title: string;
  reasonToQuit: string;
  category: 'nicotine' | 'screen_time' | 'sugar_diet' | 'alcohol' | 'compulsive' | 'other';
  quitDate: string; // ISO timestamp when current clean streak started
  costPerDay?: number; // Financial cost in USD/day (e.g., $12 for pack of cigarettes/vape)
  timeSpentPerDayHours?: number; // Hours wasted per day (e.g., 2.5h on doomscrolling)
  icon: string;
  color: string;
  relapses: RelapseLog[];
  longestCleanDays: number;
}

export interface CleanTimeBreakdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  totalDaysFloat: number;
  moneySaved: number;
  hoursReclaimed: number;
}

export interface HabitTemplate {
  id: string;
  title: string;
  description: string;
  type: 'good' | 'bad';
  category: HabitCategory;
  recommendedFrequency?: FrequencyType;
  recommendedDays?: number[];
  recommendedTime?: string;
  badHabitCategory?: BadHabit['category'];
  estimatedCostPerDay?: number;
  estimatedHoursWasted?: number;
  icon: string;
  color: string;
  benefits: string[];
}
