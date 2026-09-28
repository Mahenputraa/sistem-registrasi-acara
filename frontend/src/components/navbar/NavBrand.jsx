import React from 'react'
import { Link } from 'react-router-dom'

export function NavBrand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group select-none shrink-0">
      <div className="h-8.5 w-8.5 sm:h-9 sm:w-9 rounded-xl bg-[#FF5C00] flex items-center justify-center shadow-lg shadow-orange-950/40 group-hover:scale-105 transition-transform text-white font-mono font-extrabold text-xs sm:text-sm">
        AT
      </div>
      <div>
        <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white block leading-tight font-display">
          Acara <span className="text-[#FF5C00]">Tech</span>
        </span>
        <span className="text-[10px] text-slate-500 font-mono font-semibold tracking-wider uppercase hidden sm:block">
          Platform Tiket &amp; Konferensi
        </span>
      </div>
    </Link>
  )
}
