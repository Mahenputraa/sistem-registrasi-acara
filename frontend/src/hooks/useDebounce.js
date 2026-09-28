import { useState, useEffect } from 'react'

/**
 * Custom hook to debounce any fast-changing value.
 * Useful for search inputs, resize events, etc.
 *
 * @param {any} value
 * @param {number} delay in milliseconds (default: 350)
 * @returns {any} debouncedValue
 */
export function useDebounce(value, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
