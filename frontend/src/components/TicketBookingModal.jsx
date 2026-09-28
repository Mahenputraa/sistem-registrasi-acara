import React from 'react'
import { Modal } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { formatCurrency } from '../lib/utils'
import { useAuth } from '../context/AuthContext'
import { useBooking } from '../hooks'
import { 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  AlertCircle,
  Plus, 
  Minus, 
  Sparkles 
} from 'lucide-react'

export function TicketBookingModal({
  isOpen,
  onClose,
  event,
  initialTierId = null,
  initialQuantity = 1,
  onSuccess,
}) {
  const { user, isAuthenticated } = useAuth()
  const {
    selectedTierId,
    selectedTier,
    quantity,
    attendees,
    paymentMethod,
    loading,
    error,
    setPaymentMethod,
    handleTierChange,
    handleQtyChange,
    handleAttendeeField,
    submitBooking,
  } = useBooking({
    event,
    initialTierId,
    initialQuantity,
    user,
    isAuthenticated,
    onClose,
    onSuccess,
  })

  if (!event) return null

  const subtotal = (selectedTier?.price || 0) * quantity

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pesan Tiket Acara"
      description={event.name}
      className="max-w-xl"
    >
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={submitBooking} className="space-y-5">
        {/* Tier selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wider">
            1. Pilih Kategori Tiket
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {event.ticket_types?.map((tier) => {
              const isSelected = tier.id === selectedTierId
              const isSoldOut = tier.remaining_capacity <= 0

              return (
                <div
                  key={tier.id}
                  onClick={() => !isSoldOut && handleTierChange(tier.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSoldOut
                      ? 'opacity-40 border-slate-200 dark:border-[#1e2536] bg-slate-100 dark:bg-[#161B28]/30 cursor-not-allowed'
                      : isSelected
                      ? 'border-[#FF5C00] bg-orange-500/10 shadow-md shadow-orange-500/10'
                      : 'border-slate-200 dark:border-[#1e2536] bg-slate-50 dark:bg-[#161B28]/60 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{tier.name}</span>
                    <Badge
                      variant={isSoldOut ? 'destructive' : isSelected ? 'tangerine' : 'secondary'}
                      className="text-[10px]"
                    >
                      {isSoldOut ? 'Habis' : `${tier.remaining_capacity} sisa`}
                    </Badge>
                  </div>
                  <p className="text-base font-extrabold text-[#FF5C00]">
                    {formatCurrency(tier.price)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quantity selector */}
        {selectedTier && selectedTier.remaining_capacity > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                2. Jumlah Tiket
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Sisa kuota: {selectedTier.remaining_capacity}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleQtyChange(-1)}
                disabled={quantity <= 1}
                className="h-10 w-10 rounded-xl bg-white dark:bg-[#161B28] hover:bg-slate-100 dark:hover:bg-[#202738] border border-slate-300 dark:border-[#293247] disabled:opacity-30 flex items-center justify-center text-slate-900 dark:text-white transition-colors cursor-pointer shadow-sm"
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className="font-bold text-lg text-slate-900 dark:text-white w-12 text-center font-mono">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => handleQtyChange(1)}
                disabled={quantity >= selectedTier.remaining_capacity}
                className="h-10 w-10 rounded-xl bg-white dark:bg-[#161B28] hover:bg-slate-100 dark:hover:bg-[#202738] border border-slate-300 dark:border-[#293247] disabled:opacity-30 flex items-center justify-center text-slate-900 dark:text-white transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Attendee Info Inputs */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wider">
            3. Informasi Peserta
          </label>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {attendees.map((attendee, index) => (
              <div key={index} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161B28]/60 border border-slate-200 dark:border-[#293247] space-y-2">
                <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 font-mono">
                  PESERTA #{index + 1}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    placeholder="Nama lengkap peserta *"
                    value={attendee.name}
                    onChange={(e) => handleAttendeeField(index, 'name', e.target.value)}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email tiket (opsional)"
                    value={attendee.email}
                    onChange={(e) => handleAttendeeField(index, 'email', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wider">
            4. Metode Pembayaran
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'QRIS Instant', name: 'QRIS', icon: QrCode },
              { id: 'Virtual Account', name: 'VA Bank', icon: CreditCard },
              { id: 'Credit Card', name: 'Kartu Kredit', icon: Sparkles },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaymentMethod(m.id)}
                className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === m.id
                    ? 'border-[#FF5C00] bg-orange-500/10 text-orange-600 dark:text-white font-semibold shadow-sm'
                    : 'border-slate-200 dark:border-[#1e2536] bg-slate-50 dark:bg-[#161B28]/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <m.icon className="h-3.5 w-3.5 text-[#FF5C00]" />
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Total Summary & Checkout Button */}
        <div className="pt-4 border-t border-slate-200 dark:border-[#1e2536] space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Total Pembayaran ({quantity} tiket):</span>
            <span className="text-xl font-extrabold text-[#FF5C00] font-mono">
              {formatCurrency(subtotal)}
            </span>
          </div>

          <Button
            type="submit"
            variant="default"
            className="w-full uppercase font-bold tracking-wider py-3.5"
            size="lg"
            disabled={loading || !selectedTier || selectedTier.remaining_capacity <= 0}
          >
            {loading ? (
              'Memproses Transaksi...'
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Bayar & Dapatkan Tiket Sekarang
              </span>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
