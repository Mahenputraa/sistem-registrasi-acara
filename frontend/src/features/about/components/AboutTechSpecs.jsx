import React from 'react'
import { motion } from 'framer-motion'
import { Cpu, Server, Check, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/button'

export function AboutTechSpecs() {
  const specs = [
    {
      category: 'Backend & Database Engine',
      icon: Server,
      points: [
        'Laravel 12 API dengan pemisahan Controller, FormRequest, dan Model yang bersih.',
        'PostgreSQL Database dengan transaksi ACID untuk menjamin integritas kuota tiket.',
        'Sanctum Bearer Token Authentication dengan auto-prune token kadaluarsa.',
      ],
    },
    {
      category: 'Frontend & User Experience',
      icon: Cpu,
      points: [
        'React 19 dengan Tailwind CSS v4 untuk antarmuka berkecepatan tinggi.',
        'Zustand Store untuk sinkronisasi state global yang reaktif tanpa overhead re-render.',
        'Framer Motion layout animations untuk transisi visual tanpa jolt/hentakan.',
      ],
    },
  ]

  return (
    <section className="py-14 sm:py-18">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5C00] font-mono">
            Keunggulan Teknis
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            Fondasi Teknologi & Performa Tinggi
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Dibangun dengan standar rekayasa perangkat lunak modern untuk menangani lonjakan registrasi dan check-in ribuan peserta secara simultan.
          </p>
        </div>

        {/* 2-column specs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specs.map((item, idx) => {
            const IconComp = item.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.1 }}
                className="p-6 sm:p-7 rounded-3xl bg-slate-50/70 dark:bg-[#11141e] border border-slate-200 dark:border-[#1e2536] space-y-5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#FF5C00] flex items-center justify-center">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                    {item.category}
                  </h3>
                </div>

                <ul className="space-y-3">
                  {item.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-orange-500/15 via-[#FF5C00]/10 to-amber-500/10 border border-orange-500/30 text-center space-y-5 shadow-sm"
        >
          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Siap Mengikuti Konferensi Teknologi Berikutnya?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Jelajahi beragam seminar, workshop, dan konferensi teknologi unggulan di Acara Tech dan dapatkan e-tiket Anda sekarang juga.
            </p>
          </div>

          <div>
            <Button
              asChild
              className="px-7 py-3 rounded-xl bg-[#FF5C00] hover:bg-[#FF7322] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 cursor-pointer"
            >
              <Link to="/">
                Jelajahi Acara Sekarang
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
