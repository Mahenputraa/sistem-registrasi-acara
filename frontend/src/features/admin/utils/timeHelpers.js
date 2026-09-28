/**
 * Utility functions for handling event and rundown time calculations,
 * dropdown slot generations, and duration adjustments.
 */

/**
 * Generate 24-hour time slots in specified minute increments (default 15 minutes).
 * Returns array like ['00:00', '00:15', ..., '23:45']
 */
export function generateTimeSlots(stepMinutes = 15) {
  const slots = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      const hh = String(h).padStart(2, '0')
      const mm = String(m).padStart(2, '0')
      slots.push(`${hh}:${mm}`)
    }
  }
  return slots
}

export const TIME_SLOTS_15MIN = generateTimeSlots(15)

/**
 * Add minutes to a 'HH:mm' time string, wrapping around 24 hours cleanly.
 * @param {string} timeStr - e.g. '09:00'
 * @param {number} minutesToAdd - e.g. 60
 * @returns {string} - e.g. '10:00'
 */
export function addMinutesToTime(timeStr, minutesToAdd) {
  if (!timeStr || typeof timeStr !== 'string' || !timeStr.includes(':')) {
    return '10:00'
  }
  const [h, m] = timeStr.split(':').map(Number)
  if (isNaN(h) || isNaN(m)) return '10:00'

  const total = h * 60 + m + minutesToAdd
  const modTotal = ((total % 1440) + 1440) % 1440
  const newH = Math.floor(modTotal / 60)
  const newM = modTotal % 60
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`
}

/**
 * Compare two 'HH:mm' time strings.
 * Returns negative if t1 < t2, 0 if equal, positive if t1 > t2.
 */
export function compareTimes(t1, t2) {
  if (!t1 || !t2) return 0
  const [h1, m1] = t1.split(':').map(Number)
  const [h2, m2] = t2.split(':').map(Number)
  return (h1 * 60 + m1) - (h2 * 60 + m2)
}

/**
 * Parse a rundown time string (e.g. '08:30 - 10:00', '09.00 - 11.00', '13.00')
 * into separate { start, end } components.
 */
export function parseTimeRange(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') {
    return { start: '09:00', end: '10:00', isCustom: false }
  }

  const clean = timeStr.trim().replace(/\./g, ':').replace(/[–—]/g, '-')
  const parts = clean.split('-').map((s) => s.trim())
  const timeRegex = /^([01]?\d|2[0-4]):([0-5]\d)$/

  if (parts.length === 2 && timeRegex.test(parts[0]) && timeRegex.test(parts[1])) {
    return {
      start: parts[0].padStart(5, '0'),
      end: parts[1].padStart(5, '0'),
      isCustom: false,
    }
  }

  if (parts.length === 1 && timeRegex.test(parts[0])) {
    const start = parts[0].padStart(5, '0')
    return {
      start,
      end: addMinutesToTime(start, 60),
      isCustom: false,
    }
  }

  // Fallback for custom or unparsed text
  return {
    start: '09:00',
    end: '10:00',
    isCustom: true,
    customText: timeStr,
  }
}

/**
 * Format start and end time back into standard 'HH:mm - HH:mm' format.
 */
export function formatTimeRange(start, end) {
  if (!start && !end) return ''
  if (!end) return start
  return `${start} - ${end}`
}

/**
 * Helper to add hours to datetime-local string (e.g. '2026-09-26T10:00')
 */
export function addHoursToDatetime(datetimeStr, hoursToAdd) {
  if (!datetimeStr) return ''
  const d = new Date(datetimeStr)
  if (isNaN(d.getTime())) return ''
  d.setHours(d.getHours() + hoursToAdd)

  const pad = (n) => String(n).padStart(2, '0')
  const YYYY = d.getFullYear()
  const MM = pad(d.getMonth() + 1)
  const DD = pad(d.getDate())
  const HH = pad(d.getHours())
  const mm = pad(d.getMinutes())
  return `${YYYY}-${MM}-${DD}T${HH}:${mm}`
}

/**
 * Split ISO datetime 'YYYY-MM-DDTHH:mm' into separate date and time.
 */
export function splitDatetime(datetimeStr) {
  if (!datetimeStr) return { date: '', time: '09:00' }
  const [d = '', t = '09:00'] = datetimeStr.split('T')
  return { date: d, time: t.substring(0, 5) || '09:00' }
}

/**
 * Combine date 'YYYY-MM-DD' and time 'HH:mm' into 'YYYY-MM-DDTHH:mm'.
 */
export function combineDatetime(date, time) {
  if (!date) return ''
  return `${date}T${time || '09:00'}`
}
