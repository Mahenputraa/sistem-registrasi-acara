import React, { useState } from 'react'
import { Input } from '../../../components/ui/input'
import {
  Clock,
  PlusCircle,
  Sparkles,
  X,
  SlidersHorizontal,
  Timer,
  ArrowRight,
} from 'lucide-react'
import { TimePickerDropdown } from './TimePickerDropdown'
import {
  parseTimeRange,
  formatTimeRange,
  addMinutesToTime,
  compareTimes,
} from '../utils/timeHelpers'

const DURATION_PRESETS = [
  { label: '+30m', minutes: 30 },
  { label: '+45m', minutes: 45 },
  { label: '+1 Jam', minutes: 60 },
  { label: '+1.5 Jam', minutes: 90 },
  { label: '+2 Jam', minutes: 120 },
]

export function RundownFormBuilder({
  rundown = [],
  onAddRundown,
  onRemoveRundown,
  onRundownChange,
  onResetDefault,
}) {
  const [manualModeMap, setManualModeMap] = useState({})

  const toggleManualMode = (idx) => {
    setManualModeMap((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }))
  }

  const handleStartChange = (idx, newStart) => {
    const current = parseTimeRange(rundown[idx]?.time)
    let newEnd = current.end

    // Auto-adjust end time if empty or earlier than new start
    if (!newEnd || compareTimes(newStart, newEnd) >= 0) {
      newEnd = addMinutesToTime(newStart, 60)
    }

    onRundownChange(idx, 'time', formatTimeRange(newStart, newEnd))
  }

  const handleEndChange = (idx, newEnd) => {
    const current = parseTimeRange(rundown[idx]?.time)
    onRundownChange(idx, 'time', formatTimeRange(current.start || '09:00', newEnd))
  }

  const handleApplyDuration = (idx, minutes) => {
    const current = parseTimeRange(rundown[idx]?.time)
    const start = current.start || '09:00'
    const newEnd = addMinutesToTime(start, minutes)
    onRundownChange(idx, 'time', formatTimeRange(start, newEnd))
  }

  return (
    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#FF5C00]" />
            Jadwal & Agenda Acara (Rundown)
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Pilih Jam (00 - 23) dan Menit (00 - 59) secara otomatis lewat dropdown
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onResetDefault && (
            <button
              type="button"
              onClick={onResetDefault}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Gunakan template agenda standar"
            >
              <Sparkles className="h-3 w-3 text-amber-500" />
              Template
            </button>
          )}
          <button
            type="button"
            onClick={onAddRundown}
            className="text-xs font-bold text-[#FF5C00] hover:text-[#FF7322] flex items-center gap-1 cursor-pointer bg-orange-500/10 dark:bg-orange-500/20 px-2.5 py-1.5 rounded-xl transition-colors hover:bg-orange-500/20"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Tambah Sesi</span>
          </button>
        </div>
      </div>

      <div className="space-y-3.5">
        {rundown.map((item, idx) => {
          const parsed = parseTimeRange(item.time)
          const isManual = manualModeMap[idx] || parsed.isCustom

          return (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 relative group transition-all"
            >
              {/* Sesi Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono text-[10px] font-bold">
                    Sesi #{idx + 1}
                  </span>

                  <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                    {item.time || 'Waktu belum diatur'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleManualMode(idx)}
                    className="text-[10px] font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer px-1.5 py-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title={isManual ? 'Ganti ke Dropdown Waktu' : 'Ketik Waktu Bebas'}
                  >
                    <SlidersHorizontal className="h-3 w-3" />
                    <span>{isManual ? 'Mode Dropdown' : 'Ketik Manual'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveRundown(idx)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Hapus Sesi Ini"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Time Configuration Section */}
              {isManual ? (
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Jam / Waktu (Ketik Bebas) *
                  </label>
                  <Input
                    placeholder="cth: 09:00 - 10:00 atau Menyesuaikan"
                    value={item.time}
                    onChange={(e) => onRundownChange(idx, 'time', e.target.value)}
                    required
                    className="text-xs font-mono"
                  />
                </div>
              ) : (
                <div className="space-y-2 bg-white/70 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Waktu Mulai (Jam 0-24 & Menit 0-59) */}
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-orange-500" />
                        <span>Waktu Mulai *</span>
                      </span>
                      <TimePickerDropdown
                        value={parsed.start}
                        onChange={(newStart) => handleStartChange(idx, newStart)}
                      />
                    </div>

                    <ArrowRight className="h-4 w-4 text-slate-400 self-center hidden sm:block shrink-0" />

                    {/* Waktu Selesai (Jam 0-24 & Menit 0-59) */}
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-emerald-500" />
                        <span>Waktu Selesai *</span>
                      </span>
                      <TimePickerDropdown
                        value={parsed.end}
                        onChange={(newEnd) => handleEndChange(idx, newEnd)}
                      />
                    </div>
                  </div>

                  {/* Quick Duration Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mr-1">
                      <Timer className="h-3 w-3 text-slate-400" /> Durasi Otomatis:
                    </span>
                    {DURATION_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleApplyDuration(idx, preset.minutes)}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Judul Kegiatan / Sesi */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Judul Kegiatan / Sesi *
                </label>
                <Input
                  placeholder="cth: Keynote Speech / Interactive Workshop"
                  value={item.title}
                  onChange={(e) => onRundownChange(idx, 'title', e.target.value)}
                  required
                  className="text-xs"
                />
              </div>

              {/* Keterangan Singkat */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Keterangan Singkat (Opsional)
                </label>
                <Input
                  placeholder="cth: Pembicara: Bpk. Andi, S.Kom - Hall Utama"
                  value={item.desc}
                  onChange={(e) => onRundownChange(idx, 'desc', e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
