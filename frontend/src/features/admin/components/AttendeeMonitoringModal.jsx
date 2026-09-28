import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  X,
  Users,
  UserCheck,
  Clock,
  UserX,
  Search,
  Download,
  RefreshCw,
  Copy,
  Check,
  Calendar,
  MapPin,
  Ticket,
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { eventService } from '../../../api'
import { formatDate, formatCurrency } from '../../../lib/utils'
import { toast } from 'sonner'

export function AttendeeMonitoringModal({ isOpen, onClose, event }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'checked-in' | 'pending' | 'expired'
  const [tierFilter, setTierFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedCode, setCopiedCode] = useState(null)

  const eventId = event?.id

  const fetchAttendees = useCallback(async (isSilent = false) => {
    if (!eventId) return
    try {
      if (isSilent) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      const res = await eventService.getEventAttendees(eventId)
      setData(res)
    } catch (err) {
      console.error(err)
      toast.error('Gagal memuat data presensi peserta.', {
        description: err.response?.data?.message || 'Terjadi kesalahan pada server.',
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [eventId])

  useEffect(() => {
    if (isOpen && eventId) {
      fetchAttendees()
    } else {
      setData(null)
      setStatusFilter('all')
      setTierFilter('all')
      setSearchQuery('')
    }
  }, [isOpen, eventId, fetchAttendees])

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(text)
    toast.success('Kode tiket disalin', { description: text })
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // Filter attendees
  const attendeesList = data?.attendees
  const filteredAttendees = useMemo(() => {
    if (!attendeesList) return []

    return attendeesList.filter((att) => {
      // Status filter
      if (statusFilter !== 'all' && att.monitoring_status !== statusFilter) {
        return false
      }

      // Tier filter
      if (tierFilter !== 'all' && String(att.ticket_tier?.id) !== String(tierFilter)) {
        return false
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const nameMatch = att.attendee_name?.toLowerCase().includes(q)
        const emailMatch = att.attendee_email?.toLowerCase().includes(q)
        const codeMatch = att.ticket_code?.toLowerCase().includes(q)
        const regMatch = att.registration_number?.toLowerCase().includes(q)
        return nameMatch || emailMatch || codeMatch || regMatch
      }

      return true
    })
  }, [attendeesList, statusFilter, tierFilter, searchQuery])

  // Export to CSV
  const handleExportCSV = () => {
    if (!filteredAttendees.length) {
      toast.error('Tidak ada data peserta untuk diekspor.')
      return
    }

    const headers = [
      'No',
      'Kode Tiket',
      'No Registrasi',
      'Nama Peserta',
      'Email Peserta',
      'Kategori Tiket',
      'Harga Tiket',
      'Status Monitoring',
      'Waktu Daftar',
      'Waktu Check-In',
    ]

    const rows = filteredAttendees.map((att, idx) => [
      idx + 1,
      att.ticket_code,
      att.registration_number || '-',
      `"${att.attendee_name || '-'}"`,
      att.attendee_email || '-',
      att.ticket_tier?.name || '-',
      att.ticket_tier?.price || 0,
      `"${att.status_label}"`,
      att.booked_at ? new Date(att.booked_at).toLocaleString('id-ID') : '-',
      att.checked_in_at ? new Date(att.checked_in_at).toLocaleString('id-ID') : '-',
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const fileName = `peserta_${event?.name?.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`
    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success('File CSV berhasil diunduh', { description: fileName })
  }

  if (!isOpen) return null

  const summary = data?.summary || {
    total_registered: 0,
    checked_in_count: 0,
    pending_count: 0,
    expired_count: 0,
    check_in_rate: 0,
  }

  const uniqueTiers = event?.ticket_types || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in-0 duration-200"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-[#11141e] border border-slate-200 dark:border-[#1e2536] shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-[#1e2536] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#0c0d14]/50">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FF5C00]/10 text-[#FF5C00] border border-[#FF5C00]/20">
                Monitoring Presensi
              </span>
              {data?.event?.is_past ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Acara Telah Berakhir
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Acara Berlangsung / Mendatang
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
              {event?.name}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#FF5C00]" />
                {event?.start_time ? formatDate(event.start_time) : '-'} WIB
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF5C00]" />
                {event?.venue?.name || 'Lokasi Venue'}
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <Ticket className="w-3.5 h-3.5 text-[#FF5C00]" />
                Kapasitas: {summary.total_registered}/{data?.event?.total_capacity || 0} Tiket
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fetchAttendees(true)}
              disabled={loading || refreshing}
              className="gap-2 text-xs font-semibold cursor-pointer"
              title="Refresh status presensi terkini"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Segarkan</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={loading || filteredAttendees.length === 0}
              className="gap-2 text-xs font-semibold border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </Button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#161B28] transition-colors cursor-pointer"
              aria-label="Tutup Dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Total Registered */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#161B28]/60 border border-slate-200/80 dark:border-[#293247] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Terdaftar</span>
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                {summary.total_registered}
              </div>
              <p className="text-[11px] text-slate-500">
                Peserta memesan tiket
              </p>
            </div>

            {/* 2. Checked-In */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Telah Check-In</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-display">
                {summary.checked_in_count}
              </div>
              <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">
                Presensi valid di venue
              </p>
            </div>

            {/* 3. Pending (Belum Check-In) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Belum Check-In</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-display">
                {summary.pending_count}
              </div>
              <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80">
                Tiket aktif belum presensi
              </p>
            </div>

            {/* 4. Expired / Hangus */}
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">Tiket Hangus</span>
                <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <UserX className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 font-display">
                {summary.expired_count}
              </div>
              <p className="text-[11px] text-rose-600/80 dark:text-rose-400/80">
                Acara lewat / dibatalkan
              </p>
            </div>
          </div>

          {/* Attendance Rate Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161B28]/40 border border-slate-200/70 dark:border-[#293247]/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">Tingkat Kehadiran Peserta</span>
              <span className="text-[#FF5C00] font-mono">{summary.check_in_rate}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-[#202738] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF5C00] to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, summary.check_in_rate)}%` }}
              />
            </div>
          </div>

          {/* Interactive Filters Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
            {/* Status Segmented Controls */}
            <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-[#161B28] border border-slate-200/80 dark:border-[#293247] overflow-x-auto text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === 'all'
                    ? 'bg-white dark:bg-[#202738] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Semua ({summary.total_registered})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('checked-in')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === 'checked-in'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
                }`}
              >
                Hadir ({summary.checked_in_count})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === 'pending'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
                }`}
              >
                Belum Check-In ({summary.pending_count})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('expired')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === 'expired'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
                }`}
              >
                Hangus ({summary.expired_count})
              </button>
            </div>

            {/* Search & Tier Dropdown */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              {/* Tier Filter */}
              {uniqueTiers.length > 0 && (
                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  className="w-full sm:w-auto h-10 px-3 rounded-xl bg-slate-50 dark:bg-[#161B28] border border-slate-200 dark:border-[#293247] text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer focus:border-[#FF5C00]"
                >
                  <option value="all">Semua Tier Tiket</option>
                  {uniqueTiers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Search Input */}
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama, email, kode..."
                  className="pl-9 h-10 text-xs bg-slate-50 dark:bg-[#161B28] border-slate-200 dark:border-[#293247]"
                />
              </div>
            </div>
          </div>

          {/* Attendees Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-[#1e2536] overflow-hidden bg-white dark:bg-[#11141e]">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-orange-500/20 border-t-[#FF5C00] animate-spin" />
                <p className="text-xs text-slate-500">Memuat data peserta acara...</p>
              </div>
            ) : filteredAttendees.length === 0 ? (
              <div className="py-16 text-center space-y-2 text-slate-500 dark:text-slate-400 text-xs">
                <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-1" />
                <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                  Tidak ada peserta ditemukan
                </p>
                <p>
                  {searchQuery || statusFilter !== 'all' || tierFilter !== 'all'
                    ? 'Coba sesuaikan kata kunci pencarian atau filter status presensi Anda.'
                    : 'Belum ada tiket yang terdaftar untuk acara ini.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-[#0c0d14] text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold border-b border-slate-200 dark:border-[#1e2536]">
                    <tr>
                      <th className="py-3.5 px-4">Profil Peserta</th>
                      <th className="py-3.5 px-4">Tier Tiket</th>
                      <th className="py-3.5 px-4">Kode Tiket</th>
                      <th className="py-3.5 px-4">Waktu Daftar</th>
                      <th className="py-3.5 px-4">Status Kehadiran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#1e2536]">
                    {filteredAttendees.map((att) => {
                      const userAvatar = att.registered_user?.avatar_url
                      const initials = att.attendee_name
                        ? att.attendee_name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()
                        : 'U'

                      return (
                        <tr
                          key={att.id}
                          className="hover:bg-slate-50/70 dark:hover:bg-[#161B28]/50 transition-colors"
                        >
                          {/* 1. Attendee Profile */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 dark:bg-[#161B28] border border-slate-200 dark:border-[#293247] flex items-center justify-center font-bold text-xs text-[#FF5C00] shrink-0">
                                {userAvatar ? (
                                  <img
                                    src={userAvatar}
                                    alt={att.attendee_name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  initials
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 dark:text-white truncate">
                                  {att.attendee_name}
                                </p>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono truncate">
                                  {att.attendee_email || '-'}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* 2. Tier Tiket */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                              {att.ticket_tier?.name || 'General'}
                            </span>
                            <span className="text-[11px] text-orange-600 dark:text-orange-400 font-mono font-medium">
                              {att.ticket_tier?.price ? formatCurrency(att.ticket_tier.price) : 'Gratis'}
                            </span>
                          </td>

                          {/* 3. Ticket Code & Reg Number */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 font-mono">
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {att.ticket_code}
                              </span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(att.ticket_code)}
                                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                title="Salin kode tiket"
                              >
                                {copiedCode === att.ticket_code ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {att.registration_number || '-'}
                            </span>
                          </td>

                          {/* 4. Booked At */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            {att.booked_at ? new Date(att.booked_at).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }) : '-'}
                          </td>

                          {/* 5. Attendance Status */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {att.monitoring_status === 'checked-in' ? (
                              <div className="space-y-0.5">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  <UserCheck className="w-3 h-3" />
                                  Hadir
                                </span>
                                {att.checked_in_at && (
                                  <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-mono">
                                    {new Date(att.checked_in_at).toLocaleTimeString('id-ID', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })} WIB
                                  </p>
                                )}
                              </div>
                            ) : att.monitoring_status === 'expired' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                                <UserX className="w-3 h-3" />
                                {att.status_label}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                <Clock className="w-3 h-3" />
                                Belum Check-In
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer info bar */}
        <div className="p-4 px-6 border-t border-slate-200 dark:border-[#1e2536] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-[#0c0d14]/50 gap-2">
          <span>
            Menampilkan <strong>{filteredAttendees.length}</strong> dari <strong>{summary.total_registered}</strong> peserta terdaftar
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  )
}
