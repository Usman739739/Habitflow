import React, { useRef } from 'react';
import {
  Moon,
  Sun,
  Bell,
  Download,
  Upload,
  RotateCcw,
  Smartphone,
  Layers,
  Code2,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { Habit, HabitCompletionLog } from '../../types/habit';

interface SettingsScreenProps {
  isDark: boolean;
  onToggleTheme: () => void;
  habits: Habit[];
  completionLogs: HabitCompletionLog[];
  onResetData: () => void;
  onImportData: (data: { habits: Habit[]; completionLogs: HabitCompletionLog[] }) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  isDark,
  onToggleTheme,
  habits,
  completionLogs,
  onResetData,
  onImportData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJson = () => {
    const exportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      habits,
      completionLogs,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `habitflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.habits && Array.isArray(json.habits)) {
          onImportData({
            habits: json.habits,
            completionLogs: json.completionLogs || [],
          });
        }
      } catch (err) {
        console.error('Failed to import JSON', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-5 pb-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
          Settings & Preferences
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Theme appearance, data management, and architecture specs
        </p>
      </div>

      {/* Preferences Section */}
      <div className="rounded-2xl p-4 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Preferences
        </h3>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
              {isDark ? <Moon className="w-4 h-4 text-sky-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Material 3 Theme
              </h4>
              <p className="text-xs text-slate-400">
                {isDark ? 'Dark Theme (Night mode)' : 'Light Theme (Day mode)'}
              </p>
            </div>
          </div>
          <button
            onClick={onToggleTheme}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              isDark ? 'bg-sky-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                isDark ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Reminders Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
              <Bell className="w-4 h-4 text-sky-500" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Alarm Reminders
              </h4>
              <p className="text-xs text-slate-400">Exact habit alarm notifications</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
            Active
          </span>
        </div>
      </div>

      {/* Data Management */}
      <div className="rounded-2xl p-4 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Data & Local Storage
        </h3>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleExportJson}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-500" />
            Backup JSON
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-purple-500" />
            Restore JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <button
          onClick={onResetData}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold text-rose-600 dark:text-rose-400 transition-colors mt-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset to Sample Data & History
        </button>
      </div>

      {/* Tech Architecture Badge */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-900 to-sky-950 text-white shadow-md border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <Smartphone className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-300">
            Native Android Architecture
          </h3>
        </div>

        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span><strong>UI:</strong> Jetpack Compose + Material 3 Dynamic Colors</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span><strong>Architecture:</strong> MVVM with StateFlow & UDF</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span><strong>Persistence:</strong> Room Database (Entity, DAO, Flow)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span><strong>Date Engine:</strong> java.time API (LocalDate & Streaks)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
