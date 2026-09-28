import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../../../components/ui/badge'
import { formatCurrency, formatDate } from '../../../lib/utils'
import { OptimizedImage } from '../../../components/common/OptimizedImage'
import {
  Trash2,
  Pencil,
  ExternalLink,
  Calendar,
  MapPin,
  Video,
  Ticket,
  LayoutGrid,
  List,
  Users,
} from 'lucide-react'

export function AdminEventTable({ events, onDeleteEvent, onEditEvent, onMonitorAttendees }) {
  const [viewMode, setViewMode] = useState('cards') // 'cards' | 'table'

  return (
    <div className="space-y-6">
      {/* Table / Cards View Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11141e] shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
            <span>Daftar Acara Dikelola</span>
            <Badge variant="default" className="text-xs">
              {events.length} Event
            </Badge>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Klik kartu atau tombol edit untuk memperbarui informasi acara
          </p>
        </div>

        {/* View Switcher Segmented Control */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-[#161B28] border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors duration-150 select-none focus:outline-none cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white dark:bg-[#202738] text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Tampilan Kartu</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors duration-150 select-none focus:outline-none cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white dark:bg-[#202738] text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span>Tampilan Tabel</span>
          </button>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11141e]">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Belum ada acara yang dibuat. Klik tombol "Buat Acara Baru" di atas.
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        /* Grid Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const totalCap = event.ticket_types?.reduce((acc, t) => acc + t.capacity, 0) || 0
            const totalRemaining = event.ticket_types?.reduce((acc, t) => acc + (t.remaining_capacity ?? t.capacity), 0) || 0

            return (
              <div
                key={event.id}
                onClick={() => onEditEvent && onEditEvent(event)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11141e] shadow-sm hover:shadow-xl hover:border-[#FF5C00]/50 transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                {/* Poster Cover */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <OptimizedImage
                    src={event.poster_url}
                    alt={event.name}
                    targetWidth={560}
                    quality={75}
                    aspectRatio="h-48 w-full"
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11141e] via-transparent to-transparent opacity-80 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <Badge variant={event.venue?.type === 'online' ? 'cobalt' : 'secondary'} className="shadow-md">
                      {event.venue?.type === 'online' ? (
                        <span className="flex items-center gap-1">
                          <Video className="h-3 w-3" /> Online
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {event.venue?.name}
                        </span>
                      )}
                    </Badge>

                    <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-white font-bold">
                      <Ticket className="h-3 w-3 text-orange-400" />
                      <span>{totalRemaining}/{totalCap}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display group-hover:text-[#FF5C00] transition-colors line-clamp-1">
                      {event.name}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      <p className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-[#FF5C00]" />
                        <span>{formatDate(event.start_time)} WIB</span>
                      </p>
                    </div>

                    {/* Ticket Tiers Pills */}
                    {event.ticket_types && event.ticket_types.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1.5">
                        {event.ticket_types.map((t) => (
                          <span
                            key={t.id}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300"
                          >
                            {t.name}: <strong className="text-orange-600 dark:text-orange-400">{formatCurrency(t.price)}</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onMonitorAttendees && onMonitorAttendees(event)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold transition-colors cursor-pointer"
                        title="Monitoring Presensi Peserta"
                      >
                        <Users className="h-3.5 w-3.5" />
                        <span>Peserta ({totalCap - totalRemaining})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditEvent && onEditEvent(event)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-[#FF5C00] text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <Link
                        to={`/events/${event.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Lihat Tampilan Publik Acara"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => onDeleteEvent(event.id, event.name)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Hapus Acara"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11141e] overflow-hidden shadow-sm dark:shadow-2xl transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-4 px-6">Nama Acara</th>
                  <th className="py-4 px-6">Waktu & Tanggal</th>
                  <th className="py-4 px-6">Venue</th>
                  <th className="py-4 px-6">Tiket & Kapasitas</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {events.map((event) => (
                  <tr
                    key={event.id}
                    onClick={() => onEditEvent && onEditEvent(event)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <OptimizedImage
                          src={event.poster_url}
                          alt=""
                          targetWidth={100}
                          quality={70}
                          aspectRatio="h-10 w-10 shrink-0"
                          containerClassName="rounded-xl"
                          className="rounded-xl group-hover:scale-105 transition-transform"
                        />
                        <div>
                          <span className="group-hover:text-[#FF5C00] transition-colors">{event.name}</span>
                          <span className="block text-[11px] text-slate-400 dark:text-slate-500 font-normal">
                            Oleh: {event.organizer?.name || 'Panitia'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-300">
                      {formatDate(event.start_time)}
                    </td>
                    <td className="py-4 px-6 text-xs">
                      <Badge variant={event.venue?.type === 'online' ? 'cobalt' : 'secondary'}>
                        {event.venue?.name}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-xs">
                      <div className="space-y-1">
                        {event.ticket_types?.map((t) => (
                          <div key={t.id} className="flex items-center gap-2">
                            <span className="text-slate-500 dark:text-slate-400">{t.name}:</span>
                            <span className="font-bold text-orange-600 dark:text-orange-400">{formatCurrency(t.price)}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                              ({t.remaining_capacity ?? t.capacity}/{t.capacity})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className="py-4 px-6 text-right space-x-1"
                    >
                      <button
                        type="button"
                        onClick={() => onMonitorAttendees && onMonitorAttendees(event)}
                        className="p-2 rounded-xl text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer"
                        title="Monitoring Presensi Peserta"
                      >
                        <Users className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditEvent && onEditEvent(event)}
                        className="p-2 rounded-xl text-slate-400 hover:text-[#FF5C00] hover:bg-orange-500/10 transition-colors cursor-pointer"
                        title="Edit Detail Acara"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <Link
                        to={`/events/${event.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Buka Halaman Acara"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => onDeleteEvent(event.id, event.name)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Hapus Acara"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

