import React, { useState } from 'react'
import { Modal } from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { RundownFormBuilder } from './RundownFormBuilder'
import { TicketTypeFormBuilder } from './TicketTypeFormBuilder'
import { TimePickerDropdown } from './TimePickerDropdown'
import { toast } from 'sonner'
import { Save, Calendar, Clock } from 'lucide-react'
import {
  parseTimeRange,
  addMinutesToTime,
  addHoursToDatetime,
  splitDatetime,
  combineDatetime,
} from '../utils/timeHelpers'

function toDatetimeLocal(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  const YYYY = d.getFullYear()
  const MM = pad(d.getMonth() + 1)
  const DD = pad(d.getDate())
  const HH = pad(d.getHours())
  const mm = pad(d.getMinutes())
  return `${YYYY}-${MM}-${DD}T${HH}:${mm}`
}

function buildInitialFormData(event, venues) {
  if (!event) {
    return {
      name: '',
      description: '',
      start_time: '',
      end_time: '',
      venue_id: '',
      poster_url: '',
      ticket_types: [],
      rundown: [],
    }
  }

  const tiers = event.ticket_types && event.ticket_types.length > 0
    ? event.ticket_types.map((t) => ({
        id: t.id,
        name: t.name || '',
        price: Number(t.price) || 0,
        capacity: Number(t.capacity) || 50,
        sold_count: t.sold_count || 0,
        remaining_capacity: t.remaining_capacity ?? t.capacity,
      }))
    : [{ name: 'General Admission', price: 100000, capacity: 50, sold_count: 0 }]

  const initialRundown = Array.isArray(event.rundown) && event.rundown.length > 0
    ? event.rundown
    : [
        { time: '08:30 - 09:00', title: 'Sesi Pembukaan & Registrasi', desc: 'Check-in peserta dan sambutan' },
        { time: '09:00 - 11:30', title: 'Sesi Materi Utama', desc: 'Pemaparan materi utama pembicara' },
        { time: '11:30 - 13:00', title: 'Networking Lunch', desc: 'Istirahat dan makan siang' },
        { time: '13:00 - 15:30', title: 'Workshop Interaktif', desc: 'Praktik langsung & studi kasus' },
        { time: '15:30 - 16:30', title: 'Q&A & Penutupan', desc: 'Tanya jawab dan pembagian sertifikat' },
      ]

  return {
    name: event.name || '',
    description: event.description || '',
    start_time: toDatetimeLocal(event.start_time),
    end_time: toDatetimeLocal(event.end_time),
    venue_id: event.venue_id || (venues?.[0]?.id ?? ''),
    poster_url: event.poster_url || '',
    ticket_types: tiers,
    rundown: initialRundown,
  }
}

