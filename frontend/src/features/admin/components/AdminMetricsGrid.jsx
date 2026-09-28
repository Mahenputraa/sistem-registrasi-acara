import React from 'react'
import { Card } from '../../../components/ui/card'

export function AdminMetricsGrid({ eventCount, venueCount, totalTicketCapacity }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
      <Card className="p-6">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
          Total Acara
        </p>
        <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">{eventCount}</p>
      </Card>
      <Card className="p-6">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
          Total Venue
        </p>
        <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2 font-mono">{venueCount}</p>
      </Card>
      <Card className="p-6">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
          Total Kuota Tiket
        </p>
        <p className="text-3xl font-extrabold text-[#FF5C00] mt-2 font-mono">
          {totalTicketCapacity}
        </p>
      </Card>
    </div>
  )
}
