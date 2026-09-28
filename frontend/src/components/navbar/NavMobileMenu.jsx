import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useModalStore } from '../../stores/useModalStore'
import { Button } from '../ui/button'
import { QrCode } from 'lucide-react'

export function NavMobileMenu({ isOpen, onClose }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const location = useLocation()

  const openAuthModal = useModalStore((s) => s.openAuthModal)
  const openScannerModal = useModalStore((s) => s.openScannerModal)

  if (!isOpen) return null

  const isActive = (path) => location.pathname === path

  const getLinkClass = (path, extraActive = '') => {
    const active = isActive(path)
    return `block px-3.5 py-2.5 rounded-xl text-sm font-semibold border transition-colors duration-150 ${
      active
        ? extraActive || 'text-slate-900 dark:text-white bg-slate-100 dark:bg-[#161B28] border-slate-200 dark:border-[#293247]'
        : 'text-slate-700 dark:text-slate-300 border-transparent hover:bg-slate-100 dark:hover:bg-[#161B28]'
    }`
  }

  const handleAuth = (mode) => {
    onClose()
    openAuthModal(mode)
  }

  const handleScanner = () => {
    onClose()
    openScannerModal()
  }

  const handleLogout = async () => {
    onClose()
    await logout()
  }

  return (
    <div className="md:hidden py-4 border-t border-slate-200 dark:border-[#1e2536] space-y-2 animate-in fade-in-0 duration-200">
      <Link
        to="/"
        onClick={onClose}
        className={getLinkClass('/')}
      >
        Jelajahi Acara
      </Link>

      {isAuthenticated && (
        <Link
          to="/my-tickets"
          onClick={onClose}
          className={getLinkClass('/my-tickets')}
        >
          Tiket Saya
        </Link>
      )}

      <Link
        to="/about"
        onClick={onClose}
        className={getLinkClass('/about')}
      >
        Tentang Kami
      </Link>

      {isAuthenticated && (
        <Link
          to="/profile"
          onClick={onClose}
          className={getLinkClass('/profile')}
        >
          Profil Saya
        </Link>
      )}

      {isAdmin && (
        <>
          <Link
            to="/admin/events"
            onClick={onClose}
            className={getLinkClass(
              '/admin/events',
              'text-orange-600 dark:text-orange-300 bg-orange-500/10 dark:bg-[#161B28] border-orange-500/30'
            )}
          >
            Admin Panel
          </Link>

          <button
            type="button"
            onClick={handleScanner}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-500/10 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <QrCode className="h-4 w-4" />
            Scanner Check-In
          </button>
        </>
      )}

      <div className="pt-3 border-t border-slate-200 dark:border-[#1e2536]">
        {isAuthenticated ? (
          <div className="flex items-center justify-between px-3.5 py-1">
            <div className="flex items-center gap-3 truncate pr-2">
              <div className="h-8.5 w-8.5 rounded-xl overflow-hidden bg-[#FF5C00] flex items-center justify-center font-mono font-extrabold text-xs text-white shadow-md shadow-orange-950/30 shrink-0">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <div className="truncate">
                <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 font-mono truncate">{user?.email}</p>
              </div>
            </div>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 px-1 pt-1">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleAuth('login')}
            >
              Masuk
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={() => handleAuth('register')}
            >
              Daftar
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