export function EditEventModal({
  isOpen,
  onClose,
  event,
  venues,
  onUpdateEvent,
  onOpenVenueModal,
}) {
  const [formData, setFormData] = useState(() => buildInitialFormData(event, venues))
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Deconstruct start and end datetimes into separate date & time
  const { date: startDate, time: startTime } = splitDatetime(formData.start_time)
  const { date: endDate, time: endTime } = splitDatetime(formData.end_time)

  const handleStartDateChange = (newDate) => {
    const combinedStart = combineDatetime(newDate, startTime || '09:00')
    let combinedEnd = formData.end_time

    if (!combinedEnd || !endDate) {
      combinedEnd = addHoursToDatetime(combinedStart, 3)
    }

    setFormData((prev) => ({
      ...prev,
      start_time: combinedStart,
      end_time: combinedEnd,
    }))
  }

  const handleStartTimeChange = (newTime) => {
    const targetDate = startDate || new Date().toISOString().split('T')[0]
    const combinedStart = combineDatetime(targetDate, newTime)
    let combinedEnd = formData.end_time

    if (!combinedEnd || new Date(combinedEnd) <= new Date(combinedStart)) {
      combinedEnd = addHoursToDatetime(combinedStart, 3)
    }

    setFormData((prev) => ({
      ...prev,
      start_time: combinedStart,
      end_time: combinedEnd,
    }))
  }

  const handleEndDateChange = (newDate) => {
    const combinedEnd = combineDatetime(newDate, endTime || '12:00')
    setFormData((prev) => ({ ...prev, end_time: combinedEnd }))
  }

  const handleEndTimeChange = (newTime) => {
    const targetDate = endDate || startDate || new Date().toISOString().split('T')[0]
    const combinedEnd = combineDatetime(targetDate, newTime)
    setFormData((prev) => ({ ...prev, end_time: combinedEnd }))
  }

  const handleApplyEventDuration = (hours) => {
    if (!formData.start_time) return
    setFormData((prev) => ({
      ...prev,
      end_time: addHoursToDatetime(prev.start_time, hours),
    }))
  }

  // Ticket types handlers
  const handleAddTicketType = () => {
    setFormData((prev) => ({
      ...prev,
      ticket_types: [
        ...prev.ticket_types,
        { name: 'VIP Pass', price: 250000, capacity: 20, sold_count: 0 },
      ],
    }))
  }

  const handleRemoveTicketType = (index) => {
    const tier = formData.ticket_types[index]
    if (tier?.sold_count > 0) {
      toast.error(`Tidak dapat menghapus '${tier.name}' karena ${tier.sold_count} tiket sudah terjual.`)
      return
    }
    if (formData.ticket_types.length <= 1) {
      toast.error('Minimal harus ada 1 kategori tiket.')
      return
    }
    setFormData((prev) => ({
      ...prev,
      ticket_types: prev.ticket_types.filter((_, i) => i !== index),
    }))
  }

  const handleTicketTypeChange = (index, field, value) => {
    const updated = [...formData.ticket_types]
    updated[index][field] = value
    setFormData((prev) => ({ ...prev, ticket_types: updated }))
  }

  // Rundown handlers with smart time sequencing
  const handleAddRundown = () => {
    const list = formData.rundown || []
    let defaultTime = '09:00 - 10:00'
    if (list.length > 0) {
      const last = list[list.length - 1]
      const { end } = parseTimeRange(last.time)
      if (end) {
        const nextEnd = addMinutesToTime(end, 60)
        defaultTime = `${end} - ${nextEnd}`
      }
    }

    setFormData((prev) => ({
      ...prev,
      rundown: [
        ...list,
        { time: defaultTime, title: '', desc: '' },
      ],
    }))
  }

  const handleRemoveRundown = (index) => {
    setFormData((prev) => ({
      ...prev,
      rundown: (prev.rundown || []).filter((_, i) => i !== index),
    }))
  }

  const handleRundownChange = (index, field, value) => {
    const updated = [...(formData.rundown || [])]
    updated[index][field] = value
    setFormData((prev) => ({ ...prev, rundown: updated }))
  }

  const handleResetDefaultRundown = () => {
    setFormData((prev) => ({
      ...prev,
      rundown: [
        { time: '08:30 - 09:00', title: 'Registrasi Peserta & Check-In', desc: 'Scan e-tiket QR Code' },
        { time: '09:00 - 11:30', title: 'Sesi Pembukaan & Keynote Speech', desc: 'Pemaparan materi utama' },
        { time: '11:30 - 13:00', title: 'Networking Lunch', desc: 'Istirahat dan makan siang' },
        { time: '13:00 - 15:30', title: 'Workshop Interaktif', desc: 'Praktik langsung & studi kasus' },
        { time: '15:30 - 16:30', title: 'Q&A & Penutupan', desc: 'Tanya jawab dan pembagian sertifikat' },
      ],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate date sequence
    if (new Date(formData.end_time) < new Date(formData.start_time)) {
      toast.error('Waktu selesai tidak boleh lebih awal dari waktu mulai.')
      return
    }

    // Validate tier capacities against sold count
    for (const tier of formData.ticket_types) {
      if (tier.sold_count && Number(tier.capacity) < Number(tier.sold_count)) {
        toast.error(`Kapasitas kategori '${tier.name}' tidak boleh kurang dari jumlah tiket terjual (${tier.sold_count}).`)
        return
      }
    }

    setIsSubmitting(true)
    try {
      await onUpdateEvent(event.id, formData)
      toast.success('Acara & rundown berhasil diperbarui!')
      onClose()
    } catch {
      // Error handled by parent handler
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Informasi Acara"
      description={`Perbarui detail, susunan agenda (rundown), dan tiket untuk "${event?.name || 'Acara'}"`}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Nama Acara *
          </label>
          <Input
            required
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="cth: Workshop AI Developer"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Deskripsi Acara *
          </label>
          <textarea
            required
            rows={3}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-900/80 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Jelaskan mengenai acara ini..."
          />
        </div>

        {/* Waktu Mulai & Selesai Acara (Tanggal + Dropdown Jam/Menit) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          {/* Waktu Mulai */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-orange-500" />
              <span>Waktu Mulai Acara *</span>
            </label>
            <Input
              type="date"
              required
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="text-xs"
            />
            <TimePickerDropdown
              label="Jam Mulai (00-23 & 00-59):"
              value={startTime}
              onChange={handleStartTimeChange}
            />
          </div>

          {/* Waktu Selesai */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-emerald-500" />
              <span>Waktu Selesai Acara *</span>
            </label>
            <Input
              type="date"
              required
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="text-xs"
            />
            <TimePickerDropdown
              label="Jam Selesai (00-23 & 00-59):"
              value={endTime}
              onChange={handleEndTimeChange}
            />

            {/* Quick Event Duration Helper */}
            {formData.start_time && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Durasi:</span>
                {[
                  { label: '+2 Jam', h: 2 },
                  { label: '+3 Jam', h: 3 },
                  { label: '+5 Jam', h: 5 },
                  { label: '+1 Hari', h: 24 },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    type="button"
                    onClick={() => handleApplyEventDuration(btn.h)}
                    className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-orange-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Venue Select */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Lokasi / Venue *
            </label>
            {onOpenVenueModal && (
              <button
                type="button"
                onClick={onOpenVenueModal}
                className="text-xs font-semibold text-[#FF5C00] hover:underline cursor-pointer"
              >
                + Buat Lokasi Baru
              </button>
            )}
          </div>
          <select
            required
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-900/80 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            value={formData.venue_id}
            onChange={(e) => setFormData((prev) => ({ ...prev, venue_id: e.target.value }))}
          >
            {venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name} ({venue.type === 'online' ? 'Online - ' + venue.platform : 'Offline - ' + venue.city})
              </option>
            ))}
          </select>
        </div>

        {/* Poster URL */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            URL Poster Acara
          </label>
          <Input
            value={formData.poster_url}
            onChange={(e) => setFormData((prev) => ({ ...prev, poster_url: e.target.value }))}
            placeholder="https://..."
          />
        </div>

        {/* Rundown Section with Modular Form Builder */}
        <RundownFormBuilder
          rundown={formData.rundown}
          onAddRundown={handleAddRundown}
          onRemoveRundown={handleRemoveRundown}
          onRundownChange={handleRundownChange}
          onResetDefault={handleResetDefaultRundown}
        />

        {/* Ticket Types Section with Modular Form Builder */}
        <TicketTypeFormBuilder
          ticketTypes={formData.ticket_types}
          onAddTicketType={handleAddTicketType}
          onRemoveTicketType={handleRemoveTicketType}
          onTicketTypeChange={handleTicketTypeChange}
        />

        {/* Modal Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-[#11141e] py-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button type="submit" variant="default" className="px-6 gap-2" disabled={isSubmitting}>
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
