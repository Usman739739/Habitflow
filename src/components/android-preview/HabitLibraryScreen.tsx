import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Check,
  Flame,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Clock,
  DollarSign,
  Heart,
  Droplets,
  BookOpen,
  Zap,
  Snowflake,
  Hourglass,
  Layers,
  PhoneOff,
  Ban,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import { HabitTemplate, Habit, BadHabit } from '../../types/habit';
import { BUILT_IN_TEMPLATES } from '../../data/sampleData';

interface HabitLibraryScreenProps {
  existingHabits: Habit[];
  existingBadHabits: BadHabit[];
  onAdoptGoodHabit: (template: HabitTemplate) => void;
  onAdoptBadHabit: (template: HabitTemplate) => void;
}

export const HabitLibraryScreen: React.FC<HabitLibraryScreenProps> = ({
  existingHabits,
  existingBadHabits,
  onAdoptGoodHabit,
  onAdoptBadHabit,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'good' | 'bad'>('all');

  const filteredTemplates = BUILT_IN_TEMPLATES.filter((tpl) => {
    if (filterType === 'good') return tpl.type === 'good';
    if (filterType === 'bad') return tpl.type === 'bad';
    return true;
  });

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-sky-500" />;
      case 'Footprints':
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-purple-500" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-amber-500" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-rose-500" />;
      case 'Snowflake':
        return <Snowflake className="w-5 h-5 text-cyan-500" />;
      case 'CigaretteOff':
        return <Ban className="w-5 h-5 text-rose-500" />;
      case 'SmartphoneOff':
        return <PhoneOff className="w-5 h-5 text-purple-500" />;
      case 'CandyOff':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'WineOff':
        return <Ban className="w-5 h-5 text-red-600" />;
      case 'HandMetal':
        return <Activity className="w-5 h-5 text-amber-500" />;
      case 'Hourglass':
        return <Hourglass className="w-5 h-5 text-indigo-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-sky-500" />;
    }
  };

  return (
    <div className="space-y-4 pb-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          Habit Template Catalog
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          World's most effective positive routines & bad habits to stop
        </p>
      </div>

      {/* Filter Segmented Control */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl">
        <button
          onClick={() => setFilterType('all')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterType === 'all'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          All ({BUILT_IN_TEMPLATES.length})
        </button>
        <button
          onClick={() => setFilterType('good')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterType === 'good'
              ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Positive Routines
        </button>
        <button
          onClick={() => setFilterType('bad')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterType === 'bad'
              ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Bad Habits to Quit
        </button>
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        {filteredTemplates.map((tpl) => {
          const isGood = tpl.type === 'good';
          const isAlreadyTracked = isGood
            ? existingHabits.some((h) => h.title.toLowerCase() === tpl.title.toLowerCase())
            : existingBadHabits.some((b) => b.title.toLowerCase() === tpl.title.toLowerCase());

          return (
            <div
              key={tpl.id}
              className={`rounded-2xl p-4 border transition-all ${
                isGood
                  ? 'bg-white dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700/80 hover:border-sky-300'
                  : 'bg-white dark:bg-slate-800/90 border-rose-200/70 dark:border-rose-900/50 hover:border-rose-400'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    isGood
                      ? 'bg-sky-50 dark:bg-sky-950/60 ring-1 ring-sky-200 dark:ring-sky-800'
                      : 'bg-rose-50 dark:bg-rose-950/60 ring-1 ring-rose-200 dark:ring-rose-800'
                  }`}
                >
                  {renderIcon(tpl.icon)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {tpl.title}
                    </h3>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isGood
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {isGood ? 'Positive Habit' : 'Quit Target'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {tpl.description}
                  </p>

                  {/* Highlights & Benefits */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {tpl.benefits.map((benefit, i) => (
                      <span
                        key={i}
                        className="text-[10px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-md"
                      >
                        ✓ {benefit}
                      </span>
                    ))}
                  </div>

                  {/* Estimated Savings if bad habit */}
                  {!isGood && (tpl.estimatedCostPerDay || tpl.estimatedHoursWasted) ? (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-3 text-xs text-slate-500">
                      {tpl.estimatedCostPerDay ? (
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" /> Saves ~${tpl.estimatedCostPerDay * 30}/mo
                        </span>
                      ) : null}
                      {tpl.estimatedHoursWasted ? (
                        <span className="font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Reclaims ~{tpl.estimatedHoursWasted}h/day
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  {/* Adopt Button */}
                  <div className="mt-3">
                    <button
                      onClick={() => {
                        if (isAlreadyTracked) return;
                        if (isGood) onAdoptGoodHabit(tpl);
                        else onAdoptBadHabit(tpl);
                      }}
                      disabled={isAlreadyTracked}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        isAlreadyTracked
                          ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-default'
                          : isGood
                          ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-xs'
                          : 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs'
                      }`}
                    >
                      {isAlreadyTracked ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Already in Your Routine</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isGood ? 'Adopt This Habit' : 'Start Sobriety Clock'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
