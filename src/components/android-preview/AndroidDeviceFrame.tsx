import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  BarChart2,
  Settings,
  Plus,
  Wifi,
  Battery,
  Signal,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import {
  HabitWithStatus,
  HabitCategory,
  HabitCompletionLog,
  BadHabit,
  HabitTemplate,
} from '../../types/habit';
import { WeekCalendarStrip } from './WeekCalendarStrip';
import { DailyProgressCard } from './DailyProgressCard';
import { HabitCard } from './HabitCard';
import { AnalyticsScreen } from './AnalyticsScreen';
import { SettingsScreen } from './SettingsScreen';
import { AddEditHabitModal } from './AddEditHabitModal';
import { QuitTrackerScreen } from './QuitTrackerScreen';
import { HabitLibraryScreen } from './HabitLibraryScreen';
import { triggerCompletionConfetti } from '../../utils/confetti';

interface AndroidDeviceFrameProps {
  habits: HabitWithStatus[];
  badHabits: BadHabit[];
  completionLogs: HabitCompletionLog[];
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  onToggleHabit: (habitId: string) => void;
  onSaveHabit: (data: any) => void;
  onDeleteHabit: (id: string) => void;
  onRelapse: (badHabitId: string, reason: string, note: string) => void;
  onAddBadHabit: (badHabit: any) => void;
  onDeleteBadHabit: (id: string) => void;
  onAdoptTemplateGood: (tpl: HabitTemplate) => void;
  onAdoptTemplateBad: (tpl: HabitTemplate) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onResetData: () => void;
  onImportData: (data: any) => void;
}

