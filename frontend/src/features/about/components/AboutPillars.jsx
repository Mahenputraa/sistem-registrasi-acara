import React from 'react'
import { motion } from 'framer-motion'
import { QrCode, Layers, CalendarClock, ShieldCheck } from 'lucide-react'

export function AboutPillars() {
  const pillars = [
    {
      icon: QrCode,
      title: 'Validasi QR Scanner Instan',
      tag: 'Check-In Cepat',
      desc: 'Petugas registrasi dapat memindai tiket peserta langsung melalui kamera ponsel atau barcode scanner dengan responsivitas sub-detik.',
    },
    {
      icon: Layers,
      title: 'Tiering & Kuota Dinamis',
      tag: 'Kapasitas Akurat',
      desc: 'Mendukung pengaturan berbagai kategori tiket mulai dari Early Bird, Regular, hingga VIP dengan sistem kuota ketat anti-overselling.',
    },
    {
      icon: CalendarClock,
      title: 'Rundown & Sesi Interaktif',
      tag: 'Informasi Lengkap',
      desc: 'Peserta dapat melihat jadwal sesi menit-per-menit, profil pembicara, dan lokasi venue secara real-time langsung di halaman acara.',
    },
    {
      icon: ShieldCheck,
      title: 'Keamanan Tiket Terenkripsi',
      tag: 'Anti Tiket Ganda',
      desc: 'Setiap e-tiket memiliki token unik yang mencegah duplikasi atau pemalsuan tiket di pintu masuk acara.',
    },
  ]

  return (
    <section className="py-14 sm:py-18 border-b border-slate-200/80 dark:border-[#1e2536]">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5C00] font-mono">
            Keunggulan Platform
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            Pilar Utama Layanan Acara Tech
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Dirancang dari bawah ke atas untuk memberikan kemudahan bagi event organizer dan pengalaman tanpa cela bagi setiap pengunjung.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, idx) => {
            const IconComp = pillar.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.1 }}
                className="group p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#11141e] border border-slate-200 dark:border-[#1e2536] hover:border-[#FF5C00]/40 dark:hover:border-[#FF5C00]/40 shadow-sm transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-[#FF5C00] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#FF5C00] group-hover:text-white transition-all duration-300 shadow-sm">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
                        {pillar.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-100 dark:bg-[#161B28] text-slate-600 dark:text-slate-400">
                        {pillar.tag}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
