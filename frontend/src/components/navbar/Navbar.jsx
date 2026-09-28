import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { NavBrand } from './NavBrand'
import { NavLinks } from './NavLinks'
import { NavThemeToggle } from './NavThemeToggle'
import { NavUserMenu } from './NavUserMenu'
import { NavMobileMenu } from './NavMobileMenu'
import { useModalStore } from '../../stores/useModalStore'
import { Menu, X } from 'lucide-react'

// Silky smooth easing with strictly zero vertical movement
const layoutTransition = {
  type: 'tween',
  duration: 0.45,
  ease: [0.16, 1, 0.3, 1], // easeOutExpo: instantaneous response, graceful gliding deceleration
  x: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  y: { duration: 0 }, // STRICTLY ZERO: completely eliminates downward bounce/jolt ("hentakan kebawah")
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const ticketDetailModalOpen = useModalStore((s) => s.ticketDetailModalOpen)

  useEffect(() => {
    const handleScroll = () => {
      // Immediate trigger on the slightest scroll movement (even 1px)
      setIsScrolled(window.scrollY > 0)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isGathered = isScrolled || mobileMenuOpen

  return (
    <header
      className={`sticky top-0 z-50 w-full pt-2.5 sm:pt-3 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        ticketDetailModalOpen ? 'opacity-0 -translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0 pointer-events-none'
      }`}
    >
      {/* Unified Floating Pill Container: animates width horizontally without double-FLIP compounding */}
      <motion.div
        layout
        transition={layoutTransition}
        className={`relative w-full mx-auto pointer-events-auto ${
          isGathered ? 'max-w-7xl' : 'max-w-full'
        }`}
      >
        {/* Smooth Glass Backdrop: Fades in simultaneously with zero delay and no pop */}
        <div
          className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 ease-out ${
            isGathered
              ? 'opacity-100 bg-white/50 dark:bg-[#11141e]/65 backdrop-blur-xl border border-slate-200/80 dark:border-[#1e2536] shadow-lg dark:shadow-2xl'
              : 'opacity-0 bg-transparent border border-transparent shadow-none'
          }`}
        />

        {/* Inner Content Bar: Padded inside capsule when gathered, edge-to-edge when at top */}
        <div
          className={`relative z-10 flex items-center justify-between h-14 sm:h-16 transition-[padding] duration-300 ease-out ${
            isGathered ? 'px-4 sm:px-6' : 'px-0'
          }`}
        >
          {/* Left Group: Brand Logo + Divider + Navigation Links (glides horizontally into place) */}
          <motion.div
            layout="position"
            transition={layoutTransition}
            className="flex items-center gap-3 sm:gap-4 md:gap-5"
          >
            <NavBrand />
            <NavLinks />
          </motion.div>

          {/* Right Group: Theme Toggle + User / Auth Actions (glides horizontally into place) */}
          <motion.div
            layout="position"
            transition={layoutTransition}
            className="hidden md:flex items-center gap-2.5 sm:gap-3"
          >
            <NavThemeToggle />
            <NavUserMenu />
          </motion.div>

          {/* Mobile Quick Controls */}
          <motion.div
            layout="position"
            transition={layoutTransition}
            className="flex md:hidden items-center gap-2"
          >
            <NavThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#161B28] cursor-pointer transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </motion.div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="relative z-10 px-4 sm:px-6 pb-2">
            <NavMobileMenu
              isOpen={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
            />
          </div>
        )}
      </motion.div>
    </header>
  )
}
