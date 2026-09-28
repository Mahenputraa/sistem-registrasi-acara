import React from 'react'
import { Badge } from '../../../components/ui/badge'
import { formatDate } from '../../../lib/utils'
import { OptimizedImage } from '../../../components/common/OptimizedImage'
import { Calendar, MapPin, Video, ShieldCheck, Users } from 'lucide-react'

export function EventHeroBanner({ event }) {
  const totalCapacity =
    event.ticket_types?.reduce((acc, t) => acc + t.capacity, 0) || 0
  const totalRemaining =
    event.ticket_types?.reduce((acc, t) => acc + (t.remaining_capacity || 0), 0) || 0
  const isSoldOut = totalRemaining <= 0

  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-[#1e2536] bg-white dark:bg-[#11141e] mb-10 shadow-xl dark:shadow-2xl transition-colors duration-300">
      <div className="relative h-64 sm:h-96 w-full overflow-hidden bg-slate-900">
        <OptimizedImage
          src={event.poster_url}
          alt={event.name}
          targetWidth={1080}
          quality={80}
          priority={true}
          aspectRatio="h-64 sm:h-96 w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

        {/* Badges on poster */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap gap-2">
          <Badge
            variant={event.venue?.type === 'online' ? 'cobalt' : 'tangerine'}
            className="backdrop-blur-md bg-white/90 dark:bg-slate-950/80 px-3 py-1 text-xs text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-sm"
          >
            {event.venue?.type === 'online' ? (
              <span className="flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" /> Acara Online / Webinar
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#FF5C00]" /> Acara Tatap Muka
              </span>
            )}
          </Badge>

          <Badge
            variant={isSoldOut ? 'destructive' : 'secondary'}
            className="backdrop-blur-md bg-white/90 dark:bg-slate-950/80 px-3 py-1 text-xs text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-sm"
          >
            {isSoldOut ? 'Kapasitas Habis' : `${totalRemaining} Tiket Tersedia`}
          </Badge>
        </div>
      </div>

      {/* Hero Content Info */}
      <div className="p-6 sm:p-10 -mt-16 sm:-mt-24 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-xs font-mono text-orange-600 dark:text-orange-400 font-bold mb-3 tracking-wider shadow-sm">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(event.start_time)} WIB</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight leading-tight max-w-4xl">
          {event.name}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-[#1e2536] pt-6">
          {/* Venue metadata */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-[#161B28] border border-slate-200 dark:border-[#293247] flex items-center justify-center text-[#FF5C00] shadow-sm">
              {event.venue?.type === 'online' ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
            </div>
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-semibold">
                Lokasi Acara
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">{event.venue?.name}</span>
            </div>
          </div>

          {/* Organizer metadata */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-[#161B28] border border-slate-200 dark:border-[#293247] flex items-center justify-center text-blue-500 dark:text-blue-400 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-semibold">
                Penyelenggara
              </span>
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                {event.organizer?.name || 'Panitia Acara'}
                <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-mono font-bold">
                  VERIFIED
                </span>
              </span>
            </div>
          </div>

          {/* Total Capacity */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-[#161B28] border border-slate-200 dark:border-[#293247] flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-semibold">
                Kapasitas Maksimal
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">{totalCapacity} Peserta</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
