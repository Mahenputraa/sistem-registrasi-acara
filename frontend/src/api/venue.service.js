import api from '../lib/api'

export const venueService = {
  async getVenues() {
    const res = await api.get('/venues')
    return res.data.data
  },

  async createVenue(venueData) {
    const res = await api.post('/venues', venueData)
    return res.data.data
  },
}
