import React from 'react'
import { Modal } from './dialog'
import { Button } from './button'
import { AlertTriangle, Trash2 } from 'lucide-react'

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Tindakan',
  message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  confirmLabel = 'Hapus',
  cancelLabel = 'Batal',
  isDestructive = true,
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            isDestructive
              ? 'bg-red-500/10 text-red-500 border border-red-500/20'
              : 'bg-orange-500/10 text-[#FF5C00] border border-orange-500/20'
          }`}
        >
          {isDestructive ? <Trash2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">{title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
        <Button variant="outline" size="sm" onClick={onClose} disabled={loading} className="text-xs">
          {cancelLabel}
        </Button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-2 ${
            isDestructive
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20'
              : 'bg-[#FF5C00] hover:bg-[#FF7322] text-white shadow-md shadow-orange-500/20'
          }`}
        >
          {loading && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
