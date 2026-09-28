import React from 'react'
import { Modal } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useCheckIn } from '../hooks'
import { QrCode, CheckCircle2, AlertTriangle, XCircle, Search } from 'lucide-react'

export function CheckInModal({ isOpen, onClose }) {
  const { ticketCode, setTicketCode, loading, result, handleScan, reset } = useCheckIn()

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Check-In Scanner Acara"
      description="Verifikasi kode QR atau masukkan kode tiket peserta"
      className="max-w-md"
    >
      <div className="space-y-4">
        {/* Scanner Simulation Box */}
        <div className="relative h-44 rounded-2xl bg-slate-100 dark:bg-slate-950 border-2 border-dashed border-orange-500/40 flex flex-col items-center justify-center p-4 text-center overflow-hidden transition-colors">
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#FF5C00] to-transparent animate-pulse" />
          <QrCode className="h-12 w-12 text-[#FF5C00] mb-2 opacity-80" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Arahkan barcode scanner atau ketikkan kode tiket di bawah:
          </p>
        </div>

        <form onSubmit={handleScan} className="flex gap-2">
          <Input
            placeholder="cth: TKT-1234-ABCD..."
            value={ticketCode}
            onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
            autoFocus
            className="font-mono uppercase text-xs"
          />
          <Button type="submit" variant="default" disabled={loading || !ticketCode.trim()}>
            {loading ? 'Cek...' : <Search className="h-4 w-4" />}
          </Button>
        </form>

        {/* Validation Result Box */}
        {result && (
          <div
            className={`p-4 rounded-2xl border ${
              result.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
                : result.type === 'warning'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-200'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {result.type === 'success' ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              ) : result.type === 'warning' ? (
                <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="text-sm font-bold">{result.message}</p>
                {result.ticket && (
                  <div className="text-xs space-y-0.5 opacity-90 pt-1">
                    <p>Peserta: <strong className="text-slate-900 dark:text-white">{result.ticket.attendee_name}</strong></p>
                    <p>Kategori: {result.ticket.ticket_type?.name}</p>
                    <p>Acara: {result.ticket.registration?.event?.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
