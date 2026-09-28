import React from 'react'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'

export class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error caught by GlobalErrorBoundary:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#090A0F] text-slate-900 dark:text-slate-100 flex items-center justify-center p-6 transition-colors duration-300">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-[#11141e] border border-slate-200 dark:border-[#1e2536] shadow-xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-[#FF5C00] flex items-center justify-center mx-auto mb-5 border border-orange-500/20">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-2">
              Terjadi Kesalahan Tak Terduga
            </h1>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Sistem mendeteksi kendala runtime saat memproses halaman ini. Silakan muat ulang atau kembali ke beranda utama.
            </p>

            {this.state.error?.message && (
              <div className="p-3 mb-6 rounded-xl bg-slate-100 dark:bg-[#161B28] text-slate-700 dark:text-slate-300 text-left font-mono text-[11px] overflow-x-auto border border-slate-200 dark:border-[#1e2536]">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#FF5C00] hover:bg-[#FF7322] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-500/20 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Muat Ulang
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-[#1e2536] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#161B28] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                Ke Beranda
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
