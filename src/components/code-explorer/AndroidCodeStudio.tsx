import React, { useState } from 'react';
import {
  FileCode,
  Folder,
  FolderOpen,
  Copy,
  Check,
  Download,
  Search,
  ExternalLink,
  Archive,
  Layers,
  Sparkles,
} from 'lucide-react';
import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES, AndroidFile } from '../../data/androidProjectFiles';

export const AndroidCodeStudio: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>(
    'app/src/main/java/com/example/habitflow/ui/screen/home/HomeScreen.kt'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const selectedFile =
    ANDROID_PROJECT_FILES.find((f) => f.path === selectedFilePath) ||
    ANDROID_PROJECT_FILES[0];

  const filteredFiles = ANDROID_PROJECT_FILES.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.packageGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingleFile = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Add all project files into root HabitFlow/
      const rootFolder = zip.folder('HabitFlow');
      if (rootFolder) {
        ANDROID_PROJECT_FILES.forEach((file) => {
          rootFolder.file(file.path, file.content);
        });

        // Add a helpful README.md for Android Studio
        rootFolder.file(
          'README.md',
          `# HabitFlow - Modern Android Habit Tracker

Production-ready Native Android app built with Kotlin & Jetpack Compose.

## Architecture & Tech Stack
- **UI:** Jetpack Compose + Material Design 3
- **Architecture:** MVVM with Unidirectional Data Flow (UDF)
- **Persistence:** Room Database (2.6.1) with KSP
- **Coroutines & Flow:** StateFlow for reactive UI state
- **Date & Streaks:** java.time (LocalDate, DayOfWeek)

## How to Run in Android Studio
1. Open Android Studio (Hedgehog 2023.1.1 or Ladybug / Koala).
2. Select **File > Open...** and choose this \`HabitFlow\` folder.
3. Allow Gradle to sync.
4. Run on an Android Emulator or physical device (Min SDK 26, Target SDK 34).
`
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
      console.error('Failed to create project zip', err);
    } finally {
      setIsZipping(false);
    }
  };

  const getLanguageBadge = (lang: string) => {
    switch (lang) {
      case 'kotlin':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30';
      case 'toml':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'xml':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
      default:
        return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[720px] bg-slate-900 text-slate-100 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* File Tree Explorer (Left Sidebar) */}
      <div className="w-full lg:w-80 bg-slate-950/80 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col shrink-0">
        {/* Header with Search and Zip Button */}
        <div className="p-4 border-b border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Android Project Tree
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">
              {ANDROID_PROJECT_FILES.length} files
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Kotlin files, DAOs, UI..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Export Zip Button */}
          <button
            onClick={handleExportZip}
            disabled={isZipping}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-sky-900/30 transition-all disabled:opacity-50"
          >
            <Archive className="w-4 h-4" />
            {isZipping ? 'Generating Zip...' : 'Download Full Android Project (.zip)'}
          </button>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[300px] lg:max-h-none scrollbar-thin scrollbar-thumb-slate-800">
          {filteredFiles.map((file) => {
            const isSelected = file.path === selectedFile.path;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFilePath(file.path)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-all ${
                  isSelected
                    ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40 font-semibold'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                }`}
              >
                <FileCode
                  className={`w-4 h-4 shrink-0 ${
                    isSelected ? 'text-sky-400' : 'text-slate-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="truncate font-mono">{file.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{file.path}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor & Viewer (Right Pane) */}
      <div className="flex-1 flex flex-col bg-slate-900/90 overflow-hidden">
        {/* Top File Bar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-slate-100 truncate">
                {selectedFile.path}
              </span>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${getLanguageBadge(
                  selectedFile.language
                )}`}
              >
                {selectedFile.language}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{selectedFile.description}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadSingleFile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed bg-[#0b1120] text-slate-200 select-text">
          <pre className="flex">
            {/* Line numbers */}
            <div className="pr-4 mr-4 text-right text-slate-600 select-none border-r border-slate-800/80 shrink-0">
              {selectedFile.content.split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            {/* Code */}
            <code className="flex-1 overflow-x-auto whitespace-pre font-mono">
              {selectedFile.content}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
