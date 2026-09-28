import React, { useEffect } from 'react'
import { useAuthStore } from '../stores/useAuthStore'
export { useAuth } from '../hooks/useAuth'

export function AuthProvider({ children }) {
  const checkAuth = useAuthStore((s) => s.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return children
}
