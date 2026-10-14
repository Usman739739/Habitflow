/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import {
  Habit,
  HabitCompletionLog,
  HabitWithStatus,
  FrequencyType,
  HabitCategory,
  BadHabit,
  HabitTemplate,
} from './types/habit';
import {
  INITIAL_HABITS,
  INITIAL_BAD_HABITS,
  generateInitialLogs,
} from './data/sampleData';
import {
  calculateHabitStreaks,
  formatLocalDate,
  isHabitScheduledOn,
} from './utils/streakCalculator';
import { HeaderNav, ViewMode } from './components/HeaderNav';
import { AndroidDeviceFrame } from './components/android-preview/AndroidDeviceFrame';
import { AndroidCodeStudio } from './components/code-explorer/AndroidCodeStudio';
import { ANDROID_PROJECT_FILES } from './data/androidProjectFiles';
import {
  Cpu,
  Download,
  Flame,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habitflow_habits');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved habits', e);
      }
    }
    return INITIAL_HABITS;
  });

  const [badHabits, setBadHabits] = useState<BadHabit[]>(() => {
    const saved = localStorage.getItem('habitflow_bad_habits');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved bad habits', e);
      }
    }
    return INITIAL_BAD_HABITS;
  });

  const [completionLogs, setCompletionLogs] = useState<HabitCompletionLog[]>(() => {
    const saved = localStorage.getItem('habitflow_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved logs', e);
      }
    }
    return generateInitialLogs();
  });

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('habitflow_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Persist habits, bad habits, and logs
  useEffect(() => {
    localStorage.setItem('habitflow_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('habitflow_bad_habits', JSON.stringify(badHabits));
  }, [badHabits]);

  useEffect(() => {
    localStorage.setItem('habitflow_logs', JSON.stringify(completionLogs));
  }, [completionLogs]);

  useEffect(() => {
    localStorage.setItem('habitflow_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Screen size adjustment for default view mode
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setViewMode('device');
    }
  }, []);

  // Compute live habit status with streaks and date scheduling
  const selectedDateStr = formatLocalDate(selectedDate);
  const habitsWithStatus: HabitWithStatus[] = habits
    .filter((h) => !h.archived)
    .map((habit) => {
      const isCompletedToday = completionLogs.some(
        (log) => log.habitId === habit.id && log.date === selectedDateStr
      );
      const isScheduledToday = isHabitScheduledOn(habit, selectedDate);
      const streakStats = calculateHabitStreaks(habit, completionLogs, selectedDate);

      return {
        ...habit,
        isCompletedToday,
        isScheduledToday,
        streakStats,
      };
    });

  // Toggle habit completion for selected date
  const handleToggleHabit = (habitId: string) => {
    const alreadyDone = completionLogs.some(
      (log) => log.habitId === habitId && log.date === selectedDateStr
    );

    if (alreadyDone) {
      setCompletionLogs((prev) =>
        prev.filter((log) => !(log.habitId === habitId && log.date === selectedDateStr))
      );
    } else {
      const newLog: HabitCompletionLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        habitId,
        date: selectedDateStr,
        completedAt: new Date().toISOString(),
      };
      setCompletionLogs((prev) => [newLog, ...prev]);
    }
  };

  // Add or edit habit
  const handleSaveHabit = (data: {
    id?: string;
    title: string;
    description: string;
    category: HabitCategory;
    frequency: { type: FrequencyType; daysOfWeek: number[] };
    targetTime?: string;
    color: string;
  }) => {
    if (data.id) {
      setHabits((prev) =>
        prev.map((h) =>
          h.id === data.id
            ? {
                ...h,
                title: data.title,
                description: data.description,
                category: data.category,
                frequency: data.frequency,
                targetTime: data.targetTime,
                color: data.color,
              }
            : h
        )
      );
    } else {
      const newHabit: Habit = {
        id: `habit-${Date.now()}`,
        title: data.title,
        description: data.description,
        category: data.category,
        frequency: data.frequency,
        targetTime: data.targetTime,
        color: data.color,
        createdAt: formatLocalDate(new Date()),
        archived: false,
      };
      setHabits((prev) => [...prev, newHabit]);
    }
  };

  // Delete habit
  const handleDeleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    setCompletionLogs((prev) => prev.filter((l) => l.habitId !== habitId));
  };

  // Bad Habit: Log a Relapse
  const handleRelapse = (badHabitId: string, reason: string, reflection: string) => {
    setBadHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== badHabitId) return habit;

        const previousQuit = new Date(habit.quitDate).getTime();
        const diffDays = Math.floor((Date.now() - previousQuit) / (1000 * 86400));
        const newLongest = Math.max(habit.longestCleanDays, diffDays);

        const newRelapseLog = {
          id: `relapse-${Date.now()}`,
          badHabitId,
          timestamp: new Date().toISOString(),
          reason,
          reflection,
          daysCleanBefore: diffDays,
        };

        return {
          ...habit,
          quitDate: new Date().toISOString(), // Reset clock to now
          longestCleanDays: newLongest,
          relapses: [newRelapseLog, ...habit.relapses],
        };
      })
    );
  };

  // Bad Habit: Add new
  const handleAddBadHabit = (badHabitData: Omit<BadHabit, 'id' | 'relapses' | 'longestCleanDays'>) => {
    const newBadHabit: BadHabit = {
      ...badHabitData,
      id: `bad-${Date.now()}`,
      relapses: [],
      longestCleanDays: 0,
    };
    setBadHabits((prev) => [...prev, newBadHabit]);
  };

  // Bad Habit: Delete
  const handleDeleteBadHabit = (id: string) => {
    setBadHabits((prev) => prev.filter((b) => b.id !== id));
  };

  // Adopt from template: Good habit
  const handleAdoptTemplateGood = (tpl: HabitTemplate) => {
    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      title: tpl.title,
      description: tpl.description,
      category: tpl.category,
      frequency: {
        type: tpl.recommendedFrequency || 'daily',
        daysOfWeek: tpl.recommendedDays || [1, 2, 3, 4, 5, 6, 7],
      },
      targetTime: tpl.recommendedTime || '08:00',
      color: tpl.color,
      createdAt: formatLocalDate(new Date()),
      archived: false,
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  // Adopt from template: Bad habit to quit
  const handleAdoptTemplateBad = (tpl: HabitTemplate) => {
    const newBadHabit: BadHabit = {
      id: `bad-${Date.now()}`,
      title: tpl.title,
      reasonToQuit: tpl.description,
      category: tpl.badHabitCategory || 'other',
      quitDate: new Date().toISOString(),
      costPerDay: tpl.estimatedCostPerDay || 0,
      timeSpentPerDayHours: tpl.estimatedHoursWasted || 0,
      icon: tpl.icon,
      color: tpl.color,
      relapses: [],
      longestCleanDays: 0,
    };
    setBadHabits((prev) => [...prev, newBadHabit]);
  };

  // Reset to initial sample data
  const handleResetData = () => {
    setHabits(INITIAL_HABITS);
    setBadHabits(INITIAL_BAD_HABITS);
    setCompletionLogs(generateInitialLogs());
  };

  // Import data
  const handleImportData = (data: {
    habits: Habit[];
    completionLogs: HabitCompletionLog[];
    badHabits?: BadHabit[];
  }) => {
    setHabits(data.habits);
    setCompletionLogs(data.completionLogs);
    if (data.badHabits) setBadHabits(data.badHabits);
  };

  // Download complete Android Studio project zip
  const handleDownloadZip = async () => {
    try {
      const zip = new JSZip();
      const rootFolder = zip.folder('HabitFlow');
      if (rootFolder) {
        ANDROID_PROJECT_FILES.forEach((file) => {
          rootFolder.file(file.path, file.content);
        });
        rootFolder.file(
          'README.md',
          `# HabitFlow - Modern Android Compose Habit Tracker\n\nProduction-ready Android app with Good Habit tracking, Bad Habit Relapse Timers, Room Database, and MVVM Architecture.\n`
        );
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'HabitFlow-Android-Compose-Project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export zip', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navigation */}
      <HeaderNav
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onDownloadZip={handleDownloadZip}
        activeHabitCount={habits.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Architecture & Feature Pill Strip */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-sky-500" /> HabitFlow v1.2:
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold border border-sky-500/20 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> Positive Routines
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold border border-rose-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Bad Habit Relapse Clocks
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Curated Templates
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              className="flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export {ANDROID_PROJECT_FILES.length} Files as .ZIP</span>
            </button>
          </div>
        </div>

        {/* Dynamic View Modes */}
        {viewMode === 'device' && (
          <div className="max-w-md mx-auto">
            <AndroidDeviceFrame
              habits={habitsWithStatus}
              badHabits={badHabits}
              completionLogs={completionLogs}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onToggleHabit={handleToggleHabit}
              onSaveHabit={handleSaveHabit}
              onDeleteHabit={handleDeleteHabit}
              onRelapse={handleRelapse}
              onAddBadHabit={handleAddBadHabit}
              onDeleteBadHabit={handleDeleteBadHabit}
              onAdoptTemplateGood={handleAdoptTemplateGood}
              onAdoptTemplateBad={handleAdoptTemplateBad}
              isDark={isDark}
              onToggleTheme={() => setIsDark(!isDark)}
              onResetData={handleResetData}
              onImportData={handleImportData}
            />
          </div>
        )}

        {viewMode === 'code' && (
          <div className="w-full">
            <AndroidCodeStudio />
          </div>
        )}

        {viewMode === 'split' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Left: Android Pixel Device Frame */}
            <div className="xl:col-span-5 flex justify-center">
              <div className="sticky top-24 w-full max-w-[420px]">
                <AndroidDeviceFrame
                  habits={habitsWithStatus}
                  badHabits={badHabits}
                  completionLogs={completionLogs}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  onToggleHabit={handleToggleHabit}
                  onSaveHabit={handleSaveHabit}
                  onDeleteHabit={handleDeleteHabit}
                  onRelapse={handleRelapse}
                  onAddBadHabit={handleAddBadHabit}
                  onDeleteBadHabit={handleDeleteBadHabit}
                  onAdoptTemplateGood={handleAdoptTemplateGood}
                  onAdoptTemplateBad={handleAdoptTemplateBad}
                  isDark={isDark}
                  onToggleTheme={() => setIsDark(!isDark)}
                  onResetData={handleResetData}
                  onImportData={handleImportData}
                />
              </div>
            </div>

            {/* Right: Code Studio & File Explorer */}
            <div className="xl:col-span-7">
              <AndroidCodeStudio />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 transition-colors">
        <p>
          HabitFlow · Production-ready Android Jetpack Compose & Material Design 3 Habit Tracker with Relapse Timers.
        </p>
      </footer>
    </div>
  );
}
