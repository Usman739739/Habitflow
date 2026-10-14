import { Habit, HabitCompletionLog, BadHabit, HabitTemplate } from '../types/habit';
import { formatLocalDate } from '../utils/streakCalculator';

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    title: 'Morning Hydration (1 Liter)',
    description: 'Drink fresh water with lemon right after waking up.',
    category: 'health',
    frequency: { type: 'daily', daysOfWeek: [1, 2, 3, 4, 5, 6, 7] },
    targetTime: '07:00',
    color: '#0284c7', // Sky Blue
    createdAt: '2026-09-01',
    archived: false,
  },
  {
    id: 'habit-2',
    title: '45-Min Deep Focus Work',
    description: 'No social media, pure uninterrupted engineering tasks.',
    category: 'productivity',
    frequency: { type: 'weekdays', daysOfWeek: [1, 2, 3, 4, 5] },
    targetTime: '09:30',
    color: '#7c3aed', // Purple
    createdAt: '2026-09-05',
    archived: false,
  },
  {
    id: 'habit-3',
    title: 'Calisthenics & Strength Training',
    description: 'Pushups, pullups, squats, and mobility exercises.',
    category: 'fitness',
    frequency: { type: 'custom', daysOfWeek: [1, 3, 5, 6] },
    targetTime: '17:30',
    color: '#ea580c', // Orange
    createdAt: '2026-09-10',
    archived: false,
  },
  {
    id: 'habit-4',
    title: 'Evening Mindfulness & Breathwork',
    description: '10 minutes 4-7-8 breathing to down-regulate nervous system.',
    category: 'mindfulness',
    frequency: { type: 'daily', daysOfWeek: [1, 2, 3, 4, 5, 6, 7] },
    targetTime: '21:00',
    color: '#10b981', // Emerald
    createdAt: '2026-09-01',
    archived: false,
  },
  {
    id: 'habit-5',
    title: 'Read 20 Pages Architecture / Tech',
    description: 'Deepen system design, Kotlin coroutines, or software craft.',
    category: 'learning',
    frequency: { type: 'daily', daysOfWeek: [1, 2, 3, 4, 5, 6, 7] },
    targetTime: '21:45',
    color: '#f59e0b', // Amber
    createdAt: '2026-09-12',
    archived: false,
  },
];

/**
 * Realistic initial bad habits with clean streaks and relapse logs
 */
export const INITIAL_BAD_HABITS: BadHabit[] = [
  {
    id: 'bad-1',
    title: 'Vaping & Nicotine Puffs',
    reasonToQuit: 'Reclaim cardiovascular health, lung capacity, and save $360/month.',
    category: 'nicotine',
    quitDate: new Date(Date.now() - (18 * 24 * 3600 + 14 * 3600 + 22 * 60) * 1000).toISOString(), // ~18 days clean
    costPerDay: 12.0, // $12/day
    timeSpentPerDayHours: 0.8,
    icon: 'CigaretteOff',
    color: '#ef4444', // Red
    longestCleanDays: 18,
    relapses: [
      {
        id: 'relapse-1',
        badHabitId: 'bad-1',
        timestamp: new Date(Date.now() - 19 * 24 * 3600 * 1000).toISOString(),
        reason: 'Stress after late-night deployment incident',
        reflection: 'Realized craving passed in 10 minutes. Will use urge surfing next time.',
        daysCleanBefore: 7,
      },
    ],
  },
  {
    id: 'bad-2',
    title: 'Late-Night Doomscrolling Reels',
    reasonToQuit: 'Sleep earlier, eliminate brain fog, and regain 2.5 hours of daily focus.',
    category: 'screen_time',
    quitDate: new Date(Date.now() - (6 * 24 * 3600 + 8 * 3600 + 45 * 60) * 1000).toISOString(), // ~6 days clean
    costPerDay: 0,
    timeSpentPerDayHours: 2.5, // 2.5 hours saved every day!
    icon: 'SmartphoneOff',
    color: '#8b5cf6', // Violet
    longestCleanDays: 14,
    relapses: [
      {
        id: 'relapse-2',
        badHabitId: 'bad-2',
        timestamp: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
        reason: 'Kept phone next to pillow while trying to fall asleep',
        reflection: 'Leaving phone charging across the room in the hallway from now on.',
        daysCleanBefore: 14,
      },
    ],
  },
  {
    id: 'bad-3',
    title: 'Refined Sugar & Energy Drinks',
    reasonToQuit: 'Stop afternoon energy crashes, stabilize insulin, and protect teeth.',
    category: 'sugar_diet',
    quitDate: new Date(Date.now() - (24 * 24 * 3600 + 5 * 3600) * 1000).toISOString(), // ~24 days clean
    costPerDay: 5.5,
    timeSpentPerDayHours: 0.3,
    icon: 'CandyOff',
    color: '#f97316', // Orange
    longestCleanDays: 24,
    relapses: [],
  },
];

