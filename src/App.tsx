import React, { useEffect, useState, useRef } from 'react';
import { AppHeader } from './components/AppHeader';
import { Dashboard } from './components/Dashboard';
import { StudySession } from './components/StudySession';
import { Dictionary } from './components/Dictionary';
import { useProgress, type ProgressMap } from './hooks/useProgress';
import type { VocabItem } from './types';

export default function App() {
  const [vocabList, setVocabList] = useState<VocabItem[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'study' | 'dictionary'>('dashboard');
  
  // Dictionary Filters State lifting
  const [dictOpts, setDictOpts] = useState<{
    statusFilter?: 'all' | 'learning' | 'mastered';
    levelFilter?: 'all' | number;
  }>({});

  const {
    progress,
    getDisplayStatus,
    setStatus,
    exportBackup,
    importBackup,
  } = useProgress(vocabList);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('data/full_vocab_content.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(setVocabList)
      .catch(() => setLoadError('Failed to load vocabulary data. Please ensure data/full_vocab_content.json exists.'));
  }, []);

  const handleStartStudy = () => {
    setActiveView('study');
  };

  const handleOpenDictionary = (opts: { statusFilter?: 'all' | 'learning' | 'mastered' }) => {
    setDictOpts(opts);
    setActiveView('dictionary');
  };

  // Backup handlers
  const handleExportBackup = () => {
    const data = exportBackup();
    const payload = {
      version: 'memoark-progress-v1',
      exportedAt: new Date().toISOString(),
      progress: data,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memoark-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const payload = JSON.parse(text);
        
        if (payload.version === 'memoark-progress-v1' && typeof payload.progress === 'object') {
          if (confirm('This will overwrite your current progress. Are you sure?')) {
            importBackup(payload.progress as ProgressMap);
            alert('Backup restored successfully!');
          }
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Failed to parse backup file.');
      } finally {
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  if (loadError) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F4F0E8] text-[#1F3A5F]">
        {loadError}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-4 pt-[60px]">
      <AppHeader />

      {/* Hidden File Input for Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/json"
        className="hidden"
      />

      <main className="mx-auto max-w-5xl">
        {activeView === 'dashboard' && (
          <Dashboard
            vocabList={vocabList}
            progress={progress}
            onStartStudy={handleStartStudy}
            onOpenDictionary={handleOpenDictionary}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportClick}
          />
        )}

        {activeView === 'study' && (
          <StudySession
            vocabList={vocabList}
            getDisplayStatus={getDisplayStatus}
            setStatus={setStatus}
            onExit={() => setActiveView('dashboard')}
          />
        )}

        {activeView === 'dictionary' && (
          <div className="p-4">
             <div className="mb-4 flex items-center">
                <button 
                  onClick={() => setActiveView('dashboard')}
                  className="text-sm font-medium text-[#6B7280] hover:text-[#1F3A5F]"
                >
                  &larr; Back to Dashboard
                </button>
             </div>
             <Dictionary
                vocabList={vocabList}
                progress={progress}
                defaultStatusFilter={dictOpts.statusFilter}
                defaultLevelFilter={dictOpts.levelFilter}
                onUpdateStatus={setStatus}
             />
          </div>
        )}
      </main>
    </div>
  );
}