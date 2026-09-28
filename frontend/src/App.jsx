import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { useModalStore } from './stores/useModalStore'
import { Navbar } from './components/navbar/Navbar'
import { Footer } from './components/common/Footer'
import { ScrollToTop } from './components/common/ScrollToTop'
import { PageTransition } from './components/common/PageTransition'
import { GlobalErrorBoundary } from './components/common/GlobalErrorBoundary'
import { Toaster } from 'sonner'

// Code-split pages and modals for maximum initial load performance
const HomePage = React.lazy(() => import('./features/home/HomePage').then((m) => ({ default: m.HomePage })))
const EventDetailPage = React.lazy(() => import('./features/events/EventDetailPage').then((m) => ({ default: m.EventDetailPage })))
const MyTicketsPage = React.lazy(() => import('./features/tickets/MyTicketsPage').then((m) => ({ default: m.MyTicketsPage })))
const AdminEventsPage = React.lazy(() => import('./features/admin/AdminEventsPage').then((m) => ({ default: m.AdminEventsPage })))
const ProfilePage = React.lazy(() => import('./features/profile/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const AboutPage = React.lazy(() => import('./features/about/AboutPage').then((m) => ({ default: m.AboutPage })))



const AuthModal = React.lazy(() => import('./components/AuthModal').then((m) => ({ default: m.AuthModal })))
const CheckInModal = React.lazy(() => import('./components/CheckInModal').then((m) => ({ default: m.CheckInModal })))
const TicketBookingModal = React.lazy(() => import('./components/TicketBookingModal').then((m) => ({ default: m.TicketBookingModal })))

function PageFallback() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      className="min-h-[60vh] flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-orange-500/20 border-t-[#FF5C00] animate-spin" />
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Memuat halaman...</span>
      </div>
    </motion.div>
  )
}

function AppContent() {
  const { isAuthenticated, isAdmin } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  // Centralized Modal Store via Zustand
  const {
    authModalOpen,
    authMode,
    openAuthModal,
    closeAuthModal,
    scannerModalOpen,
    openScannerModal,
    closeScannerModal,
    bookingModalOpen,
    selectedEventForBooking,
    bookingParams,
    openBookingModal,
    closeBookingModal,
  } = useModalStore()

  const handleSelectEvent = (event, tierId = null, quantity = 1) => {
    if (!isAuthenticated) {
      openAuthModal('login')
      return
    }
    openBookingModal(event, tierId, quantity)
  }

  const handleBookingSuccess = () => {
    navigate('/my-tickets')
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#090A0F] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-[#FF5C00] selection:text-white transition-colors duration-300">
      {/* Toast notifications */}
      <Toaster position="top-right" theme={theme} richColors />

      {/* Global Navbar */}
      <Navbar />

      {/* Main Pages with Smooth Transitions & Suspense */}
      <main className="flex-1 relative z-0">
        <Suspense fallback={<PageFallback />}>
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <PageTransition>
                    <HomePage onSelectEvent={handleSelectEvent} />
                  </PageTransition>
                }
              />
              <Route
                path="/events/:id"
                element={
                  <PageTransition>
                    <EventDetailPage onBookTicket={handleSelectEvent} />
                  </PageTransition>
                }
              />
              <Route
                path="/about"
                element={
                  <PageTransition>
                    <AboutPage />
                  </PageTransition>
                }
              />
              <Route
                path="/my-tickets"
                element={
                  <PageTransition>
                    {isAuthenticated ? (
                      <MyTicketsPage />
                    ) : (
                      <div className="py-24 text-center">
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                          Silakan login untuk melihat tiket Anda.
                        </p>
                        <button
                          onClick={() => openAuthModal('login')}
                          className="px-6 py-2.5 rounded-xl bg-[#FF5C00] hover:bg-[#FF7322] text-white font-semibold cursor-pointer shadow-lg shadow-orange-500/20"
                        >
                          Masuk Sekarang
                        </button>
                      </div>
                    )}
                  </PageTransition>
                }
              />
              <Route
                path="/profile"
                element={
                  <PageTransition>
                    {isAuthenticated ? (
                      <ProfilePage />
                    ) : (
                      <div className="py-24 text-center">
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                          Silakan login untuk mengakses halaman profil Anda.
                        </p>
                        <button
                          onClick={() => openAuthModal('login')}
                          className="px-6 py-2.5 rounded-xl bg-[#FF5C00] hover:bg-[#FF7322] text-white font-semibold cursor-pointer shadow-lg shadow-orange-500/20"
                        >
                          Masuk Sekarang
                        </button>
                      </div>
                    )}
                  </PageTransition>
                }
              />
              <Route
                path="/admin/events"
                element={
                  isAdmin ? (
                    <PageTransition>
                      <AdminEventsPage onOpenScanner={openScannerModal} />
                    </PageTransition>
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      {/* Modern Minimalist Footer */}
      <Footer />

      {/* Modals - Dynamically loaded on demand via Zustand Store */}
      <Suspense fallback={null}>
        {authModalOpen && (
          <AuthModal
            isOpen={authModalOpen}
            onClose={closeAuthModal}
            initialMode={authMode}
          />
        )}

        {scannerModalOpen && (
          <CheckInModal
            isOpen={scannerModalOpen}
            onClose={closeScannerModal}
          />
        )}

        {bookingModalOpen && !!selectedEventForBooking && (
          <TicketBookingModal
            isOpen={bookingModalOpen}
            onClose={closeBookingModal}
            event={selectedEventForBooking}
            initialTierId={bookingParams.tierId}
            initialQuantity={bookingParams.quantity}
            onSuccess={handleBookingSuccess}
          />
        )}
      </Suspense>
    </div>
  )
}

export default function App() {
  return (
    <GlobalErrorBoundary>
      <Router>
        <ScrollToTop />
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </GlobalErrorBoundary>
  )
}
