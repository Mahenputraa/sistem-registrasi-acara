import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Mail, KeyRound, User as UserIcon, UserPlus, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'

export function RegisterForm({ formData, onChange, onSubmit, loading }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const passwordsMatch = formData.password && formData.password_confirmation && formData.password === formData.password_confirmation
  const passwordsMismatch = formData.password_confirmation && formData.password !== formData.password_confirmation

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nama Lengkap</label>
        <div className="relative">
          <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <Input
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="cth: Andi Pratama"
            className="pl-10"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            placeholder="nama@email.com"
            className="pl-10"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kata Sandi</label>
        <div className="relative">
          <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={onChange}
            placeholder="Minimal 6 karakter"
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
            title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Konfirmasi Kata Sandi</label>
        <div className="relative">
          <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={onChange}
            placeholder="Ulangi kata sandi"
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
            title={showConfirmPassword ? 'Sembunyikan konfirmasi kata sandi' : 'Tampilkan konfirmasi kata sandi'}
            aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi kata sandi' : 'Tampilkan konfirmasi kata sandi'}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {passwordsMatch && (
          <p className="mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Kata sandi cocok
          </p>
        )}
        {passwordsMismatch && (
          <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" /> Konfirmasi kata sandi belum sesuai
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="default"
        className="w-full mt-2"
        size="lg"
        disabled={loading}
      >
        {loading ? (
          'Memproses...'
        ) : (
          <span className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> Buat Akun Baru
          </span>
        )}
      </Button>
    </form>
  )
}
