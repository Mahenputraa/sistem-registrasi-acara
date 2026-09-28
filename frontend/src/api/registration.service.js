import api from '../lib/api'

export const registrationService = {
  async bookTickets(payload) {
    const res = await api.post('/registrations', payload)
    return res.data
  },

  async getMyTickets() {
    const res = await api.get('/my-tickets')
    return res.data.data
  },

  async getMyRegistrations() {
    const res = await api.get('/my-registrations')
    return res.data.data
  },

  async checkInTicket(ticketCode) {
    const res = await api.post('/check-in', { ticket_code: ticketCode.trim() })
    return res.data
  },
}
