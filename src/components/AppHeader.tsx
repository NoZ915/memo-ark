import React from 'react';
import { Logo } from './Logo';

export function AppHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-[#E5E7EB] bg-[#F4F0E8]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2">
        <Logo />
      </div>
    </header>
  );
}