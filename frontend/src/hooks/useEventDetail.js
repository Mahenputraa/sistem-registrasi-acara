import { useState, useEffect, useCallback } from 'react'
import { eventService } from '../api'
import { toast } from 'sonner'

// Global in-memory cache for event details to enable instant renders
const eventDetailCache = new Map()

export function useEventDetail(id) {
  const cachedData = id ? eventDetailCache.get(String(id)) : null
  const [event, setEvent] = useState(cachedData || null)
  const [loading, setLoading] = useState(!cachedData)
  const [error, setError] = useState('')
  const [selectedTierId, setSelectedTierId] = useState(null)
  const [quantity, setQuantity] = useState(1)

  // Initialize selectedTierId if cached data is available immediately
  useEffect(() => {
    if (cachedData?.ticket_types && cachedData.ticket_types.length > 0) {
      const available = cachedData.ticket_types.find((t) => t.remaining_capacity > 0) || cachedData.ticket_types[0]
      setSelectedTierId(available.id)
    }
  }, [cachedData])

  const fetchEventDetail = useCallback(async () => {
    if (!id) return
    try {
      const existing = eventDetailCache.get(String(id))
      if (!existing) {
        setLoading(true)
      }
      setError('')
      const data = await eventService.getEventById(id)
      if (data) {
        eventDetailCache.set(String(id), data)
        setEvent(data)

        if (data.ticket_types && data.ticket_types.length > 0) {
          const available = data.ticket_types.find((t) => t.remaining_capacity > 0) || data.ticket_types[0]
          setSelectedTierId(available.id)
        }
      }
    } catch (err) {
      console.error('Failed to fetch event detail:', err)
      setError('Acara tidak ditemukan atau telah berakhir.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchEventDetail()
  }, [fetchEventDetail])

  const selectedTier = event?.ticket_types?.find((t) => t.id === selectedTierId)
  const totalPrice = (selectedTier?.price || 0) * quantity

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Tautan acara berhasil disalin ke clipboard!')
    }
  }

  const getGoogleCalendarUrl = () => {
    if (!event) return '#'
    const formatGDate = (d) => new Date(d).toISOString().replace(/-|:|\.\d\d\d/g, '')
    const start = formatGDate(event.start_time)
    const end = formatGDate(event.end_time || event.start_time)
    const title = encodeURIComponent(event.name)
    const details = encodeURIComponent(event.description || '')
    const location = encodeURIComponent(
      event.venue?.type === 'online'
        ? event.venue?.url || 'Online Webinar'
        : event.venue?.address || event.venue?.name || ''
    )
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`
  }

  return {
    event,
    loading,
    error,
    selectedTier,
    selectedTierId,
    setSelectedTierId,
    quantity,
    setQuantity,
    totalPrice,
    handleShare,
    calendarUrl: getGoogleCalendarUrl(),
    refetch: fetchEventDetail,
  }
}
