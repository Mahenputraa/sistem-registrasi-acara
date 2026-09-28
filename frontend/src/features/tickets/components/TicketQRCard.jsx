import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, Check, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '../../../lib/utils'

export function TicketQRCard({ ticket }) {
  const [copied, setCopied] = useState(false)
  const isCheckedIn = ticket?.status === 'checked-in'

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(ticket.ticket_code)
      setCopied(true)
      toast.success('Kode tiket berhasil disalin ke clipboard!', {
        description: ticket.ticket_code,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Gagal menyalin kode tiket.')
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-[#22293b] bg-slate-50/80 dark:bg-[#0c0e16] p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
      {/* Visual Watermark Stamp */}
      {isCheckedIn ? (
        <div className="absolute -right-2 -bottom-2 sm:right-6 sm:top-6 pointer-events-none opacity-20 sm:opacity-30 rotate-[-12deg]">
          <div className="border-4 border-dashed border-emerald-500 text-emerald-500 px-4 py-2 rounded-xl text-2xl font-black font-mono tracking-widest uppercase">
            CHECKED IN
          </div>
        </div>
      ) : (
        <div className="absolute -right-2 -bottom-2 sm:right-6 sm:top-6 pointer-events-none opacity-10 sm:opacity-20 rotate-[-12deg]">
          <div className="border-4 border-dashed border-orange-500 text-orange-500 px-4 py-2 rounded-xl text-2xl font-black font-mono tracking-widest uppercase">
            OFFICIAL PASS
          </div>
        </div>
      )}

      {/* QR SVG */}
      <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200 dark:border-none shrink-0">
        <QRCodeSVG
          value={ticket.ticket_code}
          size={140}
          level="H"
          includeMargin={false}
        />
      </div>

      {/* Code & Actions */}
      <div className="flex-1 text-center sm:text-left space-y-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 block font-mono">
            Kode E-Tiket Anda
          </span>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-black font-mono tracking-wider text-[#FF5C00] select-all">
              {ticket.ticket_code}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-[#2a3449] hover:bg-slate-200 dark:hover:bg-[#1a2133] text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Salin Kode Tiket"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {isCheckedIn ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Tiket telah digunakan pada {formatDate(ticket.checked_in_at)}</span>
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Tunjukkan QR Code ini pada petugas di gerbang masuk. Petugas akan memindai tiket untuk verifikasi kehadiran.
          </p>
        )}
      </div>
    </div>
  )
}
