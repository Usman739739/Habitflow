import React, { useState, useEffect } from 'react';
import {
  Flame,
  ShieldCheck,
  AlertCircle,
  Plus,
  RotateCcw,
  Sparkles,
  DollarSign,
  Clock,
  HeartPulse,
  Award,
  ChevronRight,
  X,
  Wind,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { BadHabit, RelapseLog } from '../../types/habit';
import { calculateCleanTime, QUIT_MILESTONES, QuitMilestone } from '../../utils/relapseCalculator';
import { triggerMilestoneConfetti } from '../../utils/confetti';

interface QuitTrackerScreenProps {
  badHabits: BadHabit[];
  onRelapse: (badHabitId: string, reason: string, reflection: string) => void;
  onAddBadHabit: (badHabit: Omit<BadHabit, 'id' | 'relapses' | 'longestCleanDays'>) => void;
  onDeleteBadHabit: (id: string) => void;
}

export const QuitTrackerScreen: React.FC<QuitTrackerScreenProps> = ({
  badHabits,
  onRelapse,
  onAddBadHabit,
  onDeleteBadHabit,
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    badHabits.length > 0 ? badHabits[0].id : ''
  );
  const [now, setNow] = useState<Date>(new Date());
  const [showRelapseModal, setShowRelapseModal] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for Relapse Modal
  const [relapseReason, setRelapseReason] = useState('Stress / Anxiety');
  const [relapseNote, setRelapseNote] = useState('');

  // Form states for Add Bad Habit Modal
  const [newTitle, setNewTitle] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newCategory, setNewCategory] = useState<BadHabit['category']>('screen_time');
  const [newCost, setNewCost] = useState('0');
  const [newHours, setNewHours] = useState('2.0');

  // SOS Breathing timer
  const [breathPhase, setBreathPhase] = useState<'Inhale (4s)' | 'Hold (7s)' | 'Exhale (8s)'>('Inhale (4s)');
  const [sosSecondsLeft, setSosSecondsLeft] = useState(60);

  // Ticking timer update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update selectedId if current is removed
  useEffect(() => {
    if (badHabits.length > 0 && !badHabits.some((b) => b.id === selectedId)) {
      setSelectedId(badHabits[0].id);
    }
  }, [badHabits, selectedId]);

  // Breathing loop when SOS modal is open
  useEffect(() => {
    if (!showSosModal) return;
    setSosSecondsLeft(60);

    const interval = setInterval(() => {
      setSosSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 19s breathing cycle (4s in, 7s hold, 8s out)
    const breathCycle = setInterval(() => {
      const sec = (Date.now() / 1000) % 19;
      if (sec < 4) setBreathPhase('Inhale (4s)');
      else if (sec < 11) setBreathPhase('Hold (7s)');
      else setBreathPhase('Exhale (8s)');
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(breathCycle);
    };
  }, [showSosModal]);

  const activeHabit = badHabits.find((b) => b.id === selectedId) || badHabits[0];

  if (!activeHabit) {
    return (
      <div className="p-6 text-center space-y-4">
        <h3 className="text-lg font-bold">No Bad Habits Tracked</h3>
        <p className="text-xs text-slate-500">
          Start tracking a habit you want to stop (e.g., vaping, doomscrolling, alcohol).
        </p>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold"
        >
          Add Bad Habit
        </button>
      </div>
    );
  }

  const cleanStats = calculateCleanTime(activeHabit, now);

  // Next milestone calculation
  const nextMilestone = QUIT_MILESTONES.find(
    (m) => m.targetSeconds > cleanStats.totalSeconds
  ) || QUIT_MILESTONES[QUIT_MILESTONES.length - 1];

  const milestoneProgress = Math.min(
    100,
    Math.round((cleanStats.totalSeconds / nextMilestone.targetSeconds) * 100)
  );

  const handleConfirmRelapse = () => {
    onRelapse(activeHabit.id, relapseReason, relapseNote);
    setShowRelapseModal(false);
    setRelapseNote('');
  };

  const handleCreateBadHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddBadHabit({
      title: newTitle.trim(),
      reasonToQuit: newReason.trim() || 'Regain health and mental freedom',
      category: newCategory,
      quitDate: new Date().toISOString(),
      costPerDay: parseFloat(newCost) || 0,
      timeSpentPerDayHours: parseFloat(newHours) || 0,
      icon: 'ShieldAlert',
      color: '#ef4444',
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewReason('');
  };

  return (
    <div className="space-y-4 pb-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Relapse & Clean Timer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time sobriety clock & craving management
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-xs font-semibold shadow-xs hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Target</span>
        </button>
      </div>

      {/* Habit Tabs Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {badHabits.map((habit) => {
          const isSelected = habit.id === activeHabit.id;
          return (
            <button
              key={habit.id}
              onClick={() => setSelectedId(habit.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{habit.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Relapse Timer Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white p-5 border border-rose-900/40 shadow-xl shadow-rose-950/20">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/80 px-2.5 py-1 rounded-full border border-rose-800/60 inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Current Clean Streak
            </span>

            <button
              onClick={() => onDeleteBadHabit(activeHabit.id)}
              title="Delete this habit"
              className="text-slate-400 hover:text-rose-400 p-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-100">{activeHabit.title}</h3>
            <p className="text-xs text-rose-200/80 line-clamp-1">{activeHabit.reasonToQuit}</p>
          </div>

          {/* Big Digital Clock Display */}
          <div className="grid grid-cols-4 gap-2 text-center py-2">
            <div className="bg-slate-900/80 rounded-2xl p-2.5 border border-slate-800">
              <div className="text-2xl font-black font-mono tracking-tight text-white tabular-nums">
                {cleanStats.days}
              </div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                Days
              </div>
            </div>

            <div className="bg-slate-900/80 rounded-2xl p-2.5 border border-slate-800">
              <div className="text-2xl font-black font-mono tracking-tight text-white tabular-nums">
                {String(cleanStats.hours).padStart(2, '0')}
              </div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                Hours
              </div>
            </div>

            <div className="bg-slate-900/80 rounded-2xl p-2.5 border border-slate-800">
              <div className="text-2xl font-black font-mono tracking-tight text-white tabular-nums">
                {String(cleanStats.minutes).padStart(2, '0')}
              </div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                Mins
              </div>
            </div>

            <div className="bg-rose-950/40 rounded-2xl p-2.5 border border-rose-800/60 ring-1 ring-rose-500/30">
              <div className="text-2xl font-black font-mono tracking-tight text-rose-400 tabular-nums animate-pulse">
                {String(cleanStats.seconds).padStart(2, '0')}
              </div>
              <div className="text-[9px] font-bold text-rose-300 uppercase tracking-wider mt-0.5">
                Secs
              </div>
            </div>
          </div>

          {/* Progress bar towards next milestone */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">
                Next: <strong>{nextMilestone.label}</strong> ({nextMilestone.title})
              </span>
              <span className="text-rose-400 font-bold tabular-nums">{milestoneProgress}%</span>
            </div>
            <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
              <div
                style={{ width: `${milestoneProgress}%` }}
                className="bg-gradient-to-r from-rose-500 to-amber-400 h-full rounded-full transition-all duration-500"
              />
            </div>
          </div>

          {/* Action Buttons: Relapse Log & Craving SOS */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setShowSosModal(true)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <Wind className="w-4 h-4" />
              <span>Urge SOS (60s)</span>
            </button>

            <button
              onClick={() => setShowRelapseModal(true)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-rose-300 font-semibold text-xs border border-rose-500/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>I Relapsed</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recovered Value KPIs */}
      <div className="grid grid-cols-3 gap-2">
        {activeHabit.costPerDay ? (
          <div className="rounded-2xl p-3 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs">
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-1">
              <DollarSign className="w-3.5 h-3.5" /> Saved
            </div>
            <div className="text-lg font-black text-slate-800 dark:text-slate-100 tabular-nums">
              ${cleanStats.moneySaved}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Money kept</div>
          </div>
        ) : null}

        {activeHabit.timeSpentPerDayHours ? (
          <div className="rounded-2xl p-3 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs">
            <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 text-xs font-semibold mb-1">
              <Clock className="w-3.5 h-3.5" /> Time Reclaimed
            </div>
            <div className="text-lg font-black text-slate-800 dark:text-slate-100 tabular-nums">
              {cleanStats.hoursReclaimed}h
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Focus restored</div>
          </div>
        ) : null}

        <div className="rounded-2xl p-3 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs">
          <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 text-xs font-semibold mb-1">
            <Flame className="w-3.5 h-3.5" /> Record
          </div>
          <div className="text-lg font-black text-slate-800 dark:text-slate-100 tabular-nums">
            {Math.max(cleanStats.days, activeHabit.longestCleanDays)}d
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Best clean run</div>
        </div>
      </div>

      {/* Milestone Checkpoints */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-rose-500" />
            Sobriety Milestones
          </h3>
          <span className="text-xs text-slate-400">
            {QUIT_MILESTONES.filter((m) => cleanStats.totalSeconds >= m.targetSeconds).length} of{' '}
            {QUIT_MILESTONES.length} unlocked
          </span>
        </div>

        <div className="space-y-1.5">
          {QUIT_MILESTONES.map((m) => {
            const isUnlocked = cleanStats.totalSeconds >= m.targetSeconds;
            return (
              <div
                key={m.id}
                onClick={() => {
                  if (isUnlocked) triggerMilestoneConfetti();
                }}
                className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                  isUnlocked
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60 cursor-pointer'
                    : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 opacity-60'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isUnlocked
                      ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {m.title}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isUnlocked
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                      }`}
                    >
                      {m.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {m.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Relapse Logs History */}
      {activeHabit.relapses.length > 0 && (
        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Relapse Learning History ({activeHabit.relapses.length})
          </h3>
          <div className="space-y-2">
            {activeHabit.relapses.map((relapse) => (
              <div
                key={relapse.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-rose-600 dark:text-rose-400">Trigger: {relapse.reason}</span>
                  <span className="text-slate-400 text-[10px]">
                    After {relapse.daysCleanBefore}d clean
                  </span>
                </div>
                {relapse.reflection && (
                  <p className="text-slate-600 dark:text-slate-300 italic">
                    "{relapse.reflection}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- MODAL 1: I RELAPSED (Compassionate Logging) --- */}
      {showRelapseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Slip-up Check-in
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Relapses are learning data, not defeat.
                </p>
              </div>
              <button
                onClick={() => setShowRelapseModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  What triggered the urge?
                </label>
                <select
                  value={relapseReason}
                  onChange={(e) => setRelapseReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option>Stress / High Cortisol</option>
                  <option>Boredom / Understimulated</option>
                  <option>Social Cue / Friends doing it</option>
                  <option>Exhaustion / Sleep Deprivation</option>
                  <option>Habitual reflex (automatic reach)</option>
                  <option>Other trigger</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  What will you do differently next time?
                </label>
                <textarea
                  value={relapseNote}
                  onChange={(e) => setRelapseNote(e.target.value)}
                  placeholder="e.g. Keep vape out of house, use 60s breathing tool..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowRelapseModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRelapse}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
              >
                Reset Clock & Restart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: URGE SOS SURFING (4-7-8 Breathing Tool) --- */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 rounded-3xl p-6 border border-slate-800 text-white text-center space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                Craving Urge Surfing
              </span>
              <button onClick={() => setShowSosModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Brain cravings peak at <strong>3 minutes</strong> then naturally subside. Ride the wave
              with controlled breath:
            </p>

            {/* Breathing Animation Circle */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/20 to-rose-500/30 transition-all duration-1000 ${
                  breathPhase.startsWith('Inhale')
                    ? 'scale-110 ring-4 ring-amber-400/50'
                    : breathPhase.startsWith('Hold')
                    ? 'scale-105 ring-2 ring-rose-400/50'
                    : 'scale-90 opacity-40'
                }`}
              />

              <div className="relative z-10 space-y-1">
                <div className="text-base font-black text-amber-300">{breathPhase}</div>
                <div className="text-3xl font-mono font-bold text-white tabular-nums">
                  {sosSecondsLeft}s
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              "You are not your craving. It is just a temporary chemical fluctuation."
            </p>

            <button
              onClick={() => setShowSosModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
            >
              I Rode the Wave / Craving Passed
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL 3: ADD NEW BAD HABIT --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Track a Bad Habit to Stop
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBadHabit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Habit to Stop *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Quit Vaping / Stop Binge Eating"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Your Strong "Why"
                </label>
                <input
                  type="text"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="e.g. Better lung health, save $300/mo"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Daily Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Daily Hours Lost
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newHours}
                    onChange={(e) => setNewHours(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
                >
                  Start Clean Clock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
