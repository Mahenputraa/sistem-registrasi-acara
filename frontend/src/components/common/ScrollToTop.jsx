import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Ensures window scroll is properly handled across route changes.
 * When animated route transitions are active, scroll reset is synchronized
 * with page mount in PageTransition to prevent scroll jump during page exit.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Fallback scroll check if PageTransition is not active on a route
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }, 180)

    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