export const AndroidDeviceFrame: React.FC<AndroidDeviceFrameProps> = ({
  habits,
  badHabits,
  completionLogs,
  selectedDate,
  onSelectDate,
  onToggleHabit,
  onSaveHabit,
  onDeleteHabit,
  onRelapse,
  onAddBadHabit,
  onDeleteBadHabit,
  onAdoptTemplateGood,
  onAdoptTemplateBad,
  isDark,
  onToggleTheme,
  onResetData,
  onImportData,
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'quit' | 'catalog' | 'analytics' | 'settings'>('today');
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<HabitWithStatus | null>(null);

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Filter habits for current selected date and category/search
  const scheduledHabits = habits.filter((h) => h.isScheduledToday);
  const completedTodayCount = scheduledHabits.filter((h) => h.isCompletedToday).length;
  const totalCount = scheduledHabits.length;
  const dailyProgress = totalCount > 0 ? Math.round((completedTodayCount / totalCount) * 100) : 0;

  const filteredHabits = scheduledHabits.filter((h) => {
    if (selectedCategory !== 'all' && h.category !== selectedCategory) return false;
    if (
      searchQuery &&
      !h.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !h.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const bestStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streakStats.longestStreak)) : 0;
  const overallConsistency =
    habits.length > 0
      ? Math.round(habits.reduce((acc, h) => acc + h.streakStats.completionRate, 0) / habits.length)
      : 0;

  // Map of completed dates count for calendar strip dots
  const completedDatesMap: Record<string, number> = {};
  completionLogs.forEach((log) => {
    completedDatesMap[log.date] = (completedDatesMap[log.date] || 0) + 1;
  });

  const handleToggle = (id: string) => {
    const habit = habits.find((h) => h.id === id);
    const willBeCompleted = !habit?.isCompletedToday;
    onToggleHabit(id);

    if (willBeCompleted && completedTodayCount + 1 >= totalCount) {
      triggerCompletionConfetti();
    }
  };

  const handleOpenAdd = () => {
    setHabitToEdit(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (habit: HabitWithStatus) => {
    setHabitToEdit(habit);
    setIsAddEditOpen(true);
  };

  return (
    <div className={`relative mx-auto flex items-center justify-center p-1 sm:p-3 select-none ${isDark ? 'dark' : ''}`}>
      {/* Phone Outer Chassis (Pixel 9 style) */}
      <div className="relative w-full max-w-[410px] h-[790px] bg-slate-900 rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800 shadow-slate-950/50 flex flex-col justify-between">
        {/* Hardware side buttons */}
        <div className="absolute -left-[5px] top-28 w-[5px] h-12 bg-slate-700 rounded-l-sm" />
        <div className="absolute -left-[5px] top-44 w-[5px] h-12 bg-slate-700 rounded-l-sm" />
        <div className="absolute -right-[5px] top-32 w-[5px] h-16 bg-slate-700 rounded-r-sm" />

        {/* Screen Bezel */}
        <div className="relative w-full h-full bg-slate-50 dark:bg-slate-950 rounded-[40px] overflow-hidden flex flex-col border border-slate-800/80">
          {/* Top Status Bar */}
          <div className="h-10 px-6 flex items-center justify-between text-xs text-slate-800 dark:text-slate-200 z-20 shrink-0 font-medium">
            <span className="font-semibold">{currentTime}</span>

            {/* Front Camera Punch-hole */}
            <div className="w-3.5 h-3.5 bg-black rounded-full ring-2 ring-slate-800 mx-auto" />

            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Screen Content Body */}
          <div className="flex-1 overflow-y-auto px-4 pt-1 pb-20 scrollbar-none">
            {activeTab === 'today' && (
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      Today
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {selectedDate.toLocaleDateString(undefined, {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-full text-xs font-semibold shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                {/* Calendar Strip */}
                <WeekCalendarStrip
                  selectedDate={selectedDate}
                  onSelectDate={onSelectDate}
                  completedDatesCountMap={completedDatesMap}
                />

                {/* Progress Card */}
                <DailyProgressCard
                  completedCount={completedTodayCount}
                  totalCount={totalCount}
                  percentage={dailyProgress}
                />

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {(['all', 'health', 'productivity', 'fitness', 'mindfulness', 'learning'] as const).map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-xs font-semibold px-3 py-1 rounded-full capitalize whitespace-nowrap transition-all ${
                          selectedCategory === cat
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>

                {/* Habit Cards List */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>Scheduled Today ({filteredHabits.length})</span>
                    <span>{completedTodayCount}/{totalCount} Done</span>
                  </div>

                  {filteredHabits.length === 0 ? (
                    <div className="text-center py-10 px-4 bg-white dark:bg-slate-800/60 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {searchQuery
                          ? 'No habits match your search.'
                          : 'No habits scheduled for this day.'}
                      </p>
                      <button
                        onClick={handleOpenAdd}
                        className="mt-2.5 inline-flex items-center gap-1 px-3 py-1.5 bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 rounded-xl text-xs font-bold border border-sky-200 dark:border-sky-800"
                      >
                        <Plus className="w-3.5 h-3.5" /> Create a Habit
                      </button>
                    </div>
                  ) : (
                    filteredHabits.map((habit) => (
                      <HabitCard
                        key={habit.id}
                        habit={habit}
                        onToggle={handleToggle}
                        onEdit={handleOpenEdit}
                        onDelete={onDeleteHabit}
                      />
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'quit' && (
              <QuitTrackerScreen
                badHabits={badHabits}
                onRelapse={onRelapse}
                onAddBadHabit={onAddBadHabit}
                onDeleteBadHabit={onDeleteBadHabit}
              />
            )}

            {activeTab === 'catalog' && (
              <HabitLibraryScreen
                existingHabits={habits}
                existingBadHabits={badHabits}
                onAdoptGoodHabit={(tpl) => {
                  onAdoptTemplateGood(tpl);
                  setActiveTab('today');
                }}
                onAdoptBadHabit={(tpl) => {
                  onAdoptTemplateBad(tpl);
                  setActiveTab('quit');
                }}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsScreen
                habits={habits}
                completionLogs={completionLogs}
                overallConsistency={overallConsistency}
                bestStreak={bestStreak}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsScreen
                isDark={isDark}
                onToggleTheme={onToggleTheme}
                habits={habits}
                completionLogs={completionLogs}
                onResetData={onResetData}
                onImportData={onImportData}
              />
            )}
          </div>

          {/* Floating Action Button (Only on Today screen) */}
          {activeTab === 'today' && (
            <button
              onClick={handleOpenAdd}
              aria-label="Add Habit"
              className="absolute right-5 bottom-20 z-30 w-13 h-13 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-600/40 hover:scale-105 transition-all"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          )}

          {/* Material 3 Bottom Navigation Bar with 5 tabs */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 flex items-center justify-around z-20">
            <button
              onClick={() => setActiveTab('today')}
              className={`flex flex-col items-center gap-0.5 transition-all ${
                activeTab === 'today'
                  ? 'text-sky-600 dark:text-sky-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium'
              }`}
            >
              <div
                className={`px-3 py-0.5 rounded-full transition-colors ${
                  activeTab === 'today' ? 'bg-sky-100 dark:bg-sky-950/80' : ''
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
              </div>
              <span className="text-[9px]">Today</span>
            </button>

            <button
              onClick={() => setActiveTab('quit')}
              className={`flex flex-col items-center gap-0.5 transition-all ${
                activeTab === 'quit'
                  ? 'text-rose-600 dark:text-rose-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium'
              }`}
            >
              <div
                className={`px-3 py-0.5 rounded-full transition-colors ${
                  activeTab === 'quit' ? 'bg-rose-100 dark:bg-rose-950/80' : ''
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="text-[9px]">Quit & Relapse</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex flex-col items-center gap-0.5 transition-all ${
                activeTab === 'catalog'
                  ? 'text-amber-600 dark:text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium'
              }`}
            >
              <div
                className={`px-3 py-0.5 rounded-full transition-colors ${
                  activeTab === 'catalog' ? 'bg-amber-100 dark:bg-amber-950/80' : ''
                }`}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-[9px]">Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex flex-col items-center gap-0.5 transition-all ${
                activeTab === 'analytics'
                  ? 'text-sky-600 dark:text-sky-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium'
              }`}
            >
              <div
                className={`px-3 py-0.5 rounded-full transition-colors ${
                  activeTab === 'analytics' ? 'bg-sky-100 dark:bg-sky-950/80' : ''
                }`}
              >
                <BarChart2 className="w-4 h-4" />
              </div>
              <span className="text-[9px]">Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center gap-0.5 transition-all ${
                activeTab === 'settings'
                  ? 'text-sky-600 dark:text-sky-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium'
              }`}
            >
              <div
                className={`px-3 py-0.5 rounded-full transition-colors ${
                  activeTab === 'settings' ? 'bg-sky-100 dark:bg-sky-950/80' : ''
                }`}
              >
                <Settings className="w-4 h-4" />
              </div>
              <span className="text-[9px]">Settings</span>
            </button>
          </div>

          {/* Android Navigation Bar gesture pill */}
          <div className="absolute bottom-1 inset-x-0 flex justify-center z-30 pointer-events-none">
            <div className="w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
          </div>
        </div>
      </div>

      {/* Add / Edit Habit Modal Bottom Sheet */}
      <AddEditHabitModal
        isOpen={isAddEditOpen}
        habitToEdit={habitToEdit}
        onClose={() => {
          setIsAddEditOpen(false);
          setHabitToEdit(null);
        }}
        onSave={(data) => {
          onSaveHabit(data);
          setIsAddEditOpen(false);
          setHabitToEdit(null);
        }}
      />
    </div>
  );
};
