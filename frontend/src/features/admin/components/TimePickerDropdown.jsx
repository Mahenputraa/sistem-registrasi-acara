import React from 'react'

// Generate 00 to 23
export const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))

// Generate 00 to 59
export const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

/**
 * Reusable two-part time picker dropdown:
 * - Hour dropdown: 00 to 23
 * - Minute dropdown: 00 to 59
 *
 * @param {string} value - Format 'HH:mm' or 'HH.mm' (e.g. '13:00')
 * @param {function} onChange - Callback returning updated 'HH:mm'
 * @param {string} [label] - Optional field label
 * @param {string} [className] - Optional container class
 */
export function TimePickerDropdown({
  value = '09:00',
  onChange,
  label,
  className = '',
}) {
  const cleanVal = (value || '09:00').toString().replace('.', ':')
  const [rawH = '09', rawM = '00'] = cleanVal.split(':')

  const parsedH = Number(rawH)
  const safeH = isNaN(parsedH) ? '09' : String(Math.min(23, Math.max(0, parsedH))).padStart(2, '0')

  const parsedM = Number(rawM)
  const safeM = isNaN(parsedM) ? '00' : String(Math.min(59, Math.max(0, parsedM))).padStart(2, '0')

  const handleHourChange = (newH) => {
    if (onChange) {
      onChange(`${newH}:${safeM}`)
    }
  }

  const handleMinuteChange = (newM) => {
    if (onChange) {
      onChange(`${safeH}:${newM}`)
    }
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <span className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400">
          {label}
        </span>
      )}

      <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {/* Hour Dropdown */}
        <div className="flex flex-col items-center">
          <select
            value={safeH}
            onChange={(e) => handleHourChange(e.target.value)}
            className="w-14 sm:w-16 text-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 cursor-pointer shadow-sm hover:border-orange-500/40 transition-colors"
            title="Pilih Jam (00 - 23)"
          >
            {HOURS.map((h) => (
              <option key={`hour-${h}`} value={h}>
                {h}
              </option>
            ))}
          </select>
          <span className="text-[9px] text-slate-400 font-sans tracking-wide mt-0.5">
            Jam
          </span>
        </div>

        {/* Separator Colon */}
        <span className="text-base font-black text-slate-400 dark:text-slate-500 pb-3 select-none">
          :
        </span>

        {/* Minute Dropdown */}
        <div className="flex flex-col items-center">
          <select
            value={safeM}
            onChange={(e) => handleMinuteChange(e.target.value)}
            className="w-14 sm:w-16 text-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 cursor-pointer shadow-sm hover:border-orange-500/40 transition-colors"
            title="Pilih Menit (00 - 59)"
          >
            {MINUTES.map((m) => (
              <option key={`minute-${m}`} value={m}>
                {m}
              </option>
            ))}
          </select>
          <span className="text-[9px] text-slate-400 font-sans tracking-wide mt-0.5">
            Menit
          </span>
        </div>

        <span className="text-[10px] font-mono font-semibold text-slate-400 px-1 pb-3 select-none">
          WIB
        </span>
      </div>
    </div>
  )
}
