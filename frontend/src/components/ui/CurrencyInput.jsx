import React, { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'

// Helper function to spell numbers in Indonesian words
function terbilangRupiah(number) {
  const num = Math.floor(Math.abs(Number(number) || 0))
  if (num === 0) return 'Gratis (Tanpa Biaya Masuk)'

  const units = [
    '',
    'Satu',
    'Dua',
    'Tiga',
    'Empat',
    'Lima',
    'Enam',
    'Tujuh',
    'Delapan',
    'Sembilan',
    'Sepuluh',
    'Sebelas',
  ]

  function convert(n) {
    if (n < 12) return units[n]
    if (n < 20) return convert(n - 10) + ' Belas'
    if (n < 100) return convert(Math.floor(n / 10)) + ' Puluh ' + units[n % 10]
    if (n < 200) return 'Seratus ' + convert(n - 100)
    if (n < 1000) return convert(Math.floor(n / 100)) + ' Ratus ' + convert(n % 100)
    if (n < 2000) return 'Seribu ' + convert(n - 1000)
    if (n < 1000000) return convert(Math.floor(n / 1000)) + ' Ribu ' + convert(n % 1000)
    if (n < 1000000000) return convert(Math.floor(n / 1000000)) + ' Juta ' + convert(n % 1000000)
    return convert(Math.floor(n / 1000000000)) + ' Miliar ' + convert(n % 1000000000)
  }

  return convert(num).replace(/\s+/g, ' ').trim() + ' Rupiah'
}

// Format integer to dot-separated string: 100000 -> "100.000"
function formatThousand(val) {
  if (val === null || val === undefined || val === '') return ''
  const num = String(val).replace(/\D/g, '')
  if (!num) return ''
  return new Intl.NumberFormat('id-ID').format(Number(num))
}

const PRESETS = [
  { label: 'Gratis', value: 0 },
  { label: '50rb', value: 50000 },
  { label: '100rb', value: 100000 },
  { label: '250rb', value: 250000 },
  { label: '500rb', value: 500000 },
  { label: '1 Juta', value: 1000000 },
]

export function CurrencyInput({
  value,
  onChange,
  placeholder = '0',
  disabled = false,
  className = '',
  showPresets = true,
  id,
}) {
  const [displayValue, setDisplayValue] = useState(formatThousand(value))

  useEffect(() => {
    setDisplayValue(formatThousand(value))
  }, [value])

  const handleInputChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '')
    const numeric = raw === '' ? 0 : Number(raw)
    setDisplayValue(formatThousand(raw))
    onChange(numeric)
  }

  const handlePresetClick = (presetVal) => {
    setDisplayValue(formatThousand(presetVal))
    onChange(presetVal)
  }

  const numericValue = Number(value) || 0
  const isFree = numericValue === 0

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Input container with Rp prefix */}
      <div className="relative flex items-center rounded-xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-orange-500/50 focus-within:border-orange-500 overflow-hidden shadow-sm transition-all">
        <div className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border-r border-slate-300 dark:border-slate-700/80 text-xs font-bold font-mono text-slate-700 dark:text-slate-300 select-none">
          Rp
        </div>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          disabled={disabled}
          placeholder={placeholder}
          value={displayValue}
          onChange={handleInputChange}
          className="w-full px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 bg-transparent focus:outline-none"
        />

        {isFree && (
          <span className="mr-3 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
            Gratis
          </span>
        )}
      </div>

      {/* Terbilang helper text */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pl-1">
        {isFree ? (
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Tiket Tanpa Biaya (Gratis)
          </span>
        ) : (
          <span className="text-orange-600 dark:text-orange-400 font-medium">
            Terbilang: <strong>{terbilangRupiah(numericValue)}</strong>
          </span>
        )}
      </div>

      {/* Quick Preset Buttons */}
      {showPresets && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Pilih Cepat:
          </span>
          {PRESETS.map((p) => {
            const isSelected = numericValue === p.value
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => handlePresetClick(p.value)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors duration-150 select-none focus:outline-none cursor-pointer ${
                  isSelected
                    ? 'bg-orange-500/15 border-orange-500/40 text-[#FF5C00]'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {p.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
