import React, { useState } from 'react'
import { Modal } from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'

export function CreateVenueModal({ isOpen, onClose, onCreateVenue }) {
  const [venueData, setVenueData] = useState({
    name: '',
    type: 'physical',
    address: '',
    platform: '',
    url: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onCreateVenue(venueData)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Venue Baru"
      description="Simpan data lokasi fisik atau tautan platform webinar"
      className="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nama Venue *</label>
          <Input
            required
            placeholder="cth: Grand Ballroom Hotel Indonesia"
            value={venueData.name}
            onChange={(e) => setVenueData((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Tipe Venue *</label>
          <select
            value={venueData.type}
            onChange={(e) => setVenueData((prev) => ({ ...prev, type: e.target.value }))}
            className="w-full h-11 rounded-xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          >
            <option value="physical">Tatap Muka / Fisik</option>
            <option value="online">Online / Webinar</option>
          </select>
        </div>

        {venueData.type === 'physical' ? (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Alamat Lengkap</label>
            <Input
              placeholder="Jl. Thamrin No. 1, Jakarta Pusat"
              value={venueData.address}
              onChange={(e) => setVenueData((prev) => ({ ...prev, address: e.target.value }))}
            />
          </div>
        ) : (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Platform</label>
              <Input
                placeholder="Zoom / Google Meet / YouTube"
                value={venueData.platform}
                onChange={(e) => setVenueData((prev) => ({ ...prev, platform: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Tautan URL</label>
              <Input
                type="url"
                placeholder="https://zoom.us/j/..."
                value={venueData.url}
                onChange={(e) => setVenueData((prev) => ({ ...prev, url: e.target.value }))}
              />
            </div>
          </>
        )}

        <Button type="submit" variant="default" className="w-full mt-2">
          Simpan Venue
        </Button>
      </form>
    </Modal>
  )
}
