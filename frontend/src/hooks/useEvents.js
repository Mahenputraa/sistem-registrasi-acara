import { useState, useEffect, useCallback } from 'react'
import { eventService } from '../api'
import { useDebounce } from './useDebounce'

// Global in-memory cache for instant SWR renders
const eventsCache = new Map()

export function useEvents(initialType = 'all') {
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState(initialType)
  const debouncedSearch = useDebounce(search, 350)

  const cacheKey = `${debouncedSearch.trim()}_${selectedType}`
  const cachedData = eventsCache.get(cacheKey)

  const [events, setEvents] = useState(cachedData || [])
  const [loading, setLoading] = useState(!cachedData)
  const [error, setError] = useState(null)

  const fetchEvents = useCallback(async () => {
    try {
      const existing = eventsCache.get(cacheKey)
      if (existing) {
        setEvents(existing)
        setLoading(false)
      } else {
        setLoading(true)
      }
      setError(null)
      const params = {}
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim()
      if (selectedType !== 'all') params.type = selectedType

      const data = await eventService.getEvents(params)
      const validData = data || []
      eventsCache.set(cacheKey, validData)
      setEvents(validData)
    } catch (err) {
      console.error('Failed to fetch events:', err)
      setError(err?.response?.data?.message || 'Gagal memuat daftar acara')
    } finally {
      setLoading(false)
    }
  }, [cacheKey, debouncedSearch, selectedType])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  return {
    events,
    loading,
    error,
    search,
    setSearch,
    selectedType,
    setSelectedType,
    refetch: fetchEvents,
  }
}