/**
 * Built-in Library of Most Used Habits and Bad Habits to Quit
 */
export const BUILT_IN_TEMPLATES: HabitTemplate[] = [
  // Good Habits
  {
    id: 'tpl-good-1',
    title: 'Morning Hydration (1L)',
    description: 'Kickstart digestion and cellular energy immediately after waking.',
    type: 'good',
    category: 'health',
    recommendedFrequency: 'daily',
    recommendedDays: [1, 2, 3, 4, 5, 6, 7],
    recommendedTime: '07:00',
    icon: 'Droplets',
    color: '#0284c7',
    benefits: ['Rehydrates brain', 'Stimulates metabolism', 'Natural morning alertness'],
  },
  {
    id: 'tpl-good-2',
    title: '10,000 Daily Steps',
    description: 'Keep baseline non-exercise activity thermogenesis (NEAT) high.',
    type: 'good',
    category: 'fitness',
    recommendedFrequency: 'daily',
    recommendedDays: [1, 2, 3, 4, 5, 6, 7],
    recommendedTime: '18:00',
    icon: 'Footprints',
    color: '#10b981',
    benefits: ['Burns 300-500 kcal', 'Lowers cortisol', 'Boosts cardiovascular health'],
  },
  {
    id: 'tpl-good-3',
    title: '90-Min Deep Focus Sprint',
    description: 'Work in uninterrupted flow state without notifications or tabs.',
    type: 'good',
    category: 'productivity',
    recommendedFrequency: 'weekdays',
    recommendedDays: [1, 2, 3, 4, 5],
    recommendedTime: '09:00',
    icon: 'Zap',
    color: '#7c3aed',
    benefits: ['10x output speed', 'Reduces context switching', 'Higher cognitive depth'],
  },
  {
    id: 'tpl-good-4',
    title: 'Read 20 Pages Non-Fiction',
    description: 'Compound knowledge daily in books on engineering, psychology, or craft.',
    type: 'good',
    category: 'learning',
    recommendedFrequency: 'daily',
    recommendedDays: [1, 2, 3, 4, 5, 6, 7],
    recommendedTime: '21:30',
    icon: 'BookOpen',
    color: '#f59e0b',
    benefits: ['Finish 25+ books a year', 'Expands vocabulary', 'Calms pre-sleep brain'],
  },
  {
    id: 'tpl-good-5',
    title: 'Evening Gratitude & Reflection',
    description: 'Write down 3 specific things you are grateful for and 1 key win.',
    type: 'good',
    category: 'mindfulness',
    recommendedFrequency: 'daily',
    recommendedDays: [1, 2, 3, 4, 5, 6, 7],
    recommendedTime: '22:00',
    icon: 'Heart',
    color: '#ec4899',
    benefits: ['Trains optimism bias', 'Reduces sleep latency', 'Improves life satisfaction'],
  },
  {
    id: 'tpl-good-6',
    title: 'Cold Shower / Morning Rinse',
    description: '2 minutes of cold water exposure for dopamine surge and alertness.',
    type: 'good',
    category: 'health',
    recommendedFrequency: 'daily',
    recommendedDays: [1, 2, 3, 4, 5, 6, 7],
    recommendedTime: '07:15',
    icon: 'Snowflake',
    color: '#06b6d4',
    benefits: ['250% dopamine baseline boost', 'Brown adipose activation', 'Mental grit'],
  },

  // Bad Habits to Quit
  {
    id: 'tpl-bad-1',
    title: 'Quit Vaping / Nicotine',
    description: 'Free your lungs and dopamine pathways from synthetic chemical spikes.',
    type: 'bad',
    category: 'bad_habit',
    badHabitCategory: 'nicotine',
    estimatedCostPerDay: 12.0,
    estimatedHoursWasted: 0.5,
    icon: 'CigaretteOff',
    color: '#ef4444',
    benefits: ['Save ~$4,300/year', 'Heart rate drops to normal', 'Restores lung cilia'],
  },
  {
    id: 'tpl-bad-2',
    title: 'Stop Doomscrolling & Reels',
    description: 'Break short-form video hypnosis (TikTok, IG Reels, YouTube Shorts).',
    type: 'bad',
    category: 'bad_habit',
    badHabitCategory: 'screen_time',
    estimatedCostPerDay: 0,
    estimatedHoursWasted: 2.5,
    icon: 'SmartphoneOff',
    color: '#8b5cf6',
    benefits: ['Reclaim ~900 hours/year', 'Restores deep attention span', 'Reduces anxiety'],
  },
  {
    id: 'tpl-bad-3',
    title: 'Zero Sugar & Sweetened Drinks',
    description: 'Eliminate sodas, energy drinks, and candies spiking your blood glucose.',
    type: 'bad',
    category: 'bad_habit',
    badHabitCategory: 'sugar_diet',
    estimatedCostPerDay: 6.0,
    estimatedHoursWasted: 0.2,
    icon: 'CandyOff',
    color: '#f97316',
    benefits: ['Steady all-day energy', 'Reduces visceral fat', 'Clearer skin'],
  },
  {
    id: 'tpl-bad-4',
    title: 'Quit Alcohol / Stay Sober',
    description: 'Eliminate neurotoxic ethanol, wake up fresh every single weekend.',
    type: 'bad',
    category: 'bad_habit',
    badHabitCategory: 'alcohol',
    estimatedCostPerDay: 15.0,
    estimatedHoursWasted: 3.0,
    icon: 'WineOff',
    color: '#dc2626',
    benefits: ['Deep restorative REM sleep', 'Save ~$5,400/year', 'Zero weekend hangovers'],
  },
  {
    id: 'tpl-bad-5',
    title: 'Stop Nail Biting & Picking',
    description: 'Break unconscious anxious fidgeting and allow your hands to heal.',
    type: 'bad',
    category: 'bad_habit',
    badHabitCategory: 'compulsive',
    estimatedCostPerDay: 0,
    estimatedHoursWasted: 0.5,
    icon: 'HandMetal',
    color: '#eab308',
    benefits: ['Healthy nailbeds', 'Prevents finger infections', 'Mindful self-regulation'],
  },
  {
    id: 'tpl-bad-6',
    title: 'Stop Procrastination (5-Min Rule)',
    description: 'End the delay habit: commit to just 5 minutes on the hardest task.',
    type: 'bad',
    category: 'bad_habit',
    badHabitCategory: 'other',
    estimatedCostPerDay: 0,
    estimatedHoursWasted: 2.0,
    icon: 'Hourglass',
    color: '#6366f1',
    benefits: ['Ends chronic guilt', 'Completes deliverables ahead of time', 'Climbs career faster'],
  },
];

