import { useState, useEffect, useCallback } from 'react'
import { registrationService } from '../api'
import { useAuth } from '../context/AuthContext'

// Global in-memory cache for user's tickets
let ticketsCache = null

export function useMyTickets() {
  const { isAuthenticated } = useAuth()
  const [tickets, setTickets] = useState(ticketsCache || [])
  const [loading, setLoading] = useState(!ticketsCache)
  const [error, setError] = useState(null)

  const fetchTickets = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }
    try {
      if (!ticketsCache) {
        setLoading(true)
      }
      setError(null)
      const data = await registrationService.getMyTickets()
      const validData = data || []
      ticketsCache = validData
      setTickets(validData)
    } catch (err) {
      console.error('Failed to fetch tickets:', err)
      setError(err?.response?.data?.message || 'Gagal memuat tiket')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  const printTickets = () => {
    window.print()
  }

  return {
    tickets,
    loading,
    error,
    refetch: fetchTickets,
    printTickets,
  }
}
