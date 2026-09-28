import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import { Ticket as TicketIcon } from 'lucide-react'

export function TicketEmptyState() {
  return (
    <div className="w-full text-center py-20 px-6 rounded-3xl border border-slate-200 dark:border-[#1e2536] bg-white dark:bg-[#11141e] shadow-sm dark:shadow-none transition-colors duration-300">
      <div className="h-16 w-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4 text-[#FF5C00]">
        <TicketIcon className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
        Belum Ada Tiket yang Dimiliki
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
        Kamu belum memesan tiket untuk event apapun saat ini. Temukan acara menarik dan daftarkan
        dirimu sekarang!
      </p>
      <Link to="/" className="inline-block mt-6">
        <Button variant="default" size="md">
          Jelajahi Acara Sekarang
        </Button>
      </Link>
    </div>
  )
}

