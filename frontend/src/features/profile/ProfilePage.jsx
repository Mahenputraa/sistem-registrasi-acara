import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, ShieldCheck, FileText, Sparkles, CheckCircle2 } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import { useAuth } from '../../context/AuthContext'
import { ProfileInfoTab } from './components/ProfileInfoTab'
import { SecurityTab } from './components/SecurityTab'
import { TermsAndConditionsTab } from './components/TermsAndConditionsTab'

export function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('info')

  const handleProfileUpdated = (updatedUser) => {
    updateUser(updatedUser)
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U'

  return (
    <div className="w-full min-h-screen py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Top Profile Summary Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 mb-8 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent dark:from-[#FF5C00]/15 dark:via-orange-950/10 dark:to-transparent border border-orange-500/20 dark:border-[#293247] shadow-sm backdrop-blur-xs"
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
          {/* Avatar in Header */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white dark:border-[#1E2536] shadow-md bg-white dark:bg-[#161B28] flex items-center justify-center">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FF5C00] to-orange-600 text-white font-display font-black text-2xl sm:text-3xl shadow-inner">
                  {initials}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-[#11141e] flex items-center justify-center text-white" title="Akun Aktif">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* User Info Details */}
          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
                {user?.name || 'Pengguna'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FF5C00]/15 text-[#FF5C00] border border-[#FF5C00]/30">
                {user?.role || 'Peserta'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono">
              {user?.email}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 pt-1 flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5C00]" />
              <span>Kelola informasi pribadi, kata sandi, dan tinjau syarat ketentuan layanan acara.</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs Container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex p-1 h-12 bg-white dark:bg-[#11141e] border border-slate-200 dark:border-[#1e2536] shadow-sm rounded-2xl">
          <TabsTrigger
            value="info"
            className="gap-2 text-xs sm:text-sm font-semibold py-2 px-4 rounded-xl data-[state=active]:bg-[#FF5C00] data-[state=active]:text-white dark:data-[state=active]:bg-[#FF5C00] dark:data-[state=active]:text-white transition-all cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Profil</span>
          </TabsTrigger>

          <TabsTrigger
            value="security"
            className="gap-2 text-xs sm:text-sm font-semibold py-2 px-4 rounded-xl data-[state=active]:bg-[#FF5C00] data-[state=active]:text-white dark:data-[state=active]:bg-[#FF5C00] dark:data-[state=active]:text-white transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Keamanan</span>
          </TabsTrigger>

          <TabsTrigger
            value="terms"
            className="gap-2 text-xs sm:text-sm font-semibold py-2 px-4 rounded-xl data-[state=active]:bg-[#FF5C00] data-[state=active]:text-white dark:data-[state=active]:bg-[#FF5C00] dark:data-[state=active]:text-white transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Syarat & Ketentuan</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Profile Details & Avatar */}
        <TabsContent value="info">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ProfileInfoTab user={user} onProfileUpdated={handleProfileUpdated} />
          </motion.div>
        </TabsContent>

        {/* Tab 2: Security & Password */}
        <TabsContent value="security">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SecurityTab />
          </motion.div>
        </TabsContent>

        {/* Tab 3: Terms and Conditions */}
        <TabsContent value="terms">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TermsAndConditionsTab />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
