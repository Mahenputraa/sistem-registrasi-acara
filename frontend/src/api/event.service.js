import api from '../lib/api'

export const eventService = {
  async getEvents(params = {}) {
    const res = await api.get('/events', { params })
    return res.data.data
  },

  async getEventById(id) {
    const res = await api.get(`/events/${id}`)
    return res.data.data
  },

  async createEvent(formData) {
    const res = await api.post('/events', formData)
    return res.data.data
  },

  async updateEvent(id, formData) {
    const res = await api.put(`/events/${id}`, formData)
    return res.data.data
  },

  async deleteEvent(id) {
    const res = await api.delete(`/events/${id}`)
    return res.data
  },

  async getEventAttendees(id) {
    const res = await api.get(`/events/${id}/attendees`)
    return res.data.data
  },
}
