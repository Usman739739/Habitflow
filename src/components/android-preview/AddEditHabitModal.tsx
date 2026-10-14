import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, Clock } from 'lucide-react';
import { HabitCategory, FrequencyType, HabitWithStatus } from '../../types/habit';

interface AddEditHabitModalProps {
  isOpen: boolean;
  habitToEdit: HabitWithStatus | null;
  onClose: () => void;
  onSave: (habitData: {
    id?: string;
    title: string;
    description: string;
    category: HabitCategory;
    frequency: { type: FrequencyType; daysOfWeek: number[] };
    targetTime?: string;
    color: string;
  }) => void;
}

const CATEGORIES: { id: HabitCategory; label: string; icon: string; color: string }[] = [
  { id: 'health', label: 'Health', icon: '💧', color: '#0284c7' },
  { id: 'productivity', label: 'Productivity', icon: '⚡', color: '#7c3aed' },
  { id: 'fitness', label: 'Fitness', icon: '💪', color: '#ea580c' },
  { id: 'mindfulness', label: 'Mindfulness', icon: '🧘', color: '#10b981' },
  { id: 'learning', label: 'Learning', icon: '📚', color: '#f59e0b' },
  { id: 'finance', label: 'Finance', icon: '💰', color: '#059669' },
];

const PRESET_COLORS = ['#0284c7', '#7c3aed', '#ea580c', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#14b8a6'];

const DAYS_OF_WEEK = [
  { day: 1, label: 'M' },
  { day: 2, label: 'T' },
  { day: 3, label: 'W' },
  { day: 4, label: 'T' },
  { day: 5, label: 'F' },
  { day: 6, label: 'S' },
  { day: 7, label: 'S' },
];

export const AddEditHabitModal: React.FC<AddEditHabitModalProps> = ({
  isOpen,
  habitToEdit,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('health');
  const [frequencyType, setFrequencyType] = useState<FrequencyType>('daily');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);
  const [targetTime, setTargetTime] = useState('08:00');
  const [selectedColor, setSelectedColor] = useState('#0284c7');
  const [error, setError] = useState('');

  useEffect(() => {
    if (habitToEdit) {
      setTitle(habitToEdit.title);
      setDescription(habitToEdit.description || '');
      setCategory(habitToEdit.category);
      setFrequencyType(habitToEdit.frequency.type);
      setSelectedDays(habitToEdit.frequency.daysOfWeek);
      setTargetTime(habitToEdit.targetTime || '08:00');
      setSelectedColor(habitToEdit.color);
    } else {
      setTitle('');
      setDescription('');
      setCategory('health');
      setFrequencyType('daily');
      setSelectedDays([1, 2, 3, 4, 5, 6, 7]);
      setTargetTime('08:00');
      setSelectedColor('#0284c7');
    }
    setError('');
  }, [habitToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFrequencyChange = (type: FrequencyType) => {
    setFrequencyType(type);
    if (type === 'daily') setSelectedDays([1, 2, 3, 4, 5, 6, 7]);
    else if (type === 'weekdays') setSelectedDays([1, 2, 3, 4, 5]);
    else if (type === 'weekends') setSelectedDays([6, 7]);
  };

  const toggleCustomDay = (day: number) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length === 1) return; // Must have at least 1 day
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day].sort());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Habit title is required');
      return;
    }

    onSave({
      id: habitToEdit?.id,
      title: title.trim(),
      description: description.trim(),
      category,
      frequency: {
        type: frequencyType,
        daysOfWeek: selectedDays,
      },
      targetTime: targetTime || undefined,
      color: selectedColor,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl border-t border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle indicator */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-3" />

        <div className="px-6 pb-6 pt-1">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {habitToEdit ? 'Edit Habit' : 'Create New Habit'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Define your routine, cadence, and reminders
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Habit Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (e.target.value.trim()) setError('');
                }}
                placeholder="e.g. Read 20 pages of book"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              {error && <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Why does this habit matter to you?"
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => {
                        setCategory(cat.id);
                        setSelectedColor(cat.color);
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-semibold ring-1 ring-sky-500'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Frequency selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Frequency
              </label>
              <div className="grid grid-cols-4 gap-1.5 mb-2.5">
                {(['daily', 'weekdays', 'weekends', 'custom'] as FrequencyType[]).map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => handleFrequencyChange(type)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-medium capitalize border transition-all ${
                      frequencyType === type
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-semibold ring-1 ring-sky-500'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Custom days pills if custom or for visual reference */}
              {frequencyType === 'custom' && (
                <div className="flex items-center justify-between gap-1 mt-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                  {DAYS_OF_WEEK.map((item) => {
                    const active = selectedDays.includes(item.day);
                    return (
                      <button
                        type="button"
                        key={item.day}
                        onClick={() => toggleCustomDay(item.day)}
                        className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                          active
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Target Time */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Time / Daily Reminder
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="time"
                  value={targetTime}
                  onChange={(e) => setTargetTime(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Color Accent Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Theme Color
              </label>
              <div className="flex items-center gap-2">
                {PRESET_COLORS.map((hex) => (
                  <button
                    type="button"
                    key={hex}
                    onClick={() => setSelectedColor(hex)}
                    style={{ backgroundColor: hex }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      selectedColor === hex
                        ? 'ring-2 ring-offset-2 ring-slate-800 dark:ring-offset-slate-900 dark:ring-white scale-110 shadow-sm'
                        : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {selectedColor === hex && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-md shadow-sky-600/25 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                {habitToEdit ? 'Save Changes' : 'Create Habit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
