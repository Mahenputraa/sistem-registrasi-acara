import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import { useEventDetail } from '../../hooks'
import { useModalStore } from '../../stores/useModalStore'
import { EventHeroBanner } from './components/EventHeroBanner'
import { EventOverview } from './components/EventOverview'
import { EventRundown } from './components/EventRundown'
import { EventVenueCard } from './components/EventVenueCard'
import { StickyBookingDock } from './components/StickyBookingDock'
import { ArrowLeft, Share2, CalendarPlus, Calendar, FileText, Clock, MapPin } from 'lucide-react'

function EventDetailSkeleton() {
  return (
    <div className="min-h-screen pb-28 pt-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb & Actions Bar Placeholder */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-[#1e2536]">
          <div className="h-5 w-44 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-24 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-8 w-36 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          </div>
        </div>

        {/* Hero Banner Card Placeholder */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-[#1e2536] bg-white dark:bg-[#11141e] mb-10 shadow-xl">
          <div className="relative h-64 sm:h-96 w-full bg-slate-200 dark:bg-slate-800/80 animate-pulse">
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex gap-2">
              <div className="h-6 w-36 rounded-full bg-slate-300/80 dark:bg-slate-700/80" />
              <div className="h-6 w-28 rounded-full bg-slate-300/80 dark:bg-slate-700/80" />
            </div>
          </div>
          <div className="p-6 sm:p-10 -mt-16 sm:-mt-24 relative z-10 space-y-4">
            <div className="h-6 w-44 rounded-lg bg-slate-300/80 dark:bg-slate-700/80 animate-pulse" />
            <div className="space-y-2">
              <div className="h-9 sm:h-12 w-4/5 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="h-6 sm:h-8 w-2/5 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </div>
            <div className="pt-2 flex flex-wrap gap-4 border-t border-slate-100 dark:border-[#1e2536]">
              <div className="h-4 w-32 rounded bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
              <div className="h-4 w-36 rounded bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Two-Column Layout Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-12 w-full max-w-lg rounded-2xl bg-slate-100 dark:bg-[#161B28] animate-pulse" />
            <div className="p-8 rounded-3xl border border-slate-200 dark:border-[#1e2536] bg-white dark:bg-[#11141e] space-y-4">
              <div className="h-6 w-36 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
                <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-[#1e2536] bg-white dark:bg-[#11141e] space-y-5">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-[#1e2536]">
                <div className="h-5 w-28 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="h-16 w-full rounded-2xl bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
                <div className="h-16 w-full rounded-2xl bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
              </div>
              <div className="h-11 w-full rounded-xl bg-orange-500/20 dark:bg-orange-500/30 animate-pulse mt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function EventDetailPage({ onBookTicket }) {
  const { id } = useParams()
  const openBookingModal = useModalStore((s) => s.openBookingModal)

  const {
    event,
    loading,
    error,
    selectedTierId,
    setSelectedTierId,
    quantity,
    setQuantity,
    handleShare,
    calendarUrl,
  } = useEventDetail(id)

  if (loading) {
    return <EventDetailSkeleton />
  }

  if (error || !event) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="h-16 w-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#FF5C00] mb-4">
          <Calendar className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Acara Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md">
          {error || 'Informasi acara yang Anda cari mungkin telah dihapus atau tautan tidak valid.'}
        </p>
        <Link to="/" className="mt-6">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Jelajahi Acara
          </Button>
        </Link>
      </div>
    )
  }

  const handleTriggerBooking = () => {
    if (onBookTicket) {
      onBookTicket(event, selectedTierId, quantity)
    } else {
      openBookingModal(event, selectedTierId, quantity)
    }
  }

  return (
    <div className="min-h-screen pb-28 pt-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-[#1e2536]">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Jelajahi Acara</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare} className="text-xs">
              <Share2 className="h-3.5 w-3.5 mr-1.5" /> Bagikan
            </Button>

            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button variant="outline" size="sm" className="text-xs">
                <CalendarPlus className="h-3.5 w-3.5 mr-1.5 text-orange-500 dark:text-orange-400" /> Tambah ke Kalender
              </Button>
            </a>
          </div>
        </div>

        {/* Hero Banner Card */}
        <EventHeroBanner event={event} />

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6 h-12 w-full max-w-lg grid grid-cols-3 bg-slate-100 dark:bg-[#161B28] p-1.5 rounded-2xl">
                <TabsTrigger value="all" className="rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  <span>Semua Info</span>
                </TabsTrigger>
                <TabsTrigger value="rundown" className="rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Jadwal Agenda</span>
                </TabsTrigger>
                <TabsTrigger value="venue" className="rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Lokasi Venue</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-8 mt-0">
                <EventOverview description={event.description} />
                <EventRundown rundown={event.rundown} />
                <EventVenueCard venue={event.venue} />
              </TabsContent>

              <TabsContent value="rundown" className="space-y-8 mt-0">
                <EventRundown rundown={event.rundown} />
              </TabsContent>

              <TabsContent value="venue" className="space-y-8 mt-0">
                <EventVenueCard venue={event.venue} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-4 sticky top-28">
            <StickyBookingDock
              event={event}
              selectedTierId={selectedTierId}
              onSelectTier={setSelectedTierId}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onBook={handleTriggerBooking}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
