import React, { useState } from 'react'
import { Modal } from './ui/dialog'
import { useAuth } from '../context/AuthContext'
import { toast } from 'sonner'
import { DemoAccountsBar, LoginForm, RegisterForm } from './auth'

export function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode) // 'login' | 'register'
  const { login, register } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password)
        toast.success('Berhasil masuk! Selamat datang kembali.')
      } else {
        await register(
          formData.name,
          formData.email,
          formData.password,
          formData.password_confirmation
        )
        toast.success('Pendaftaran berhasil! Akun Anda siap digunakan.')
      }
      onClose()
    } catch (err) {
      const msg = err.response?.data?.message || 'Terjadi kesalahan. Silakan periksa kembali input Anda.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (role) => {
    if (role === 'admin') {
      setFormData({
        name: '',
        email: 'admin@acara.com',
        password: 'password',
        password_confirmation: '',
      })
    } else {
      setFormData({
        name: '',
        email: 'budi@user.com',
        password: 'password',
        password_confirmation: '',
      })
    }
    setMode('login')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Masuk ke Acara Tech' : 'Daftar Akun Baru'}
      description={mode === 'login' ? 'Akses tiket dan event terdaftar Anda' : 'Buat akun untuk memesan tiket event seru'}
    >
      {/* Quick Demo Fill Buttons */}
      <DemoAccountsBar onSelectDemo={fillDemo} />

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-300 text-xs">
          {error}
        </div>
      )}

      {mode === 'login' ? (
        <LoginForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
        />
      ) : (
        <RegisterForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
        />
      )}

      <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-4">
        {mode === 'login' ? (
          <p>
            Belum punya akun?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('register')
                setError('')
              }}
              className="text-[#FF5C00] hover:underline font-semibold cursor-pointer"
            >
              Daftar sekarang
            </button>
          </p>
        ) : (
          <p>
            Sudah memiliki akun?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setError('')
              }}
              className="text-[#FF5C00] hover:underline font-semibold cursor-pointer"
            >
              Masuk di sini
            </button>
          </p>
        )}
      </div>
    </Modal>
  )
}
