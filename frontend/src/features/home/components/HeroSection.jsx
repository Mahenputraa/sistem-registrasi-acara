import React from 'react'
import { CalendarDays, QrCode, Zap, ShieldCheck } from 'lucide-react'

export function HeroSection({ eventCount = 0 }) {
  return (
    <div className="max-w-3xl">
      {/* Badge with original mono typography */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 dark:bg-[#161B28] border border-slate-200 dark:border-[#293247] text-xs font-mono text-orange-600 dark:text-orange-400 font-bold mb-6">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 transform-gpu will-change-transform" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        PLATFORM REGISTRASI // ACARA RESMI
      </div>

      {/* Main Headline with original display typography & orange accent */}
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display leading-[1.08]">
        Akses Registrasi Acara <br />
        <span className="text-[#FF5C00]">Seminar &amp; Konferensi</span> Terpercaya.
      </h1>

      {/* Supporting Description with original typography */}
      <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
        Pesan tiket dengan mudah untuk berbagai seminar, workshop, dan konferensi pilihan. Dapatkan e-tiket QR digital dengan konfirmasi instan serta informasi kuota yang selalu terbarukan.
      </p>

      {/* Metrics Ribbon with original mono typography and contextual icons/logos */}
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl pt-8 border-t border-slate-200 dark:border-[#1e2536]">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="block text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{eventCount}</span>
          </div>
          <span className="text-xs text-slate-500 font-medium block mt-1">Acara Tersedia</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <QrCode className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 dark:text-orange-400 shrink-0" />
            <span className="block text-xl sm:text-2xl font-extrabold text-orange-500 dark:text-orange-400 font-mono">100%</span>
          </div>
          <span className="text-xs text-slate-500 font-medium block mt-1">E-Tiket QR Digital</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="block text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">Instan</span>
          </div>
          <span className="text-xs text-slate-500 font-medium block mt-1">Konfirmasi Pemesanan</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="block text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">Terjamin</span>
          </div>
          <span className="text-xs text-slate-500 font-medium block mt-1">Alokasi Kuota Resmi</span>
        </div>
      </div>
    </div>
  )
}

