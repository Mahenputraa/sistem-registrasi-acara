import React from 'react'
import { Input } from '../../../components/ui/input'
import { CurrencyInput } from '../../../components/ui/CurrencyInput'
import { Ticket, PlusCircle, X, Lock } from 'lucide-react'

export function TicketTypeFormBuilder({
  ticketTypes = [],
  onAddTicketType,
  onRemoveTicketType,
  onTicketTypeChange,
}) {
  return (
    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Ticket className="h-4 w-4 text-[#FF5C00]" />
            Kategori & Harga Tiket
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Tentukan kategori tiket, kuota kursi, dan harga tiket
          </p>
        </div>
        <button
          type="button"
          onClick={onAddTicketType}
          className="text-xs font-bold text-[#FF5C00] hover:text-[#FF7322] flex items-center gap-1 cursor-pointer"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      <div className="space-y-4">
        {ticketTypes.map((tier, idx) => {
          const isLocked = Boolean(tier.sold_count && tier.sold_count > 0)

          return (
            <div
              key={tier.id || `tier-${idx}`}
              className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 relative group"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono text-[10px] font-bold">
                    Kategori #{idx + 1}
                  </span>
                  {isLocked && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                      <Lock className="h-3 w-3" /> {tier.sold_count} Tiket Terjual
                    </span>
                  )}
                </div>

                {!isLocked && ticketTypes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveTicketType(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Hapus Kategori Tiket Ini"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Nama Kategori Tiket *
                  </label>
                  <Input
                    required
                    placeholder="cth: General Admission / VIP"
                    value={tier.name}
                    onChange={(e) => onTicketTypeChange(idx, 'name', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Kapasitas / Kuota Tiket *
                  </label>
                  <Input
                    type="number"
                    required
                    min={tier.sold_count || 1}
                    placeholder="50"
                    value={tier.capacity}
                    onChange={(e) => onTicketTypeChange(idx, 'capacity', Number(e.target.value))}
                  />
                  {isLocked && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
                      Minimal {tier.sold_count} tiket (sesuai penjualan saat ini).
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Harga Tiket (IDR) *
                </label>
                <CurrencyInput
                  value={tier.price}
                  onChange={(newPrice) => onTicketTypeChange(idx, 'price', newPrice)}
                  placeholder="0"
                  showPresets={true}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
