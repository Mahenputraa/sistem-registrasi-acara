import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, ShieldCheck, Zap, QrCode } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/button'

export function AboutHero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 sm:pt-12 sm:pb-18 border-b border-slate-200/80 dark:border-[#1e2536]">
      {/* Background ambient decorative glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-b from-orange-500/10 via-[#FF5C00]/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Chip badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 dark:bg-[#FF5C00]/15 border border-orange-500/20 text-[#FF5C00] text-xs font-semibold"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Platform Tiket & Konferensi Teknologi Indonesia</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display leading-[1.15]"
        >
          Membangun Pengalaman Acara Teknologi yang{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5C00] to-amber-500">
            Mulus & Terpercaya
          </span>
        </motion.h1>

        {/* Subtitle / Narrative */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          Acara Tech lahir untuk membebaskan penyelenggara dan peserta dari kerumitan tiket fisik serta antrean registrasi manual. Kami menyatukan pendaftaran instan, manajemen kuota transparan, dan verifikasi QR Code real-time dalam satu ekosistem terpadu.
        </motion.p>

        {/* Highlights Pill Strip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-700 dark:text-slate-300"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#161B28] border border-slate-200 dark:border-[#293247]">
            <Zap className="w-4 h-4 text-[#FF5C00]" />
            <span>Validasi Tiket Sub-Detik</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#161B28] border border-slate-200 dark:border-[#293247]">
            <QrCode className="w-4 h-4 text-[#FF5C00]" />
            <span>E-Tiket QR Code Terenkripsi</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#161B28] border border-slate-200 dark:border-[#293247]">
            <ShieldCheck className="w-4 h-4 text-[#FF5C00]" />
            <span>Kapasitas Kursi Real-Time</span>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="pt-4 flex items-center justify-center gap-3"
        >
          <Button
            asChild
            className="px-6 py-2.5 rounded-xl bg-[#FF5C00] hover:bg-[#FF7322] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 cursor-pointer"
          >
            <Link to="/">
              Jelajahi Acara Sekarang
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
