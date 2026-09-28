import React from 'react'
import { useTheme } from '../../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export function NavThemeToggle() {
  const { toggleTheme, isDark } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2.5 rounded-xl border border-slate-200 dark:border-[#293247] bg-white/80 dark:bg-[#161B28]/80 text-slate-700 dark:text-slate-300 hover:text-[#FF5C00] dark:hover:text-[#FF5C00] hover:border-[#FF5C00]/40 transition-all cursor-pointer shadow-sm select-none"
      title={isDark ? "Beralih ke Mode Terang (Light Mode)" : "Beralih ke Mode Gelap (Dark Mode)"}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 transition-transform hover:-rotate-12" />
      )}
    </button>
  )
}
