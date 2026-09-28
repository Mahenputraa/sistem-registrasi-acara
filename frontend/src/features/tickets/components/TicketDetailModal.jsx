import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { formatDate, formatCurrency } from '../../../lib/utils'
import { useModalStore } from '../../../stores/useModalStore'
import { printTicket } from '../utils/printTicket'
import { TicketQRCard } from './TicketQRCard'
import {
  X,
  Calendar,
  MapPin,
  Video,
  Printer,
  ExternalLink,
  CheckCircle2,
  User,
  Building2,
  Sparkles,
} from 'lucide-react'

export function TicketDetailModal({ isOpen, onClose, ticket, userEmail }) {
  const navigate = useNavigate()
  const setTicketDetailModalOpen = useModalStore((s) => s.setTicketDetailModalOpen)

  useEffect(() => {
    if (isOpen) {
      setTicketDetailModalOpen(true)
      document.body.style.overflow = 'hidden'
    } else {
      setTicketDetailModalOpen(false)
      document.body.style.overflow = 'unset'
    }
    return () => {
      setTicketDetailModalOpen(false)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, setTicketDetailModalOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen && !ticket) return null

  const event = ticket?.registration?.event
  const venue = event?.venue
  const isCheckedIn = ticket?.status === 'checked-in'
  const isOnline = venue?.type === 'online'

  const handleGoToEvent = () => {
    onClose()
    if (event?.id) {
      navigate(`/events/${event.id}`)
    }
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && ticket && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 dark:bg-black/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="relative z-10 w-full max-w-2xl my-auto rounded-3xl border border-slate-200 dark:border-[#22293b] bg-white dark:bg-[#10141f] shadow-2xl text-slate-900 dark:text-slate-100 overflow-hidden"
          >
            {/* Top Accent Strip */}
            <div className={`h-2.5 w-full ${isCheckedIn ? 'bg-emerald-500' : 'bg-gradient-to-r from-[#FF5C00] to-amber-500'}`} />

            {/* Header Modal */}
            <div className="p-6 sm:p-7 border-b border-slate-200 dark:border-[#1e2536] flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant={isCheckedIn ? 'success' : 'tangerine'} className="text-xs px-2.5 py-0.5">
                    {isCheckedIn ? (
                      <span className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5" /> SUDAH CHECK-IN
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 font-bold">
                        <Sparkles className="h-3.5 w-3.5" /> TIKET AKTIF
                      </span>
                    )}
                  </Badge>

                  <Badge variant="secondary" className="text-xs font-bold">
                    {ticket.ticket_type?.name || 'General'}
                  </Badge>

                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    Reg #{ticket.registration?.registration_number}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display leading-tight">
                  {event?.name}
                </h2>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a2133] transition-colors cursor-pointer shrink-0"
                aria-label="Tutup Detail Tiket"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 space-y-6 max-h-[72vh] overflow-y-auto custom-scrollbar">
              
              {/* QR Code & Ticket Code Component */}
              <TicketQRCard ticket={ticket} />

              {/* Event & Venue Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#151926]/70 border border-slate-200 dark:border-[#1e2536] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                    <Calendar className="h-4 w-4 text-[#FF5C00]" />
                    <span>Jadwal Pelaksanaan</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {formatDate(event?.start_time)} WIB
                  </p>
                  {event?.end_time && (
                    <p className="text-xs text-slate-500">
                      Selesai: {formatDate(event?.end_time)} WIB
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#151926]/70 border border-slate-200 dark:border-[#1e2536] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                    {isOnline ? (
                      <Video className="h-4 w-4 text-blue-500" />
                    ) : (
                      <MapPin className="h-4 w-4 text-[#FF5C00]" />
                    )}
                    <span>Lokasi / Platform</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {isOnline ? venue?.platform || 'Online Webinar' : venue?.name || 'Venue Fisik'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {isOnline ? (
                      venue?.url ? (
                        <a
                          href={venue.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500 hover:underline flex items-center gap-1 inline-flex"
                        >
                          Buka Link Webinar <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        'Tautan webinar akan aktif saat acara dimulai'
                      )
                    ) : (
                      venue?.address || 'Alamat venue di tiket'
                    )}
                  </p>
                </div>
              </div>

              {/* Attendee & Registration Information */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#151926]/70 border border-slate-200 dark:border-[#1e2536]">
                <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-4 flex items-center gap-2">
                  <User className="h-4 w-4 text-orange-500" />
                  Rincian Peserta & Registrasi
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">
                      Nama Peserta:
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {ticket.attendee_name}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">
                      Email Terdaftar:
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {ticket.attendee_email || userEmail || '-'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">
                      Jenis Tiket & Harga:
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {ticket.ticket_type?.name} ({formatCurrency(ticket.ticket_type?.price)})
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">
                      Status Pembayaran:
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
                      {ticket.registration?.payment_status || 'Paid'} ({ticket.registration?.payment_method || 'Online'})
                    </span>
                  </div>

                  {event?.organizer?.name && (
                    <div className="sm:col-span-2 pt-2 border-t border-slate-200 dark:border-[#22293b] flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" />
                      <span>Diselenggarakan oleh: <strong>{event.organizer.name}</strong></span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Footer Action Buttons */}
            <div className="p-5 sm:p-6 border-t border-slate-200 dark:border-[#1e2536] bg-slate-50/50 dark:bg-[#0c0e16]/50 flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => printTicket(ticket, userEmail)}
                className="gap-2 text-xs"
              >
                <Printer className="h-4 w-4" /> Cetak E-Tiket Ini
              </Button>

              <div className="flex items-center gap-2">
                {event?.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleGoToEvent}
                    className="gap-1.5 text-xs text-[#FF5C00] hover:text-[#FF7322] hover:bg-orange-500/10"
                  >
                    Halaman Acara <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                )}

                <Button
                  variant="default"
                  size="sm"
                  onClick={onClose}
                  className="text-xs px-5"
                >
                  Tutup
                </Button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}
