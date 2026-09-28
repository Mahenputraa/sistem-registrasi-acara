import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Mail, KeyRound, LogIn, Eye, EyeOff } from 'lucide-react'

export function LoginForm({ formData, onChange, onSubmit, loading }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
            <LogIn className="h-4 w-4" /> Masuk Sekarang
          </span>
        )}
      </Button>
    </form>
  )
}
