import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useModalStore } from '../../stores/useModalStore'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu'
import { 
  Ticket as TicketIcon, 
  QrCode, 
  LogOut, 
  ShieldCheck,
  ChevronDown,
  User as UserIcon,
} from 'lucide-react'

export function NavUserMenu() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const openAuthModal = useModalStore((s) => s.openAuthModal)
  const openScannerModal = useModalStore((s) => s.openScannerModal)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="flex items-center gap-3">
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-[#161B28] transition-colors cursor-pointer outline-none border border-transparent hover:border-slate-200 dark:hover:border-[#293247] select-none">
              <div className="h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-xl overflow-hidden bg-[#FF5C00] flex items-center justify-center font-mono font-extrabold text-xs sm:text-sm text-white shadow-md shadow-orange-950/30 shrink-0">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <div className="text-left hidden lg:block pr-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{user?.name}</p>
                <p className="text-[10px] text-slate-500 font-mono uppercase">{user?.role}</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="font-bold text-sm text-slate-900 dark:text-white">{user?.name}</div>
              <div className="text-xs text-slate-500 font-normal truncate">{user?.email}</div>
              <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-[#FF5C00]/10 text-[#FF5C00] uppercase">
                {user?.role}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <UserIcon className="h-4 w-4 mr-2 text-[#FF5C00]" />
              Profil Saya
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => navigate('/my-tickets')}>
              <TicketIcon className="h-4 w-4 mr-2 text-[#FF5C00]" />
              Tiket Saya
            </DropdownMenuItem>

            {isAdmin && (
              <>
                <DropdownMenuItem onClick={() => navigate('/admin/events')}>
                  <ShieldCheck className="h-4 w-4 mr-2 text-orange-500" />
                  Admin Panel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openScannerModal}>
                  <QrCode className="h-4 w-4 mr-2 text-orange-500" />
                  Scanner Check-In
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="text-rose-600 dark:text-rose-400 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openAuthModal('login')}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            Masuk
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => openAuthModal('register')}
            className="text-xs font-bold uppercase tracking-wider"
          >
            Daftar
          </Button>
        </div>
      )}
    </div>
  )
}
