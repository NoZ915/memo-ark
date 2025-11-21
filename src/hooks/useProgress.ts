import { useEffect, useState } from 'react';
import type { VocabItem } from '../types';

export type BaseStatus = 'learning' | 'mastered';

export interface ProgressItem {
  status: BaseStatus;  // Only stores 'learning' or 'mastered'
  updatedAt: string;   // ISO string
}

export type ProgressMap = Record<string, ProgressItem>;

const STORAGE_KEY = 'memoark_progress_v1';

export function useProgress(vocabList: VocabItem[]) {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ProgressMap;
      setProgress(parsed);
    } catch {
      // ignore parse error or empty storage
    }
  }, []);

  // Basic status (from localStorage), only 'learning' or 'mastered'
  const getRawStatus = (word: string): BaseStatus | undefined => {
    return progress[word]?.status;
  };

  // UI display status: unseen / learning / mastered
  const getDisplayStatus = (word: string): 'unseen' | 'learning' | 'mastered' => {
    const raw = getRawStatus(word);
    return raw ?? 'unseen';
  };

  const setStatus = (word: string, status: BaseStatus) => {
    setProgress((prev) => {
      const next: ProgressMap = {
        ...prev,
        [word]: { status, updatedAt: new Date().toISOString() },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Export for backup: returns full ProgressMap
  const exportBackup = () => {
    return progress;
  };

  // Import backup: completely overwrite current progress
  const importBackup = (next: ProgressMap) => {
    setProgress(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return {
    progress,
    getRawStatus,
    getDisplayStatus,
    setStatus,
    exportBackup,
    importBackup,
  };
}