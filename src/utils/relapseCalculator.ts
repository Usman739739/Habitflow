import { BadHabit, CleanTimeBreakdown } from '../types/habit';

export function calculateCleanTime(badHabit: BadHabit, now: Date = new Date()): CleanTimeBreakdown {
  const quitTime = new Date(badHabit.quitDate).getTime();
  const currentTime = now.getTime();
  const diffMs = Math.max(0, currentTime - quitTime);

  const totalSeconds = Math.floor(diffMs / 1000);
  const totalDaysFloat = totalSeconds / 86400;

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const moneySaved = badHabit.costPerDay
    ? Number((totalDaysFloat * badHabit.costPerDay).toFixed(2))
    : 0;

  const hoursReclaimed = badHabit.timeSpentPerDayHours
    ? Number((totalDaysFloat * badHabit.timeSpentPerDayHours).toFixed(1))
    : 0;

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    totalDaysFloat,
    moneySaved,
    hoursReclaimed,
  };
}

export interface QuitMilestone {
  id: string;
  title: string;
  targetSeconds: number; // in seconds
  label: string;
  description: string;
  badge: string;
}

export const QUIT_MILESTONES: QuitMilestone[] = [
  {
    id: 'qm-1',
    title: 'The First Hour',
    targetSeconds: 3600,
    label: '1 Hour',
    description: 'The hardest conscious decision is making the first move.',
    badge: 'Seedling',
  },
  {
    id: 'qm-2',
    title: 'Day One Defeated',
    targetSeconds: 86400,
    label: '24 Hours',
    description: 'Full 24-hour cycle completed. Your body is already detoxifying.',
    badge: 'CheckCircle2',
  },
  {
    id: 'qm-3',
    title: '72-Hour Peak Overcome',
    targetSeconds: 3 * 86400,
    label: '3 Days',
    description: 'Physical withdrawal cravings peak and begin declining rapidly.',
    badge: 'Flame',
  },
  {
    id: 'qm-4',
    title: '1-Week Freedom',
    targetSeconds: 7 * 86400,
    label: '7 Days',
    description: 'One full week clean. Sleep quality and nervous baseline stabilizing.',
    badge: 'ShieldCheck',
  },
  {
    id: 'qm-5',
    title: 'Two-Week Turning Point',
    targetSeconds: 14 * 86400,
    label: '14 Days',
    description: 'Habitual automation breaks down; new neural pathways take hold.',
    badge: 'Zap',
  },
  {
    id: 'qm-6',
    title: '30-Day Dopamine Reset',
    targetSeconds: 30 * 86400,
    label: '30 Days',
    description: 'Dopamine receptors resensitize. Natural enjoyment of daily life returns.',
    badge: 'Trophy',
  },
  {
    id: 'qm-7',
    title: '90-Day Neuro Reboot',
    targetSeconds: 90 * 86400,
    label: '90 Days',
    description: 'Full neuroplastic reboot. The former habit is now officially foreign.',
    badge: 'Crown',
  },
];
