import React, { useState, useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { eventService, venueService } from '../../api'
import { AdminMetricsGrid } from './components/AdminMetricsGrid'
import { AdminEventTable } from './components/AdminEventTable'
import { CreateEventModal } from './components/CreateEventModal'
import { EditEventModal } from './components/EditEventModal'
import { CreateVenueModal } from './components/CreateVenueModal'
import { AttendeeMonitoringModal } from './components/AttendeeMonitoringModal'
import { ScannerQuickActionCard } from './components/ScannerQuickActionCard'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { toast } from 'sonner'
import { PlusCircle } from 'lucide-react'

export function AdminEventsPage({ onOpenScanner }) {
  const [events, setEvents] = useState([])
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [monitoringEvent, setMonitoringEvent] = useState(null)
  const [isMonitoringModalOpen, setIsMonitoringModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null) // { id, name }
  const [deleteLoading, setDeleteLoading] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [eventsData, venuesData] = await Promise.all([
        eventService.getEvents(),
        venueService.getVenues(),
      ])
      setEvents(eventsData || [])
      setVenues(venuesData || [])
    } catch (err) {
      console.error(err)
      toast.error('Gagal memuat data admin.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateEvent = async (formData) => {
    try {
      await eventService.createEvent(formData)
      toast.success('Acara baru berhasil dibuat!')
      setIsModalOpen(false)
      loadData()
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal membuat acara.'
      toast.error(msg)
    }
  }

  const handleCreateVenue = async (venueData) => {
    try {
      const newVenue = await venueService.createVenue(venueData)
      toast.success('Venue berhasil ditambahkan!')
      setVenues((prev) => [...prev, newVenue])
      setIsVenueModalOpen(false)
    } catch (err) {
      console.error(err)
      toast.error('Gagal menambahkan venue.')
    }
  }

  const handleOpenEdit = (event) => {
    setEditingEvent(event)
    setIsEditModalOpen(true)
  }

  const handleOpenMonitoring = (event) => {
    setMonitoringEvent(event)
    setIsMonitoringModalOpen(true)
  }

  const handleUpdateEvent = async (id, formData) => {
    try {
      await eventService.updateEvent(id, formData)
      toast.success('Detail acara berhasil diperbarui!')
      setIsEditModalOpen(false)
      setEditingEvent(null)
      loadData()
    } catch (err) {
      console.error(err)
      const msg = err.response?.data?.message || 'Gagal memperbarui acara.'
      toast.error(msg)
    }
  }

  const handleDeleteEvent = (id, name) => {
    setDeleteTarget({ id, name })
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    try {
      setDeleteLoading(true)
      await eventService.deleteEvent(deleteTarget.id)
      toast.success('Acara berhasil dihapus.')
      setEvents((prev) => prev.filter((e) => e.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      console.error(err)
      toast.error('Gagal menghapus acara.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const totalTicketCapacity = events.reduce(
    (acc, e) => acc + (e.ticket_types?.reduce((a, t) => a + t.capacity, 0) || 0),
    0
  )

  return (
    <div className="min-h-screen py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 mb-8 border-b border-slate-200 dark:border-[#1e2536] gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            Admin Event Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola acara, kapasitas tiket, venue, dan lakukan validasi check-in pengunjung.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="text-xs uppercase font-bold tracking-wider"
          >
            <PlusCircle className="h-4 w-4" /> Buat Acara Baru
          </Button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <AdminMetricsGrid
        eventCount={events.length}
        venueCount={venues.length}
        totalTicketCapacity={totalTicketCapacity}
      />

      {/* Scanner Quick Action Card */}
      <ScannerQuickActionCard onOpenScanner={onOpenScanner} />

      {/* Events List Table */}
      {loading ? (
        <div className="h-64 rounded-3xl bg-slate-200 dark:bg-[#11141e] animate-pulse border border-slate-200 dark:border-[#1e2536]" />
      ) : (
        <AdminEventTable
          events={events}
          onDeleteEvent={handleDeleteEvent}
          onEditEvent={handleOpenEdit}
          onMonitorAttendees={handleOpenMonitoring}
        />
      )}

      {/* Modals */}
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        venues={venues}
        onCreateEvent={handleCreateEvent}
        onOpenVenueModal={() => setIsVenueModalOpen(true)}
      />

      <EditEventModal
        key={editingEvent?.id || 'edit-modal'}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingEvent(null)
        }}
        event={editingEvent}
        venues={venues}
        onUpdateEvent={handleUpdateEvent}
        onOpenVenueModal={() => setIsVenueModalOpen(true)}
      />

      <CreateVenueModal
        isOpen={isVenueModalOpen}
        onClose={() => setIsVenueModalOpen(false)}
        onCreateVenue={handleCreateVenue}
      />

      {/* Attendee Monitoring Modal */}
      <AttendeeMonitoringModal
        isOpen={isMonitoringModalOpen}
        onClose={() => {
          setIsMonitoringModalOpen(false)
          setMonitoringEvent(null)
        }}
        event={monitoringEvent}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Acara"
        message={`Apakah Anda yakin ingin menghapus acara "${deleteTarget?.name}"? Seluruh data tiket dan jadwal terkait akan ikut terhapus. Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus Acara"
        loading={deleteLoading}
      />
    </div>
  )
}
