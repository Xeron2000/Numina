'use client';

import { useTheme } from './ThemeContext';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-surface-variant transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <MoonIcon className="w-6 h-6 text-primary" />
      ) : (
        <SunIcon className="w-6 h-6 text-warning" />
      )}
    </button>
  );
}