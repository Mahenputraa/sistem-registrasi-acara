import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Calendar, Ticket as TicketIcon, ShieldCheck, Info } from 'lucide-react'

export function NavLinks() {
  const { isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const getLinkClass = (active) =>
    `px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-colors duration-150 select-none focus:outline-none ${
      active
        ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-[#161B28] border-slate-200 dark:border-[#293247] shadow-sm'
        : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/70 dark:text-slate-400 dark:hover:text-white dark:hover:bg-[#161B28]/50'
    }`

  return (
    <nav className="hidden md:flex items-center gap-1.5">
      <Link to="/" className={getLinkClass(isActive('/'))}>
        <span className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />
          Jelajahi Acara
        </span>
      </Link>

      {isAuthenticated && (
        <Link to="/my-tickets" className={getLinkClass(isActive('/my-tickets'))}>
          <span className="flex items-center gap-2">
            <TicketIcon className="h-3.5 w-3.5 text-[#FF5C00]" />
            Tiket Saya
          </span>
        </Link>
      )}

      <Link to="/about" className={getLinkClass(isActive('/about'))}>
        <span className="flex items-center gap-2">
          <Info className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />
          Tentang Kami
        </span>
      </Link>

      {isAdmin && (
        <Link
          to="/admin/events"
          className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-colors duration-150 select-none focus:outline-none ${
            isActive('/admin/events')
              ? 'text-orange-600 dark:text-orange-300 bg-orange-500/10 dark:bg-[#161B28] border-orange-500/30 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/70 dark:text-slate-400 dark:hover:text-white dark:hover:bg-[#161B28]/50'
          }`}
        >
          <span className="flex items-center gap-2 text-orange-600 dark:text-orange-300">
            <ShieldCheck className="h-3.5 w-3.5 text-[#FF5C00]" />
            Admin Panel
          </span>
        </Link>
      )}
    </nav>
  )
}
