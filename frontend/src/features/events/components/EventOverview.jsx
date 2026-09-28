import React from 'react'
import { FileText, CheckCircle2, Sparkles, Coffee } from 'lucide-react'

export function EventOverview({ description }) {
  return (
    <section className="p-8 rounded-3xl border border-slate-200 dark:border-[#1e2536] bg-white dark:bg-[#11141e] shadow-sm dark:shadow-none transition-colors duration-300">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display mb-4 flex items-center gap-2.5">
        <FileText className="h-5 w-5 text-[#FF5C00]" />
        Tentang Acara Ini
      </h2>
      <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
        {description}
      </p>

      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-[#1e2536] grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161B28]/60 border border-slate-200 dark:border-[#22293b]">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mb-2" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">E-Tiket & Kode QR</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Check-in digital cepat tanpa perlu cetak kertas.</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161B28]/60 border border-slate-200 dark:border-[#22293b]">
          <Sparkles className="h-5 w-5 text-amber-500 dark:text-amber-400 mb-2" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Materi & Sertifikat</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Dapatkan sertifikat resmi dan modul presentasi.</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161B28]/60 border border-slate-200 dark:border-[#22293b]">
          <Coffee className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mb-2" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Sesi Diskusi & Q&A</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Interaksi langsung bersama pakar & praktisi industri.</p>
        </div>
      </div>
    </section>
  )
}
