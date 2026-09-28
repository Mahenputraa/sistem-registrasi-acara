import api from '../lib/api'

export const authService = {
  async login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    return res.data
  },

  async register(name, email, password, password_confirmation) {
    const res = await api.post('/auth/register', {
      name,
      email,
      password,
      password_confirmation,
    })
    return res.data
  },

  async getUser() {
    const res = await api.get('/auth/user')
    return res.data.user
  },

  async logout() {
    const res = await api.post('/auth/logout')
    return res.data
  },
}
