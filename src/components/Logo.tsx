import React from 'react';
import { FaBrain } from 'react-icons/fa';

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1F3A5F] text-white shadow-sm">
        <FaBrain size={18} />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-wide text-[#1F3A5F]">
          MemoArk
        </span>
        <span className="text-[11px] text-[#6B7280]">
          Memory & Vocabulary
        </span>
      </div>
    </div>
  );
}