import React, { useState, useMemo, useEffect } from 'react';
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaVolumeUp,
} from 'react-icons/fa';
import type { VocabItem } from '../types';
import type { BaseStatus, ProgressMap } from '../hooks/useProgress';

interface DictionaryProps {
  vocabList: VocabItem[];
  progress: ProgressMap;
  defaultStatusFilter?: 'all' | 'learning' | 'mastered';
  defaultLevelFilter?: 'all' | number;
  onUpdateStatus: (word: string, status: BaseStatus) => void;
}

export function Dictionary({
  vocabList,
  progress,
  defaultStatusFilter = 'all',
  defaultLevelFilter = 'all',
  onUpdateStatus,
}: DictionaryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(defaultStatusFilter);
  const [levelFilter, setLevelFilter] = useState(defaultLevelFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(
    null
  );

  const PAGE_SIZE = 20;

  // Derive available levels from data
  const availableLevels = useMemo(() => {
    const levels = new Set(vocabList.map((v) => v.level));
    return Array.from(levels).sort((a, b) => a - b);
  }, [vocabList]);

  // Filtering Logic
  const filteredItems = useMemo(() => {
    let list = vocabList;

    // Filter by Status
    if (statusFilter !== 'all') {
      list = list.filter((v) => {
        const s = progress[v.word]?.status;
        if (statusFilter === 'learning') return s === 'learning';
        if (statusFilter === 'mastered') return s === 'mastered';
        return false;
      });
    }

    // Filter by Level
    if (levelFilter !== 'all') {
      list = list.filter((v) => v.level === levelFilter);
    }

    return list;
  }, [vocabList, progress, statusFilter, levelFilter]);

  // Search Logic
  const isSearchMode = searchQuery.trim().length > 0;

  const displayItems = useMemo(() => {
    if (isSearchMode) {
      const q = searchQuery.toLowerCase().trim();
      const results = filteredItems.filter((v) => {
        const wordMatch = v.word.toLowerCase().includes(q);
        const coreMatch = v.content.core_meaning.includes(q);
        const defMatch = v.content.definitions.some(
          (d) =>
            d.en.toLowerCase().includes(q) || d.cn.toLowerCase().includes(q)
        );
        return wordMatch || coreMatch || defMatch;
      });

      // Simple scoring: Exact match > Starts with > Includes
      results.sort((a, b) => {
        const aWord = a.word.toLowerCase();
        const bWord = b.word.toLowerCase();
        if (aWord === q) return -1;
        if (bWord === q) return 1;
        if (aWord.startsWith(q) && !bWord.startsWith(q)) return -1;
        if (bWord.startsWith(q) && !aWord.startsWith(q)) return 1;
        return 0;
      });

      return results.slice(0, 5); // Limit 5 for search
    } else {
      // Pagination logic
      const start = (currentPage - 1) * PAGE_SIZE;
      return filteredItems.slice(start, start + PAGE_SIZE);
    }
  }, [filteredItems, searchQuery, currentPage, isSearchMode]);

  const totalPages = isSearchMode
    ? 1
    : Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, levelFilter, searchQuery]);

  const getStatusBadge = (word: string) => {
    const s = progress[word]?.status ?? 'unseen';
    if (s === 'mastered')
      return (
        <span className="rounded bg-[#059669] px-1.5 py-0.5 text-[10px] font-bold text-white">
          Mastered
        </span>
      );
    if (s === 'learning')
      return (
        <span className="rounded bg-[#0FA3B1]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#0FA3B1]">
          Learning
        </span>
      );
    return (
      <span className="rounded bg-[#E5E7EB] px-1.5 py-0.5 text-[10px] font-bold text-[#6B7280]">
        Unseen
      </span>
    );
  };

  // Modal navigation
  const handlePrev = () => {
    if (selectedWordIndex !== null && selectedWordIndex > 0) {
      setSelectedWordIndex(selectedWordIndex - 1);
    }
  };
  const handleNext = () => {
    if (
      selectedWordIndex !== null &&
      selectedWordIndex < displayItems.length - 1
    ) {
      setSelectedWordIndex(selectedWordIndex + 1);
    }
  };

  const selectedItem =
    selectedWordIndex !== null ? displayItems[selectedWordIndex] : null;

  return (
    <div className="flex h-[80vh] flex-col overflow-hidden rounded-2xl bg-white shadow-lg">
      {/* 1. Header: Search & Filters */}
      <div className="border-b border-[#E5E7EB] bg-[#F9FAFB] p-4">
        {/* Search */}
        <div className="relative mb-3">
          <FaSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
            size={14}
          />
          <input
            type="text"
            placeholder="Search word or meaning..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#D1D5DB] bg-white py-2 pl-9 pr-4 text-sm text-[#111827] focus:border-[#1F3A5F] focus:outline-none focus:ring-1 focus:ring-[#1F3A5F]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <div className="flex items-center gap-1 border-r border-[#E5E7EB] pr-2">
            {['all', 'learning', 'mastered'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s as any)}
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                  statusFilter === s
                    ? 'bg-[#1F3A5F] text-white'
                    : 'bg-[#E5E7EB] text-[#4B5563] hover:bg-[#D1D5DB]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {['all', ...availableLevels].map((l) => (
            <button
              key={l}
              onClick={() => setLevelFilter(l as any)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                levelFilter === l
                  ? 'bg-[#0FA3B1] text-white'
                  : 'bg-[#E5E7EB] text-[#4B5563] hover:bg-[#D1D5DB]'
              }`}
            >
              {l === 'all' ? 'All Levels' : `Lv ${l}`}
            </button>
          ))}
        </div>
      </div>

      {/* 2. List */}
      <div className="flex-1 overflow-y-auto bg-white p-2">
        {displayItems.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-[#6B7280]">
            No words found.
          </div>
        ) : (
          <div className="space-y-1">
            {displayItems.map((item, idx) => (
              <div
                key={item.word}
                onClick={() => setSelectedWordIndex(idx)}
                className="flex cursor-pointer items-center justify-between rounded-xl p-3 hover:bg-[#F3F4F6]"
              >
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-[#111827]">
                      {item.word}
                    </span>
                    <span className="text-xs text-[#6B7280]">
                      Level {item.level}
                    </span>
                  </div>
                  <div className="text-xs text-[#4B5563]">
                    {item.content.core_meaning}
                  </div>
                </div>
                <div>{getStatusBadge(item.word)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Footer: Pagination */}
      {!isSearchMode && (
        <div className="flex items-center justify-between border-t border-[#E5E7EB] bg-[#F9FAFB] p-3 text-xs text-[#6B7280]">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1D5DB] bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <FaChevronLeft />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1D5DB] bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="absolute inset-0 z-50 flex flex-col bg-white">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#1F3A5F]">
                  {selectedItem.word}
                </h3>
                <span className="text-sm italic text-[#6B7280]">
                  {selectedItem.pos}
                </span>
              </div>
              <div className="mt-1 flex gap-2">
                <span className="rounded bg-[#E5E7EB] px-1.5 py-0.5 text-[10px] font-bold text-[#6B7280]">
                  Level {selectedItem.level}
                </span>
                {getStatusBadge(selectedItem.word)}
              </div>
            </div>
            <button
              onClick={() => setSelectedWordIndex(null)}
              className="rounded-full bg-[#E5E7EB] p-2 text-[#6B7280] hover:bg-[#D1D5DB]"
            >
              <FaTimes />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4 flex items-center gap-2 text-[#6B7280]">
              <FaVolumeUp size={14} />
              <span className="font-mono text-sm">{selectedItem.content.ipa}</span>
            </div>

            <div className="mb-6 rounded-xl bg-[#F4F0E8] p-4 text-center font-semibold text-[#1F3A5F]">
              {selectedItem.content.core_meaning}
            </div>

            <div className="space-y-6">
              <section>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
                  Definitions
                </h4>
                {selectedItem.content.definitions.map((def, i) => (
                  <div key={i} className="mb-3 border-l-2 border-[#0FA3B1] pl-3">
                    <p className="text-sm font-medium text-[#111827]">
                      {def.en}
                    </p>
                    <p className="text-xs text-[#6B7280]">{def.cn}</p>
                  </div>
                ))}
              </section>

              {selectedItem.content.collocations && (
                <section>
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
                    Collocations
                  </h4>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {selectedItem.content.collocations.map((c, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-[#E5E7EB] p-2 text-xs"
                      >
                        <span className="block font-medium text-[#1F3A5F]">
                          {c.phrase}
                        </span>
                        <span className="text-[#6B7280]">{c.cn}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {selectedItem.content.examples && (
                <section>
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
                    Examples
                  </h4>
                  <ul className="list-disc space-y-2 pl-4 text-sm text-[#4B5563]">
                    {selectedItem.content.examples.map((ex, i) => (
                      <li key={i}>
                        <div>{ex.en}</div>
                        <div className="text-xs text-[#9CA3AF]">{ex.cn}</div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t border-[#E5E7EB] bg-[#F9FAFB] p-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-2">
                <button
                  onClick={handlePrev}
                  disabled={selectedWordIndex! <= 0}
                  className="rounded-lg border border-[#D1D5DB] bg-white p-2 text-[#6B7280] hover:bg-gray-50 disabled:opacity-30"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={handleNext}
                  disabled={selectedWordIndex! >= displayItems.length - 1}
                  className="rounded-lg border border-[#D1D5DB] bg-white p-2 text-[#6B7280] hover:bg-gray-50 disabled:opacity-30"
                >
                  <FaChevronRight />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    onUpdateStatus(selectedItem.word, 'learning')
                  }
                  disabled={progress[selectedItem.word]?.status === 'learning'}
                  className="rounded-lg bg-[#0FA3B1]/10 px-3 py-2 text-xs font-semibold text-[#0FA3B1] hover:bg-[#0FA3B1]/20 disabled:opacity-50"
                >
                  Mark Learning
                </button>
                <button
                  onClick={() =>
                    onUpdateStatus(selectedItem.word, 'mastered')
                  }
                  disabled={progress[selectedItem.word]?.status === 'mastered'}
                  className="rounded-lg bg-[#059669] px-3 py-2 text-xs font-semibold text-white hover:bg-[#047857] disabled:opacity-50"
                >
                  Mark Mastered
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}