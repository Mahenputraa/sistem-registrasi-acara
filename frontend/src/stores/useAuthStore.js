import { create } from 'zustand'
import { authService } from '../api'

const getInitialUser = () => {
  try {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export const useAuthStore = create((set, get) => ({
  user: getInitialUser(),
  token: localStorage.getItem('token') || null,
  loading: true,

  get isAuthenticated() {
    return !!get().user
  },

  get isAdmin() {
    return get().user?.role === 'admin'
  },

  checkAuth: async () => {
    const token = get().token
    if (!token) {
      set({ loading: false })
      return
    }

    try {
      const userData = await authService.getUser()
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData))
        set({ user: userData, loading: false })
      }
    } catch {
      // Token expired or invalid
      get().logout()
      set({ loading: false })
    }
  },

  login: async (email, password) => {
    const data = await authService.login(email, password)
    const { token: newToken, user: userData } = data
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userData))
    set({ token: newToken, user: userData })
    return userData
  },

  register: async (name, email, password, password_confirmation) => {
    const data = await authService.register(name, email, password, password_confirmation)
    const { token: newToken, user: userData } = data
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userData))
    set({ token: newToken, user: userData })
    return userData
  },

  logout: async () => {
    try {
      await authService.logout()
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      set({ token: null, user: null })
    }
  },

  updateUser: (userData) => {
    const currentUser = get().user || {}
    const updated = { ...currentUser, ...userData }
    localStorage.setItem('user', JSON.stringify(updated))
    set({ user: updated })
  },
}))
