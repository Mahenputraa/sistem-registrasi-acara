import { useState } from 'react'
import { registrationService } from '../api'
import { toast } from 'sonner'

export function useCheckIn() {
  const [ticketCode, setTicketCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleScan = async (e) => {
    if (e?.preventDefault) e.preventDefault()
    if (!ticketCode.trim()) return

    setLoading(true)
    setResult(null)

    try {
      const res = await registrationService.checkInTicket(ticketCode.trim())
      setResult({
        type: 'success',
        message: res.message,
        ticket: res.data,
      })
      toast.success(res.message)
      setTicketCode('')
    } catch (err) {
      const msg = err.response?.data?.message || 'Kode tiket tidak valid atau terjadi kesalahan.'
      const isWarning = err.response?.status === 422 && err.response?.data?.status === 'warning'
      setResult({
        type: isWarning ? 'warning' : 'error',
        message: msg,
        ticket: err.response?.data?.data,
      })
      if (isWarning) {
        toast.warning(msg)
      } else {
        toast.error(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setTicketCode('')
    setLoading(false)
  }

  return {
    ticketCode,
    setTicketCode,
    loading,
    result,
    handleScan,
    reset,
  }
}
