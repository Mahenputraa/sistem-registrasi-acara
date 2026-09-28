import React from 'react'

export function DemoAccountsBar({ onSelectDemo }) {
  return (
    <div className="mb-5 p-3 rounded-2xl bg-slate-50 dark:bg-[#161B28] border border-slate-200 dark:border-[#293247] text-xs text-slate-700 dark:text-slate-300">
      <span className="font-semibold block mb-2 text-slate-900 dark:text-white font-mono uppercase text-[10px] tracking-wider">
        Demo Login Akun:
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onSelectDemo('admin')}
          className="px-2.5 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-600 dark:text-orange-300 font-semibold transition-colors cursor-pointer text-xs"
        >
          Admin (admin@acara.com)
        </button>
        <button
          type="button"
          onClick={() => onSelectDemo('user')}
          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#161B28] hover:bg-slate-100 dark:hover:bg-[#202738] border border-slate-200 dark:border-[#293247] text-slate-800 dark:text-slate-200 font-semibold transition-colors cursor-pointer text-xs shadow-sm"
        >
          User (budi@user.com)
        </button>
      </div>
    </div>
  )
}