/**
 * Generate 30 days of realistic history leading up to today
 */
export function generateInitialLogs(today: Date = new Date()): HabitCompletionLog[] {
  const logs: HabitCompletionLog[] = [];

  // Habit 1: consistent 14-day streak
  for (let i = 0; i < 28; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatLocalDate(d);
    if (i !== 16 && i !== 22) {
      logs.push({
        id: `log-h1-${dateStr}`,
        habitId: 'habit-1',
        date: dateStr,
        completedAt: `${dateStr}T07:15:00Z`,
      });
    }
  }

  // Habit 2: Weekdays
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const day = d.getDay();
    if (day >= 1 && day <= 5) {
      const dateStr = formatLocalDate(d);
      if (i !== 7) {
        logs.push({
          id: `log-h2-${dateStr}`,
          habitId: 'habit-2',
          date: dateStr,
          completedAt: `${dateStr}T10:00:00Z`,
        });
      }
    }
  }

  // Habit 3: Mon, Wed, Fri, Sat
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const isoDay = d.getDay() === 0 ? 7 : d.getDay();
    if ([1, 3, 5, 6].includes(isoDay)) {
      const dateStr = formatLocalDate(d);
      if (i !== 9 && i !== 18) {
        logs.push({
          id: `log-h3-${dateStr}`,
          habitId: 'habit-3',
          date: dateStr,
          completedAt: `${dateStr}T18:05:00Z`,
        });
      }
    }
  }

  // Habit 4: 21-day streak
  for (let i = 0; i < 21; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatLocalDate(d);
    logs.push({
      id: `log-h4-${dateStr}`,
      habitId: 'habit-4',
      date: dateStr,
      completedAt: `${dateStr}T21:12:00Z`,
    });
  }

  // Habit 5: Read
  for (let i = 1; i < 15; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatLocalDate(d);
    if (i !== 5) {
      logs.push({
        id: `log-h5-${dateStr}`,
        habitId: 'habit-5',
        date: dateStr,
        completedAt: `${dateStr}T22:00:00Z`,
      });
    }
  }

  return logs;
}
