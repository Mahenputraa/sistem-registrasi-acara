import React from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { Badge } from '../../../components/ui/badge'
import { formatDate } from '../../../lib/utils'
import { Calendar, MapPin, Video, CheckCircle2, Clock, ArrowUpRight, Sparkles } from 'lucide-react'

export function BoardingPassTicket({ ticket, index, userEmail, onSelectTicket }) {
  const event = ticket.registration?.event
  const venue = event?.venue
  const isCheckedIn = ticket.status === 'checked-in'

  const handleClick = () => {
    if (onSelectTicket) {
      onSelectTicket(ticket)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={handleClick}
      className={`relative overflow-hidden rounded-3xl border bg-white dark:bg-[#11141e] shadow-md dark:shadow-2xl flex flex-col md:flex-row group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isCheckedIn
          ? 'border-emerald-500/30 hover:border-emerald-500/60 dark:border-emerald-500/20 dark:hover:border-emerald-500/40'
          : 'border-slate-200 dark:border-[#1e2536] hover:border-[#FF5C00]/60'
      }`}
    >
      {/* Left Badge Indicator Stripe */}
      <div className={`w-full md:w-3.5 transition-colors ${isCheckedIn ? 'bg-emerald-500' : 'bg-[#FF5C00]'}`} />

      {/* Main Content */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
        <div>
          {/* Top status & category */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Badge variant={isCheckedIn ? 'success' : 'tangerine'} className="shadow-sm">
                {isCheckedIn ? (
                  <span className="flex items-center gap-1 font-bold">
                    <CheckCircle2 className="h-3 w-3" /> Sudah Check-In
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-bold">
                    <Clock className="h-3 w-3" /> Tiket Aktif
                  </span>
                )}
              </Badge>

              <Badge variant="secondary" className="font-bold">
                {ticket.ticket_type?.name}
              </Badge>

              <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                #{ticket.registration?.registration_number}
              </span>
            </div>

            {/* Checked-In Visual Stamp or Quick Action */}
            {isCheckedIn ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border-2 border-dashed border-emerald-500/70 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-black text-xs uppercase tracking-widest rotate-[-2deg]">
                <CheckCircle2 className="h-3.5 w-3.5" /> CHECKED IN
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs font-bold text-[#FF5C00] group-hover:translate-x-1 transition-transform">
                <span>Lihat Detail</span>
                <ArrowUpRight className="h-4 w-4" />
              </div>
            )}
          </div>

          {/* Event Name */}
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display group-hover:text-[#FF5C00] dark:group-hover:text-orange-400 transition-colors">
            {event?.name}
          </h2>

          {/* Attendee Details */}
          <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161B28]/60 border border-slate-200 dark:border-[#22293b] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">
                Nama Peserta:
              </span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{ticket.attendee_name}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">
                Email:
              </span>
              <span className="text-slate-700 dark:text-slate-300 truncate block">{ticket.attendee_email || userEmail}</span>
            </div>
          </div>

          {/* Event Time & Venue */}
          <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500 dark:text-orange-400 shrink-0" />
              <span>{formatDate(event?.start_time)} WIB</span>
            </p>
            <p className="flex items-center gap-2">
              {venue?.type === 'online' ? (
                <>
                  <Video className="h-4 w-4 text-blue-500 dark:text-blue-400 shrink-0" />
                  <span>
                    {venue?.platform} {venue?.url && `(${venue.url})`}
                  </span>
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 text-[#FF5C00] shrink-0" />
                  <span>{venue?.address || venue?.name}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Card Footer status info */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#1e2536] flex items-center justify-between text-xs">
          {isCheckedIn ? (
            <div className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>Diverifikasi pada {formatDate(ticket.checked_in_at)} WIB</span>
            </div>
          ) : (
            <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-orange-500" />
              <span>Klik kartu ini untuk membuka e-tiket & opsi cetak</span>
            </div>
          )}

          <span className="text-[11px] font-semibold text-slate-400 group-hover:text-[#FF5C00] transition-colors hidden sm:inline">
            Detail Tiket &rarr;
          </span>
        </div>
      </div>

      {/* Perforated separator on desktop */}
      <div className="relative hidden md:flex flex-col items-center justify-between py-4">
        <div className="w-5 h-5 rounded-full bg-[#F8F9FA] dark:bg-[#090A0F] -mt-6 border-b border-slate-200 dark:border-[#1e2536]" />
        <div className="w-[1px] h-full border-r-2 border-dashed border-slate-300 dark:border-[#1e2536]" />
        <div className="w-5 h-5 rounded-full bg-[#F8F9FA] dark:bg-[#090A0F] -mb-6 border-t border-slate-200 dark:border-[#1e2536]" />
      </div>

      {/* Right QR Code Section */}
      <div className="p-6 sm:p-8 bg-slate-50/80 dark:bg-[#0c0e16] border-t md:border-t-0 md:border-l border-slate-200 dark:border-[#1e2536] flex flex-col items-center justify-center text-center min-w-[240px]">
        <div className={`p-3 bg-white rounded-2xl shadow-md border ${isCheckedIn ? 'opacity-85' : 'border-slate-200/60 dark:border-none'}`}>
          <QRCodeSVG value={ticket.ticket_code} size={130} level="H" includeMargin={false} />
        </div>

        <div className="mt-4">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-semibold font-mono">
            Kode Tiket
          </span>
          <span className="font-mono text-sm font-extrabold text-[#FF5C00] tracking-wider block">
            {ticket.ticket_code}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {isCheckedIn ? 'Tiket Telah Dipindai' : 'Pindai saat check-in'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
