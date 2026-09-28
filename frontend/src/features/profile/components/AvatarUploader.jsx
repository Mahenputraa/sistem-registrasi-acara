import React, { useRef } from 'react'
import { Camera, Trash2, Upload, AlertCircle } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { toast } from 'sonner'

export function AvatarUploader({
  currentAvatarUrl,
  previewUrl,
  userName,
  onFileSelect,
  onRemoveAvatar,
  isRemoving,
  disabled,
}) {
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validasi tipe file
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error('Format file tidak didukung', {
        description: 'Silakan pilih gambar dengan format JPG, PNG, atau WEBP.',
      })
      e.target.value = ''
      return
    }

    // Validasi ukuran file (maksimal 2MB)
    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('Ukuran file terlalu besar', {
        description: 'Maksimal ukuran foto profil adalah 2MB.',
      })
      e.target.value = ''
      return
    }

    onFileSelect(file)
  }

  const triggerUpload = () => {
    if (disabled) return
    fileInputRef.current?.click()
  }

  const activeAvatar = previewUrl || currentAvatarUrl
  const initials = userName
    ? userName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U'

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-2xl bg-white dark:bg-[#11141e] border border-slate-200 dark:border-[#1e2536] shadow-sm">
      {/* Avatar Container with Hover Effect */}
      <div className="relative group shrink-0">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-[#293247] shadow-inner bg-slate-100 dark:bg-[#161B28] flex items-center justify-center transition-all duration-200 group-hover:border-[#FF5C00]/50">
          {activeAvatar ? (
            <img
              src={activeAvatar}
              alt={userName || 'Foto Profil'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FF5C00]/20 to-orange-600/10 text-[#FF5C00] font-display font-extrabold text-3xl">
              {initials}
            </div>
          )}

          {/* Quick upload overlay */}
          <button
            type="button"
            onClick={triggerUpload}
            disabled={disabled}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer rounded-2xl"
            title="Klik untuk mengganti foto"
          >
            <Camera className="w-6 h-6 mb-1 text-white" />
            <span className="text-[11px] font-medium text-white/90">Ganti Foto</span>
          </button>
        </div>

        {/* Hidden input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Action Buttons & Hints */}
      <div className="flex-1 text-center sm:text-left space-y-2.5">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Foto Profil</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            Format yang didukung: <span className="font-semibold text-slate-700 dark:text-slate-300">JPG, PNG, atau WEBP</span>. Maksimum <span className="font-semibold text-slate-700 dark:text-slate-300">2MB</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={triggerUpload}
            disabled={disabled}
            className="gap-2 text-xs font-semibold hover:border-[#FF5C00]/40 hover:text-[#FF5C00] cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Pilih Foto Baru
          </Button>

          {currentAvatarUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemoveAvatar}
              disabled={disabled || isRemoving}
              className="gap-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-700 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isRemoving ? 'Menghapus...' : 'Hapus Foto'}
            </Button>
          )}
        </div>

        {previewUrl && (
          <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 pt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Foto baru dipilih. Tekan tombol <strong>Simpan Perubahan</strong> di bawah untuk menerapkan.</span>
          </div>
        )}
      </div>
    </div>
  )
}
