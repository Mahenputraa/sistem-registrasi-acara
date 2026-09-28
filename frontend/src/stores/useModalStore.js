import { create } from 'zustand'

export const useModalStore = create((set) => ({
  // Auth Modal
  authModalOpen: false,
  authMode: 'login', // 'login' | 'register'
  openAuthModal: (mode = 'login') => set({ authModalOpen: true, authMode: mode }),
  closeAuthModal: () => set({ authModalOpen: false }),

  // Scanner Modal (QR Check-in)
  scannerModalOpen: false,
  openScannerModal: () => set({ scannerModalOpen: true }),
  closeScannerModal: () => set({ scannerModalOpen: false }),

  // Ticket Booking Modal
  bookingModalOpen: false,
  selectedEventForBooking: null,
  bookingParams: { tierId: null, quantity: 1 },
  openBookingModal: (event, tierId = null, quantity = 1) =>
    set({
      bookingModalOpen: true,
      selectedEventForBooking: event,
      bookingParams: { tierId, quantity },
    }),
  closeBookingModal: () =>
    set({
      bookingModalOpen: false,
      selectedEventForBooking: null,
      bookingParams: { tierId: null, quantity: 1 },
    }),

  // Ticket Detail Modal
  ticketDetailModalOpen: false,
  setTicketDetailModalOpen: (open) => set({ ticketDetailModalOpen: open }),
}))
