import React from 'react'
import { Clock, CalendarCheck2 } from 'lucide-react'

const DEFAULT_SCHEDULE = [
  {
    time: '08:30 - 09:00',
    title: 'Registrasi Peserta & Morning Coffee',
    desc: 'Scan e-tiket QR Code di resepsionis dan networking santai pagi.',
  },
  {
    time: '09:00 - 11:30',
    title: 'Sesi Pembukaan & Keynote Presentation',
    desc: 'Pemaparan komprehensif materi utama bersama pakar industri.',
  },
  {
    time: '11:30 - 13:00',
    title: 'Networking Lunch & Coffee Break',
    desc: 'Sesi istirahat makan siang dan berjejaring bersama sesama peserta.',
  },
  {
    time: '13:00 - 15:30',
    title: 'Interactive Deep-Dive Workshop',
    desc: 'Sesi workshop interaktif, studi kasus terapan, dan pendampingan teknis.',
  },
  {
    time: '15:30 - 16:30',
    title: 'Tanya Jawab (Q&A) & Penutupan',
    desc: 'Sesi diskusi terbuka, dokumentasi foto bersama, dan e-sertifikat kehadiran.',
  },
]

export function EventRundown({ rundown }) {
  const scheduleItems = (Array.isArray(rundown) && rundown.length > 0) ? rundown : DEFAULT_SCHEDULE
  const isCustom = Array.isArray(rundown) && rundown.length > 0

  return (
    <section className="p-8 rounded-3xl border border-slate-200 dark:border-[#1e2536] bg-white dark:bg-[#11141e] shadow-sm dark:shadow-none transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display flex items-center gap-2.5">
          <Clock className="h-5 w-5 text-[#FF5C00]" />
          Jadwal & Agenda Acara
        </h2>
        {isCustom && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CalendarCheck2 className="h-3 w-3" /> Agenda Resmi
          </span>
        )}
      </div>

      <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-[#1e2536]">
        {scheduleItems.map((item, i) => (
          <div key={i} className="relative pl-8 group">
            <div className="absolute left-1.5 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#FF5C00] bg-white dark:bg-[#11141e] group-hover:bg-[#FF5C00] transition-colors" />
            <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 block mb-1">
              {item.time || 'Waktu Fleksibel'}
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors">
              {item.title}
            </h3>
            {item.desc && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                {item.desc}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
