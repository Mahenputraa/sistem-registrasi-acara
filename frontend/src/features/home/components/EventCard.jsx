import React from 'react'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { formatCurrency } from '../../../lib/utils'
import { OptimizedImage } from '../../../components/common/OptimizedImage'
import { MapPin, Video, Ticket as TicketIcon } from 'lucide-react'

export function EventCard({ event, onCardClick, onQuickBook, priority = false }) {
  const lowestPrice =
    event.ticket_types && event.ticket_types.length > 0
      ? Math.min(...event.ticket_types.map((t) => Number(t.price)))
      : 0

  const totalRemaining =
    event.ticket_types?.reduce((acc, t) => acc + (t.remaining_capacity || 0), 0) || 0
  const isSoldOut = totalRemaining <= 0

  const eventDate = new Date(event.start_time)
  const dayNumber = eventDate.getDate()
  const monthShort = eventDate.toLocaleString('id-ID', { month: 'short' }).toUpperCase()

  return (
    <div
      onClick={() => onCardClick(event.id)}
      className="ink-card-interactive rounded-3xl overflow-hidden flex flex-col group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Poster Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-900">
        <OptimizedImage
          src={event.poster_url}
          alt={event.name}
          targetWidth={480}
          quality={70}
          priority={priority}
          aspectRatio="h-52 w-full"
          className="group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

        {/* Date Stamp Badge (Ticket Artifact Look) */}
        <div className="absolute top-3.5 left-3.5 flex flex-col items-center justify-center h-13 w-13 rounded-xl bg-white/90 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-700/80 backdrop-blur-md text-slate-900 dark:text-white font-mono shadow-md">
          <span className="text-base font-extrabold leading-none text-[#FF5C00]">{dayNumber}</span>
          <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
            {monthShort}
          </span>
        </div>

        {/* Venue Type Badge */}
        <div className="absolute top-3.5 right-3.5">
          <Badge
            variant={event.venue?.type === 'online' ? 'cobalt' : 'secondary'}
            className="backdrop-blur-md bg-white/90 dark:bg-slate-950/80 text-[11px] px-2.5 py-0.5 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-sm"
          >
            {event.venue?.type === 'online' ? (
              <span className="flex items-center gap-1">
                <Video className="h-3 w-3 text-blue-500 dark:text-blue-400" /> Online
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> Tatap Muka
              </span>
            )}
          </Badge>
        </div>

        {/* Lowest Price Tag */}
        <div className="absolute bottom-3 left-3.5">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/95 dark:bg-[#161B28]/95 border border-slate-200 dark:border-[#293247] text-slate-900 dark:text-white shadow-sm">
            Mulai {formatCurrency(lowestPrice)}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Venue location snippet */}
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2 line-clamp-1">
            {event.venue?.type === 'online' ? (
              <>
                <Video className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
                <span>{event.venue?.platform || 'Platform Online'}</span>
              </>
            ) : (
              <>
                <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>{event.venue?.name}</span>
              </>
            )}
          </p>

          {/* Event Title */}
          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
            {event.name}
          </h3>

          {/* Description excerpt */}
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Bottom Action Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#1e2536] flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-slate-600 dark:text-slate-400 block font-medium">
              {isSoldOut ? 'Tiket Habis' : `${totalRemaining} tiket tersisa`}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">Klik untuk lihat detail</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              disabled={isSoldOut}
              onClick={(e) => {
                e.stopPropagation()
                onQuickBook(event)
              }}
              className="text-xs px-3.5 py-2 font-bold uppercase tracking-wider"
              title="Pesan tiket sekarang tanpa masuk ke detail"
            >
              {isSoldOut ? (
                'Habis'
              ) : (
                <span className="flex items-center gap-1.5">
                  <TicketIcon className="h-3.5 w-3.5" />
                  Pesan Tiket
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
