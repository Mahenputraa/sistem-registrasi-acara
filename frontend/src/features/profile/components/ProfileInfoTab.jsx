import React, { useState, useEffect } from 'react'
import { User, Mail, Shield, Save, RotateCcw, CheckCircle2 } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { AvatarUploader } from './AvatarUploader'
import { profileService } from '../../../api'
import { toast } from 'sonner'

export function ProfileInfoTab({ user, onProfileUpdated }) {
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [prevUser, setPrevUser] = useState(user)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false)
  const [errors, setErrors] = useState({})

  // Sinkronkan state jika prop user berubah (pola React resmi untuk adjust state saat render)
  if (user !== prevUser) {
    setPrevUser(user)
    setName(user?.name || '')
    setEmail(user?.email || '')
  }

  // Bersihkan preview URL saat component unmount
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarPreview])

  const handleFileSelect = (file) => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview)
    }
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    setErrors((prev) => ({ ...prev, avatar: null }))
  }

  const handleReset = () => {
    setName(user?.name || '')
    setEmail(user?.email || '')
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview)
    }
    setAvatarFile(null)
    setAvatarPreview(null)
    setErrors({})
  }

  const handleRemoveAvatar = async () => {
    if (!user?.avatar) return
    setIsRemovingAvatar(true)
    try {
      const response = await profileService.removeAvatar()
      toast.success('Foto profil berhasil dihapus', {
        description: 'Tampilan profil kini menggunakan inisial nama default.',
      })
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }
      setAvatarFile(null)
      setAvatarPreview(null)
      onProfileUpdated(response.user)
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menghapus foto profil.'
      toast.error('Terjadi kesalahan', { description: msg })
    } finally {
      setIsRemovingAvatar(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    // Client-side quick check
    const newErrors = {}
    if (!name.trim()) newErrors.name = 'Nama lengkap tidak boleh kosong.'
    if (!email.trim()) newErrors.email = 'Alamat email tidak boleh kosong.'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('name', name.trim())
    formData.append('email', email.trim())
    if (avatarFile) {
      formData.append('avatar', avatarFile)
    }

    try {
      const response = await profileService.updateProfile(formData)
      toast.success('Profil berhasil diperbarui', {
        description: 'Data nama, email, dan foto profil Anda telah tersimpan.',
      })
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }
      setAvatarFile(null)
      setAvatarPreview(null)
      onProfileUpdated(response.user)
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setErrors(err.response.data.errors)
        toast.error('Periksa kembali isian formulir Anda')
      } else {
        const msg = err.response?.data?.message || 'Gagal menyimpan pembaruan profil.'
        toast.error('Gagal memperbarui profil', { description: msg })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasChanges =
    name !== (user?.name || '') ||
    email !== (user?.email || '') ||
    avatarFile !== null

  return (
    <div className="space-y-6">
      {/* Avatar Uploader Section */}
      <AvatarUploader
        currentAvatarUrl={user?.avatar_url}
        previewUrl={avatarPreview}
        userName={name || user?.name}
        onFileSelect={handleFileSelect}
        onRemoveAvatar={handleRemoveAvatar}
        isRemoving={isRemovingAvatar}
        disabled={isSubmitting}
      />

      {/* Profile Form Details */}
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#11141e] border border-slate-200 dark:border-[#1e2536] shadow-sm space-y-6"
      >
        <div className="border-b border-slate-100 dark:border-[#1e2536] pb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-[#FF5C00]" />
            Informasi Pribadi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Informasi ini digunakan untuk identitas kepemilikan e-tiket acara dan sertifikat Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>Nama Lengkap</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <Input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) setErrors((prev) => ({ ...prev, name: null }))
                }}
                disabled={isSubmitting}
                placeholder="Masukkan nama lengkap Anda"
                className={`pl-10 h-11 text-sm bg-slate-50/50 dark:bg-[#0c0e16]/50 ${
                  errors.name ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-rose-500 font-medium">{Array.isArray(errors.name) ? errors.name[0] : errors.name}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>Alamat Email</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }))
                }}
                disabled={isSubmitting}
                placeholder="nama@email.com"
                className={`pl-10 h-11 text-sm bg-slate-50/50 dark:bg-[#0c0e16]/50 ${
                  errors.email ? 'border-rose-500 focus-visible:ring-rose-500' : ''
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-500 font-medium">{Array.isArray(errors.email) ? errors.email[0] : errors.email}</p>
            )}
          </div>
        </div>

        {/* Account Role & Verification (Read-only status) */}
        <div className="pt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#161B28]/60 border border-slate-200/80 dark:border-[#293247]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-500/10 text-[#FF5C00] flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Peran Akun</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {user?.role === 'admin'
                    ? 'Anda memiliki hak akses administrator penuh untuk manajemen acara.'
                    : 'Akun peserta aktif untuk pemesanan tiket acara.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#FF5C00]/10 text-[#FF5C00] border border-[#FF5C00]/20">
                {user?.role || 'user'}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Aktif
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 dark:border-[#1e2536] flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          {hasChanges && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={isSubmitting}
              className="w-full sm:w-auto gap-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Batalkan
            </Button>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || !hasChanges}
            className="w-full sm:w-auto px-6 h-11 text-xs font-bold uppercase tracking-wider bg-[#FF5C00] hover:bg-[#FF7322] text-white shadow-lg shadow-orange-500/20 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Menyimpan...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
