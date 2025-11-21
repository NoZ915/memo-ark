import React, { useState, useEffect } from 'react';
import type { VocabItem } from '../types';
import type { BaseStatus } from '../hooks/useProgress';

interface FlashcardProps {
  vocab: VocabItem;
  status: 'unseen' | 'learning' | 'mastered';
  onAnswer: (status: BaseStatus) => void;
}

export function Flashcard({ vocab, status, onAnswer }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state when vocab changes
  useEffect(() => {
    setIsFlipped(false);
  }, [vocab]);

  return (
    <div className="flex h-full flex-col">
      {/* Card Container - Perspective wrapper */}
      <div className="perspective-1000 group relative flex-1">
        {/* Inner Card - Preserves 3D */}
        <div
          className={`relative h-full w-full transition-all duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front Face */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-sm backface-hidden">
            <div className="mb-4 rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-medium text-[#6B7280]">
              Level {vocab.level}
            </div>
            <h2 className="mb-2 text-center text-4xl font-bold text-[#1F3A5F]">
              {vocab.word}
            </h2>
            <div className="mb-8 text-lg italic text-[#6B7280]">{vocab.pos}</div>
            <button
              onClick={() => setIsFlipped(true)}
              className="rounded-full bg-[#E5E7EB] px-6 py-2 text-sm font-medium text-[#4B5563] hover:bg-[#D1D5DB]"
            >
              Tap to Flip
            </button>
          </div>

          {/* Back Face */}
          <div className="rotate-y-180 absolute inset-0 flex flex-col overflow-y-auto rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm backface-hidden">
            <div className="mb-4 text-center">
              <h3 className="text-2xl font-bold text-[#1F3A5F]">{vocab.word}</h3>
              <p className="text-sm text-[#6B7280]">{vocab.content.ipa}</p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="rounded-xl bg-[#F4F0E8] p-3 text-center text-base font-semibold text-[#1F3A5F]">
                {vocab.content.core_meaning}
              </div>

              {/* Definitions */}
              <div className="space-y-2">
                {vocab.content.definitions.map((def, idx) => (
                  <div key={idx} className="border-l-2 border-[#0FA3B1] pl-3">
                    <p className="font-medium text-[#111827]">{def.en}</p>
                    <p className="text-[#6B7280]">{def.cn}</p>
                  </div>
                ))}
              </div>

              {/* Examples */}
              {vocab.content.examples && vocab.content.examples.length > 0 && (
                <div className="pt-2">
                  <h4 className="mb-1 text-xs font-bold uppercase text-[#6B7280]">
                    Examples
                  </h4>
                  <ul className="list-disc space-y-1 pl-4 text-[#4B5563]">
                    {vocab.content.examples.slice(0, 2).map((ex, idx) => (
                      <li key={idx}>
                        <div>{ex.en}</div>
                        <div className="text-xs text-[#9CA3AF]">{ex.cn}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-auto pt-6 text-center">
              <button
                onClick={() => setIsFlipped(false)}
                className="text-xs text-[#6B7280] underline"
              >
                Flip back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => onAnswer('learning')}
          className="flex-1 rounded-xl border border-[#E5E7EB] bg-white py-3 text-sm font-semibold text-[#1F3A5F] shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
        >
          I Forgot / Hard
        </button>
        <button
          onClick={() => onAnswer('mastered')}
          disabled={status === 'mastered'}
          className={`flex-1 rounded-xl py-3 text-sm font-semibold text-white shadow-sm transition-colors ${
            status === 'mastered'
              ? 'cursor-not-allowed bg-[#059669]/60'
              : 'bg-[#1F3A5F] hover:bg-[#162840]'
          }`}
        >
          {status === 'mastered' ? 'Mastered' : 'I Remember'}
        </button>
      </div>
    </div>
  );
}