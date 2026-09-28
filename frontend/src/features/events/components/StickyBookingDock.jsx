import React from 'react'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { formatCurrency } from '../../../lib/utils'
import { Ticket as TicketIcon, ShieldCheck } from 'lucide-react'

export function StickyBookingDock({
  event,
  selectedTierId,
  onSelectTier,
  quantity,
  onQuantityChange,
  onBook,
}) {
  const selectedTier = event?.ticket_types?.find((t) => t.id === selectedTierId)
  const isSoldOut = !event.ticket_types || event.ticket_types.every((t) => t.remaining_capacity <= 0)

  return (
    <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-[#1e2536] bg-white dark:bg-[#11141e] shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5C00]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#1e2536] mb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Pesan Tiket</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Pilih kategori & jumlah tiket</p>
        </div>
        <TicketIcon className="h-5 w-5 text-[#FF5C00]" />
      </div>

      {/* Ticket Tier Options */}
      <div className="space-y-3 mb-6">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
          Kategori Tiket Tersedia:
        </span>

        {event.ticket_types?.map((tier) => {
          const isSelected = tier.id === selectedTierId
          const isTierSoldOut = tier.remaining_capacity <= 0

          return (
            <div
              key={tier.id}
              onClick={() => !isTierSoldOut && onSelectTier(tier.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                isTierSoldOut
                  ? 'opacity-40 border-slate-200 dark:border-[#1e2536] bg-slate-100 dark:bg-[#161B28]/30 cursor-not-allowed'
                  : isSelected
                  ? 'border-[#FF5C00] bg-orange-500/10 shadow-lg shadow-orange-500/10'
                  : 'border-slate-200 dark:border-[#1e2536] bg-slate-50 dark:bg-[#161B28]/60 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-slate-900 dark:text-white">{tier.name}</span>
                <Badge
                  variant={isTierSoldOut ? 'destructive' : isSelected ? 'tangerine' : 'secondary'}
                  className="text-[10px]"
                >
                  {isTierSoldOut ? 'Habis' : `${tier.remaining_capacity} sisa`}
                </Badge>
              </div>

              <div className="flex items-baseline justify-between mt-2">
                <span className="text-base font-extrabold text-[#FF5C00]">
                  {formatCurrency(tier.price)}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">/ orang</span>
              </div>
            </div>
          )
        })}

        {(!event.ticket_types || event.ticket_types.length === 0) && (
          <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-[#1e2536] bg-slate-50/50 dark:bg-[#161B28]/30 text-center py-6">
            <TicketIcon className="h-6 w-6 mx-auto mb-2 text-slate-400" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Belum Ada Kategori Tiket</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Penyelenggara belum merilis tiket untuk acara ini.</p>
          </div>
        )}
      </div>

      {/* Quantity Stepper */}
      {selectedTier && selectedTier.remaining_capacity > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-[#161B28]/50 border border-slate-200 dark:border-[#22293b]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Jumlah Tiket</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Maksimal {selectedTier.remaining_capacity} tiket
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="h-8 w-8 rounded-lg bg-white dark:bg-[#11141e] border border-slate-300 dark:border-[#293247] hover:border-slate-400 dark:hover:border-slate-500 disabled:opacity-30 text-slate-900 dark:text-white flex items-center justify-center font-bold transition-colors cursor-pointer shadow-sm"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-slate-900 dark:text-white text-sm">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  onQuantityChange(Math.min(selectedTier.remaining_capacity, quantity + 1))
                }
                disabled={quantity >= selectedTier.remaining_capacity}
                className="h-8 w-8 rounded-lg bg-white dark:bg-[#11141e] border border-slate-300 dark:border-[#293247] hover:border-slate-400 dark:hover:border-slate-500 disabled:opacity-30 text-slate-900 dark:text-white flex items-center justify-center font-bold transition-colors cursor-pointer shadow-sm"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Total Calculation */}
      <div className="pt-4 border-t border-slate-200 dark:border-[#1e2536] space-y-2 mb-6">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Subtotal ({quantity} tiket):</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency((selectedTier?.price || 0) * quantity)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Biaya Layanan:</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Rp 0 (Promo)</span>
        </div>
        <div className="flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-[#1e2536]">
          <span>Total Pembayaran:</span>
          <span className="text-xl font-extrabold text-[#FF5C00]">
            {formatCurrency((selectedTier?.price || 0) * quantity)}
          </span>
        </div>
      </div>

      {/* Booking CTA Button */}
      <Button
        variant="default"
        size="lg"
        onClick={onBook}
        disabled={isSoldOut || !selectedTier || selectedTier.remaining_capacity <= 0}
        className="w-full text-sm font-bold uppercase tracking-wider py-3.5"
      >
        {isSoldOut ? 'Tiket Habis' : 'Pesan Tiket Sekarang'}
      </Button>

      <div className="mt-4 text-center">
        <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
          Transaksi Aman & Terenkripsi
        </span>
      </div>
    </div>
  )
}
