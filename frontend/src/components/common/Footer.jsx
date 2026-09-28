import React from 'react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-[#1e2536] bg-slate-100/80 dark:bg-[#0c0d14] py-10 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-[#FF5C00] flex items-center justify-center font-mono font-extrabold text-white text-xs shadow-md shadow-orange-500/20">
              AT
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white font-display">
              Acara Tech <span className="text-slate-500 text-xs font-normal">Platform Tiket 2026</span>
            </span>
          </div>

          {/* Quick Footer Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
            <Link to="/" className="hover:text-[#FF5C00] transition-colors">
              Jelajahi Acara
            </Link>
            <Link to="/about" className="hover:text-[#FF5C00] transition-colors">
              Tentang Kami
            </Link>
            <Link to="/my-tickets" className="hover:text-[#FF5C00] transition-colors">
              Tiket Saya
            </Link>
            <Link to="/profile" className="hover:text-[#FF5C00] transition-colors">
              Pengaturan Profil
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200/60 dark:border-[#1e2536]/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            Clean Architecture: Laravel 12 Services + PostgreSQL + Vite Feature Slices.
          </p>

          <p className="font-mono">
            © 2026 Acara Tech Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
