import React, { useState, useMemo } from 'react';
import { FaTrophy } from 'react-icons/fa';
import type { VocabItem } from '../types';
import type { BaseStatus } from '../hooks/useProgress';
import { Flashcard } from './Flashcard';

interface StudySessionProps {
  vocabList: VocabItem[];
  getDisplayStatus: (word: string) => 'unseen' | 'learning' | 'mastered';
  setStatus: (word: string, status: BaseStatus) => void;
  onExit: () => void;
}

export function StudySession({
  vocabList,
  getDisplayStatus,
  setStatus,
  onExit,
}: StudySessionProps) {
  const SESSION_SIZE = 10;
  // Key to force re-calculation of the random queue
  const [sessionKey, setSessionKey] = useState(0);

  // Randomly select words for the session
  const queue = useMemo(() => {
    if (vocabList.length === 0) return [];
    // Create a shallow copy to shuffle
    const shuffled = [...vocabList];
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, SESSION_SIZE);
  }, [vocabList, sessionKey]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const current = queue[currentIndex];
  const isFinished = queue.length > 0 && currentIndex >= queue.length;

  const handleRestart = () => {
    setSessionKey((k) => k + 1);
    setCurrentIndex(0);
  };

  const handleAnswer = (status: BaseStatus) => {
    if (!current) return;
    setStatus(current.word, status);
    // Always advance
    setCurrentIndex((idx) => idx + 1);
  };

  // No cards available (unlikely if vocabList has items)
  if (queue.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <p className="text-[#6B7280]">No words available to study.</p>
        <button
          onClick={onExit}
          className="mt-4 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-sm text-[#1F3A5F]"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Completion Screen
  if (isFinished) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-10">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1F3A5F]/10 text-[#1F3A5F]">
          <FaTrophy size={40} />
        </div>
        <h2 className="text-2xl font-bold text-[#1F3A5F]">Great job!</h2>
        <p className="text-center text-sm text-[#6B7280]">
          You’ve completed this round of {SESSION_SIZE} cards.
        </p>
        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={onExit}
            className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-3 text-sm font-medium text-[#1F3A5F] hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
          <button
            type="button"
            onClick={handleRestart}
            className="rounded-xl bg-[#1F3A5F] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#162840]"
          >
            Start another round
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-100px)] max-w-md flex-col p-4">
      <div className="mb-4 flex items-center justify-between text-xs text-[#6B7280]">
        <span>Study Session</span>
        <span>
          {currentIndex + 1} / {queue.length}
        </span>
      </div>

      <div className="flex-1">
        <Flashcard
          vocab={current}
          status={getDisplayStatus(current.word)}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
}