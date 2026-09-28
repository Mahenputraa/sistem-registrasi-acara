import React from 'react'
import { QrCode, ScanLine, ArrowRight } from 'lucide-react'
import { Button } from '../../../components/ui/button'

export function ScannerQuickActionCard({ onOpenScanner }) {
  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-slate-50 dark:from-[#FF5C00]/15 dark:via-orange-950/10 dark:to-[#11141e] border border-orange-500/25 dark:border-[#293247] shadow-sm mb-8 transition-all duration-300">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side: Status & Description */}
        <div className="flex items-start gap-4 sm:gap-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FF5C00] text-white flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0">
            <ScanLine className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Scanner Presensi Siap Digunakan
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
              Pemindai QR Code Check-In Peserta
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Validasi e-tiket pengunjung di pintu gerbang acara dengan kamera perangkat secara instan. Status kehadiran peserta langsung terdata di sistem secara real-time.
            </p>
          </div>
        </div>

        {/* Right Side: Prominent Action Button */}
        <div className="shrink-0 self-start md:self-center">
          <Button
            type="button"
            onClick={onOpenScanner}
            className="w-full sm:w-auto px-6 py-3.5 h-auto rounded-2xl bg-[#FF5C00] hover:bg-[#FF7322] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <QrCode className="w-4 h-4 mr-2" />
            <span>Buka Scanner QR Check-In</span>
            <ArrowRight className="w-3.5 h-3.5 ml-2 opacity-70" />
          </Button>
        </div>
      </div>
    </div>
  )
}
