import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { useEvents } from '../../hooks'
import { useModalStore } from '../../stores/useModalStore'
import { HeroSection } from './components/HeroSection'
import { SearchFilterToolbar } from './components/SearchFilterToolbar'
import { EventCard } from './components/EventCard'
import { Calendar } from 'lucide-react'

function EventCardSkeleton() {
  return (
    <div className="ink-card-interactive rounded-3xl overflow-hidden flex flex-col shadow-sm border border-slate-200 dark:border-[#1e2536] bg-white dark:bg-[#11141e]">
      {/* Poster Image Container - Exact match to h-52 w-full */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-200 dark:bg-slate-800/80 animate-pulse">
        {/* Date Stamp Badge placeholder */}
        <div className="absolute top-3.5 left-3.5 h-13 w-13 rounded-xl bg-slate-300/80 dark:bg-slate-700/80" />
        {/* Venue Badge placeholder */}
        <div className="absolute top-3.5 right-3.5 h-6 w-24 rounded-full bg-slate-300/80 dark:bg-slate-700/80" />
        {/* Lowest Price Tag placeholder */}
        <div className="absolute bottom-3 left-3.5 h-6 w-28 rounded-lg bg-slate-300/80 dark:bg-slate-700/80" />
      </div>

      {/* Card Content - Exact match to p-6 flex-1 flex flex-col justify-between */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Venue location snippet */}
          <div className="h-4 w-32 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse mb-3" />
          {/* Event Title line clamp 2 */}
          <div className="space-y-1.5 mb-3">
            <div className="h-5 w-4/5 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-5 w-3/5 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
          </div>
          {/* Description excerpt */}
          <div className="space-y-1.5">
            <div className="h-3.5 w-full rounded-md bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
            <div className="h-3.5 w-4/5 rounded-md bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
          </div>
        </div>

        {/* Bottom Action Footer - Exact match to mt-6 pt-4 border-t */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#1e2536] flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="h-3.5 w-20 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-3 w-28 rounded bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
          </div>
          <div className="h-9 w-24 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export function HomePage({ onSelectEvent }) {
  const navigate = useNavigate()
  const openBookingModal = useModalStore((s) => s.openBookingModal)

  const {
    events,
    loading,
    search,
    setSearch,
    selectedType,
    setSelectedType,
  } = useEvents('all')

  const handleCardClick = (eventId) => {
    navigate(`/events/${eventId}`)
  }

  const handleBook = (event) => {
    if (onSelectEvent) {
      onSelectEvent(event)
    } else {
      openBookingModal(event)
    }
  }

  return (
    <div className="min-h-screen pb-24 transition-colors duration-300">
      {/* Editorial Hero Section with Seamless Atmospheric Background extending to top */}
      <section className="-mt-16 sm:-mt-20 relative border-b border-slate-200 dark:border-[#1e2536] pt-36 pb-20 sm:pt-44 sm:pb-24 overflow-hidden">
        {/* Ambient Video & Motion Backdrop seamlessly blended into the background from the very top */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            poster="/videos/hero-matrix-poster.jpg"
            className="w-full h-full object-cover object-left sm:object-center opacity-45 sm:opacity-60 dark:opacity-60 sm:dark:opacity-75 mix-blend-luminosity dark:mix-blend-screen filter saturate-[1.2] transform-gpu scale-x-[-1.05] scale-y-[1.05]"
          >
            <source
              src="/videos/hero-matrix.mp4"
              type="video/mp4"
            />
            {/* Fallback image if video fails to play or browser doesn't support video */}
            <img
              src="/videos/hero-matrix-poster.jpg"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover animate-hero-bg"
            />
          </video>

          {/* Dynamic Floating Ambient Light Orbs */}
          <div className="absolute -top-12 right-12 sm:right-32 w-[420px] h-[420px] bg-gradient-to-br from-[#FF5C00]/30 via-orange-500/10 to-transparent rounded-full blur-3xl animate-orb-1 transform-gpu pointer-events-none" />
          <div className="absolute -bottom-16 right-1/4 w-[380px] h-[380px] bg-gradient-to-tr from-amber-500/25 via-[#FF5C00]/10 to-transparent rounded-full blur-3xl animate-orb-2 transform-gpu pointer-events-none" />

          {/* Smooth Multi-directional Gradient Masks (Ensures 100% Readable Text while preserving video at top) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F8F9FA] via-[#F8F9FA]/90 sm:via-[#F8F9FA]/75 to-transparent dark:from-[#090A0F] dark:via-[#090A0F]/90 sm:dark:via-[#090A0F]/70 dark:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FA] via-transparent to-transparent dark:from-[#090A0F] via-transparent dark:to-transparent" />
        </div>

        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] z-[1]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <HeroSection eventCount={events.length} />
        </div>
      </section>

      {/* Events Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        {/* Header & Integrated Search/Category Toolbar */}
        <div className="space-y-6 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display">
              Jadwal Acara Mendatang
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Klik pada kartu untuk membaca detail lengkap acara & rundown
            </p>
          </div>

          <SearchFilterToolbar
            search={search}
            onSearchChange={setSearch}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <EventCardSkeleton key={n} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-slate-200 dark:border-[#1e2536] bg-white dark:bg-[#11141e] shadow-sm dark:shadow-none">
            <Calendar className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tidak ada acara yang cocok</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Silakan ubah kata kunci pencarian atau reset filter kategori.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 text-xs"
              onClick={() => {
                setSearch('')
                setSelectedType('all')
              }}
            >
              Reset Filter
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {events.map((event, idx) => (
              <EventCard
                key={event.id}
                event={event}
                priority={idx < 3}
                onCardClick={handleCardClick}
                onQuickBook={handleBook}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
