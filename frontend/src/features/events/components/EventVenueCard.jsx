import React from 'react'
import { Button } from '../../../components/ui/button'
import { MapPin, ExternalLink } from 'lucide-react'

export function EventVenueCard({ venue }) {
  return (
    <section className="p-8 rounded-3xl border border-slate-200 dark:border-[#1e2536] bg-white dark:bg-[#11141e] shadow-sm dark:shadow-none transition-colors duration-300">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display mb-4 flex items-center gap-2.5">
        <MapPin className="h-5 w-5 text-[#FF5C00]" />
        Informasi Lokasi & Venue
      </h2>

      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#161B28]/70 border border-slate-200 dark:border-[#22293b]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{venue?.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
              {venue?.type === 'online'
                ? `Platform: ${venue?.platform || 'Webinar Online'}`
                : venue?.address || 'Alamat lengkap akan dikirimkan pada e-tiket.'}
            </p>
          </div>

          {venue?.type === 'online' ? (
            venue?.url && (
              <a
                href={venue.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button variant="outline" size="sm" className="text-xs">
                  Buka Tautan Webinar <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </a>
            )
          ) : (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                (venue?.name || '') + ' ' + (venue?.address || '')
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button variant="outline" size="sm" className="text-xs">
                Buka di Google Maps <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
