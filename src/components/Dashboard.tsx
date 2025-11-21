import React from 'react';
import { FaBookOpen, FaCheckCircle, FaHistory } from 'react-icons/fa';
import type { VocabItem } from '../types';
import type { ProgressMap } from '../hooks/useProgress';

interface DashboardProps {
  vocabList: VocabItem[];
  progress: ProgressMap;
  onStartStudy: () => void;
  onOpenDictionary: (opts: {
    statusFilter?: 'all' | 'learning' | 'mastered';
  }) => void;
  onExportBackup: () => void;
  onImportBackup: () => void;
}

export function Dashboard({
  vocabList,
  progress,
  onStartStudy,
  onOpenDictionary,
  onExportBackup,
  onImportBackup,
}: DashboardProps) {
  const totalCount = vocabList.length;
  const masteredCount = vocabList.filter(
    (v) => progress[v.word]?.status === 'mastered'
  ).length;
  const learningCount = vocabList.filter(
    (v) => progress[v.word]?.status === 'learning'
  ).length;

  const percent =
    totalCount === 0 ? 0 : Math.round((masteredCount / totalCount) * 100);

  return (
    <div className="flex min-h-[calc(100vh-60px)] flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1F3A5F]">Dashboard</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Track your vocabulary journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onOpenDictionary({ statusFilter: 'all' })}
            className="flex flex-col items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition-transform hover:scale-105 active:scale-95"
          >
            <FaBookOpen className="mb-2 text-[#1F3A5F]" size={20} />
            <span className="text-xl font-bold text-[#111827]">
              {totalCount}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-[#6B7280]">
              Total
            </span>
          </button>

          <button
            onClick={() => onOpenDictionary({ statusFilter: 'learning' })}
            className="flex flex-col items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition-transform hover:scale-105 active:scale-95"
          >
            <FaHistory className="mb-2 text-[#0FA3B1]" size={20} />
            <span className="text-xl font-bold text-[#111827]">
              {learningCount}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-[#6B7280]">
              Learning
            </span>
          </button>

          <button
            onClick={() => onOpenDictionary({ statusFilter: 'mastered' })}
            className="flex flex-col items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition-transform hover:scale-105 active:scale-95"
          >
            <FaCheckCircle className="mb-2 text-[#059669]" size={20} />
            <span className="text-xl font-bold text-[#111827]">
              {masteredCount}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-[#6B7280]">
              Mastered
            </span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-xs text-[#6B7280]">
            <span>Total Progress</span>
            <span>
              {masteredCount} / {totalCount} words ({percent}%)
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
            <div
              className="h-full bg-[#1F3A5F] transition-all duration-500 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Main Action */}
        <button
          onClick={onStartStudy}
          className="w-full rounded-2xl bg-[#1F3A5F] py-4 text-center text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#162840]"
        >
          Start Session
        </button>

        {/* Backup & Restore */}
        <div className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-[#1F3A5F]">
            Backup & Restore
          </h3>
          <p className="mt-1 text-xs text-[#6B7280]">
            Export your learning progress as a JSON file, or restore from a
            previous backup.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onExportBackup}
              className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-medium text-[#1F3A5F] transition-colors hover:bg-gray-50"
            >
              Export backup
            </button>
            <button
              type="button"
              onClick={onImportBackup}
              className="rounded-xl bg-[#1F3A5F] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#162840]"
            >
              Import backup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}