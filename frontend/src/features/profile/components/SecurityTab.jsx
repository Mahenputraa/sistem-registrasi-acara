import React, { useState } from 'react'
import { Lock, Eye, EyeOff, ShieldCheck, KeyRound, Check, X } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { profileService } from '../../../api'
import { toast } from 'sonner'

export function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  // Evaluasi kekuatan password baru
  const hasMinLength = password.length >= 8
  const hasNumber = /\d/.test(password)
  const hasLetter = /[a-zA-Z]/.test(password)
  const isMatch = password && password === passwordConfirmation

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    const newErrors = {}
    if (!currentPassword) newErrors.current_password = 'Kata sandi saat ini wajib diisi.'
    if (!password) newErrors.password = 'Kata sandi baru wajib diisi.'
    if (password.length < 8) newErrors.password = 'Kata sandi baru minimal 8 karakter.'
    if (password !== passwordConfirmation) newErrors.password_confirmation = 'Konfirmasi kata sandi tidak cocok.'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await profileService.updatePassword({
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      })

      toast.success('Kata sandi berhasil diperbarui', {
        description: 'Gunakan kata sandi baru Anda saat login berikutnya.',
      })

      // Reset form
      setCurrentPassword('')
      setPassword('')
      setPasswordConfirmation('')
      setErrors({})
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setErrors(err.response.data.errors)
        toast.error('Gagal memperbarui kata sandi', {
          description: 'Silakan periksa kembali data yang dimasukkan.',
        })
      } else {
        const msg = err.response?.data?.message || 'Terjadi kesalahan saat memperbarui kata sandi.'
        toast.error('Gagal memperbarui kata sandi', { description: msg })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#11141e] border border-slate-200 dark:border-[#1e2536] shadow-sm space-y-6"
      >
        <div className="border-b border-slate-100 dark:border-[#1e2536] pb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#FF5C00]" />
            Keamanan Akun & Kata Sandi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pastikan akun Anda tetap aman dengan menggunakan kata sandi yang kuat dan tidak digunakan di situs lain.
          </p>
        </div>

        <div className="space-y-4 max-w-xl">
          {/* Current Password */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>Kata Sandi Saat Ini</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <Input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value)
                  if (errors.current_password) setErrors((p) => ({ ...p, current_password: null }))
                }}
                disabled={isSubmitting}
                placeholder="Masukkan kata sandi lama Anda"
                className={`pl-10 pr-10 h-11 text-sm bg-slate-50/50 dark:bg-[#0c0e16]/50 ${
                  errors.current_password ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.current_password && (
              <p className="text-xs text-rose-500 font-medium">
                {Array.isArray(errors.current_password) ? errors.current_password[0] : errors.current_password}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>Kata Sandi Baru</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <Input
                type={showNew ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors((p) => ({ ...p, password: null }))
                }}
                disabled={isSubmitting}
                placeholder="Minimal 8 karakter"
                className={`pl-10 pr-10 h-11 text-sm bg-slate-50/50 dark:bg-[#0c0e16]/50 ${
                  errors.password ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-rose-500 font-medium">
                {Array.isArray(errors.password) ? errors.password[0] : errors.password}
              </p>
            )}

            {/* Password Requirement Checklist */}
            {password && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#161B28]/50 border border-slate-200/60 dark:border-[#293247]/60 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  {hasMinLength ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className={hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}>
                    Minimal 8 karakter
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {hasLetter && hasNumber ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className={hasLetter && hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}>
                    Mengandung kombinasi huruf dan angka
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>Konfirmasi Kata Sandi Baru</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <Input
                type={showConfirm ? 'text' : 'password'}
                value={passwordConfirmation}
                onChange={(e) => {
                  setPasswordConfirmation(e.target.value)
                  if (errors.password_confirmation) setErrors((p) => ({ ...p, password_confirmation: null }))
                }}
                disabled={isSubmitting}
                placeholder="Ketik ulang kata sandi baru"
                className={`pl-10 pr-10 h-11 text-sm bg-slate-50/50 dark:bg-[#0c0e16]/50 ${
                  errors.password_confirmation ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordConfirmation && !isMatch && (
              <p className="text-xs text-rose-500 font-medium">Konfirmasi kata sandi belum cocok.</p>
            )}
            {errors.password_confirmation && (
              <p className="text-xs text-rose-500 font-medium">
                {Array.isArray(errors.password_confirmation) ? errors.password_confirmation[0] : errors.password_confirmation}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 dark:border-[#1e2536] flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || !currentPassword || !password || !passwordConfirmation}
            className="w-full sm:w-auto px-6 h-11 text-xs font-bold uppercase tracking-wider bg-[#FF5C00] hover:bg-[#FF7322] text-white shadow-lg shadow-orange-500/20 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Memperbarui...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Perbarui Kata Sandi
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
