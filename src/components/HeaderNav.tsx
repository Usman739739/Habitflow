import React from 'react';
import {
  Smartphone,
  Code2,
  Columns,
  Moon,
  Sun,
  Download,
  Flame,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export type ViewMode = 'device' | 'code' | 'split';

interface HeaderNavProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onDownloadZip: () => void;
  activeHabitCount: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  viewMode,
  onViewModeChange,
  isDark,
  onToggleTheme,
  onDownloadZip,
  activeHabitCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                HabitFlow
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Android Jetpack Compose
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Material 3 · Room SQLite · MVVM StateFlow · java.time
            </p>
          </div>
        </div>

        {/* View Switcher (Device / Split / Code) */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700">
          <button
            onClick={() => onViewModeChange('device')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'device'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>App Preview</span>
          </button>

          <button
            onClick={() => onViewModeChange('split')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'split'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split View</span>
          </button>

          <button
            onClick={() => onViewModeChange('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'code'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Source Code</span>
          </button>
        </div>

        {/* Right Actions: Download Zip & Theme Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onDownloadZip}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-bold shadow-xs transition-all"
            title="Download full Android Studio project as .zip"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Get Project .ZIP</span>
          </button>

          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Dark / Light Mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
