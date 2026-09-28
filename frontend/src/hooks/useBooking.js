import { useState, useEffect } from 'react'
import { registrationService } from '../api'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'

export function useBooking({
  event,
  initialTierId = null,
  initialQuantity = 1,
  user,
  isAuthenticated,
  onClose,
  onSuccess,
}) {
  const [selectedTierId, setSelectedTierId] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [attendees, setAttendees] = useState([])
  const [paymentMethod, setPaymentMethod] = useState('QRIS Instant')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (event && event.ticket_types && event.ticket_types.length > 0) {
      const activeTierId =
        initialTierId && event.ticket_types.some((t) => t.id === initialTierId)
          ? initialTierId
          : (event.ticket_types.find((t) => t.remaining_capacity > 0) || event.ticket_types[0]).id

      setSelectedTierId(activeTierId)
      const qty = Math.max(1, initialQuantity || 1)
      setQuantity(qty)

      const list = [{ name: user?.name || '', email: user?.email || '' }]
      for (let i = 1; i < qty; i++) {
        list.push({ name: '', email: '' })
      }
      setAttendees(list)
    }
  }, [event, user, initialTierId, initialQuantity])

  const selectedTier = event?.ticket_types?.find((t) => t.id === selectedTierId)

  const updateAttendeeCount = (newQty) => {
    const list = [...attendees]
    while (list.length < newQty) {
      list.push({ name: '', email: '' })
    }
    while (list.length > newQty) {
      list.pop()
    }
    setAttendees(list)
  }

  const handleTierChange = (tierId) => {
    setSelectedTierId(tierId)
    const tier = event?.ticket_types?.find((t) => t.id === tierId)
    if (tier && quantity > tier.remaining_capacity) {
      const safeQty = Math.max(1, tier.remaining_capacity)
      setQuantity(safeQty)
      updateAttendeeCount(safeQty)
    }
  }

  const handleQtyChange = (delta) => {
    if (!selectedTier) return
    const newQty = quantity + delta
    if (newQty < 1) return
    if (newQty > selectedTier.remaining_capacity) {
      toast.error(`Maksimal ${selectedTier.remaining_capacity} tiket untuk kategori ini.`)
      return
    }
    setQuantity(newQty)
    updateAttendeeCount(newQty)
  }

  const handleAttendeeField = (index, field, value) => {
    const updated = [...attendees]
    updated[index][field] = value
    setAttendees(updated)
  }

  const submitBooking = async (e) => {
    if (e && e.preventDefault) e.preventDefault()

    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu untuk memesan tiket.')
      return
    }

    if (!selectedTier) {
      toast.error('Pilih jenis tiket.')
      return
    }

    for (let i = 0; i < attendees.length; i++) {
      if (!attendees[i].name.trim()) {
        toast.error(`Nama peserta #${i + 1} wajib diisi.`)
        return
      }
    }

    setLoading(true)
    setError('')

    try {
      const items = attendees.map((a) => ({
        ticket_type_id: selectedTier.id,
        attendee_name: a.name.trim(),
        attendee_email: a.email.trim() || user?.email,
      }))

      const res = await registrationService.bookTickets({
        event_id: event.id,
        payment_method: paymentMethod,
        items,
      })

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })

      toast.success('Pemesanan tiket berhasil dikonfirmasi!')
      if (onClose) onClose()
      if (onSuccess) onSuccess(res.data)
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal memproses pemesanan tiket.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return {
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
  }
}
