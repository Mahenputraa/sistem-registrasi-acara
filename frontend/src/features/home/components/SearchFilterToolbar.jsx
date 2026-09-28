import React, { useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'

export function SearchFilterToolbar({ search, onSearchChange, selectedType, onTypeChange, className = '' }) {
  const inputRef = useRef(null)

  const categories = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'physical', label: 'Tatap Muka' },
    { id: 'online', label: 'Webinar Online' },
  ]

  // Keyboard shortcut: Press "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className={`p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-[#11141e] border border-slate-200 dark:border-[#1e2536] flex flex-col sm:flex-row items-center gap-3 shadow-sm dark:shadow-md transition-colors duration-300 ${className}`}>
      <div className="relative flex-1 w-full flex items-center">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          ref={inputRef}
          type="search"
          aria-label="Cari acara, topik seminar, atau konferensi"
          placeholder="Cari acara, topik seminar, atau konferensi..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-11 pl-11 pr-16 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-md cursor-pointer"
              aria-label="Hapus teks pencarian"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 dark:bg-[#161B28] border border-slate-200 dark:border-[#293247] rounded">
            /
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 px-1">
        {categories.map((type) => (
          <button
            key={type.id}
            type="button"
            aria-pressed={selectedType === type.id}
            onClick={() => onTypeChange(type.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedType === type.id
                ? 'bg-[#FF5C00] text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#161B28]'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  )
}
