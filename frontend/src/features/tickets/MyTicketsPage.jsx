import React, { useState, useMemo } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { useAuth } from '../../context/AuthContext'
import { useMyTickets } from '../../hooks'
import { BoardingPassTicket } from './components/BoardingPassTicket'
import { TicketEmptyState } from './components/TicketEmptyState'
import { TicketDetailModal } from './components/TicketDetailModal'
import { Ticket as TicketIcon, Printer, Search, CheckCircle2, Clock, X } from 'lucide-react'

function BoardingPassSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-[#1e2536] bg-white dark:bg-[#11141e] shadow-sm flex flex-col md:flex-row">
      <div className="w-full md:w-3.5 h-2 md:h-auto bg-slate-200 dark:bg-slate-700 animate-pulse" />
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-5 w-24 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-4 w-16 rounded bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
          </div>
          <div className="h-6 sm:h-7 w-3/4 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse mb-3" />
          <div className="flex flex-wrap gap-4">
            <div className="h-4 w-36 rounded bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
            <div className="h-4 w-40 rounded bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
          </div>
        </div>
        <div className="pt-3 border-t border-slate-100 dark:border-[#1e2536] flex items-center justify-between">
          <div className="h-4 w-48 rounded bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
          <div className="h-4 w-28 rounded bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
        </div>
      </div>
      <div className="border-t md:border-t-0 md:border-l border-slate-100 dark:border-[#1e2536] p-6 md:w-56 shrink-0 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-[#0c0e16]/50 space-y-3">
        <div className="h-24 w-24 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
      </div>
    </div>
  )
}

export function MyTicketsPage() {
  const { user } = useAuth()
  const { tickets, loading, printTickets } = useMyTickets()

  const [activeFilter, setActiveFilter] = useState('all') // 'all' | 'active' | 'checked-in'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTicket, setSelectedTicket] = useState(null)

  // Counters
  const counts = useMemo(() => {
    const total = tickets.length
    const active = tickets.filter((t) => t.status === 'active').length
    const checkedIn = tickets.filter((t) => t.status === 'checked-in').length
    return { total, active, checkedIn }
  }, [tickets])

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // Status filter
      if (activeFilter === 'active' && t.status !== 'active') return false
      if (activeFilter === 'checked-in' && t.status !== 'checked-in') return false

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const eventName = t.registration?.event?.name?.toLowerCase() || ''
        const ticketCode = t.ticket_code?.toLowerCase() || ''
        const attendeeName = t.attendee_name?.toLowerCase() || ''
        return eventName.includes(q) || ticketCode.includes(q) || attendeeName.includes(q)
      }

      return true
    })
  }, [tickets, activeFilter, searchQuery])

  return (
    <div className="w-full min-h-screen py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 mb-8 border-b border-slate-200 dark:border-[#1e2536] gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display flex items-center gap-3">
            <TicketIcon className="h-8 w-8 text-[#FF5C00]" />
            Tiket Acara Saya
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Simpan e-tiket ini atau klik pada tiket untuk melihat detail lengkap & QR Code scanner check-in.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={printTickets}
          disabled={tickets.length === 0}
          className="gap-2 text-xs"
        >
          <Printer className="h-4 w-4" /> Cetak Semua Tiket
        </Button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
        {/* Segmented Filter Buttons */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-[#121623] border border-slate-200/80 dark:border-[#1e2536] self-start md:self-auto shadow-sm">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors duration-150 select-none focus:outline-none cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-[#1f2638] text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-[#2a3449]'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-[#1a2030]/50'
            }`}
          >
            <span>Semua Tiket</span>
            <span
              className={`px-2 py-0.5 min-w-[20px] text-center rounded-full text-[10px] font-mono font-bold transition-colors ${
                activeFilter === 'all'
                  ? 'bg-orange-500/15 text-[#FF5C00]'
                  : 'bg-slate-200 dark:bg-[#1a2030] text-slate-600 dark:text-slate-400'
              }`}
            >
              {counts.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('active')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors duration-150 select-none focus:outline-none cursor-pointer ${
              activeFilter === 'active'
                ? 'bg-white dark:bg-[#1f2638] text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-[#2a3449]'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-[#1a2030]/50'
            }`}
          >
            <Clock className="h-3.5 w-3.5 text-[#FF5C00]" />
            <span>Tiket Aktif</span>
            <span
              className={`px-2 py-0.5 min-w-[20px] text-center rounded-full text-[10px] font-mono font-bold transition-colors ${
                activeFilter === 'active'
                  ? 'bg-[#FF5C00] text-white'
                  : 'bg-orange-500/10 text-[#FF5C00]'
              }`}
            >
              {counts.active}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('checked-in')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors duration-150 select-none focus:outline-none cursor-pointer ${
              activeFilter === 'checked-in'
                ? 'bg-white dark:bg-[#1f2638] text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-[#2a3449]'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-[#1a2030]/50'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Sudah Check-In</span>
            <span
              className={`px-2 py-0.5 min-w-[20px] text-center rounded-full text-[10px] font-mono font-bold transition-colors ${
                activeFilter === 'checked-in'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {counts.checkedIn}
            </span>
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            placeholder={tickets.length === 0 ? 'Tidak ada tiket untuk dicari...' : 'Cari acara atau kode tiket...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={tickets.length === 0}
            className="pl-10 pr-9 py-2 rounded-xl text-xs bg-white dark:bg-[#121623] border-slate-200 dark:border-[#1e2536] disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2].map((n) => (
            <BoardingPassSkeleton key={n} />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <TicketEmptyState />
      ) : filteredTickets.length === 0 ? (
        <div className="w-full text-center py-16 px-4 rounded-3xl border border-slate-200 dark:border-[#1e2536] bg-white dark:bg-[#11141e] shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-[#161B28] flex items-center justify-center mx-auto mb-3 text-slate-400">
            <TicketIcon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
            Tidak Ada Tiket yang Sesuai
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `Tidak ditemukan tiket untuk kata kunci "${searchQuery}". Coba kata kunci lain.`
              : activeFilter === 'active'
              ? 'Semua tiket Anda sudah pernah digunakan untuk check-in.'
              : 'Belum ada tiket yang diverifikasi atau di-check-in.'}
          </p>
          {(searchQuery || activeFilter !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setActiveFilter('all')
              }}
              className="mt-4 text-xs"
            >
              Reset Filter
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTickets.map((t, idx) => (
            <BoardingPassTicket
              key={t.id}
              ticket={t}
              index={idx}
              userEmail={user?.email}
              onSelectTicket={(ticket) => setSelectedTicket(ticket)}
            />
          ))}
        </div>
      )}

      {/* Ticket Detail Modal */}
      <TicketDetailModal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        ticket={selectedTicket}
        userEmail={user?.email}
      />
    </div>
  )
}

