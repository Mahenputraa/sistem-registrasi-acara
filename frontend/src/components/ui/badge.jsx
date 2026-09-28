import React from 'react'
import { cn } from '../../lib/utils'

export function Badge({ className, variant = 'default', children, ...props }) {
  const variants = {
    default: "bg-orange-500/10 text-orange-400 border-orange-500/25",
    tangerine: "bg-[#FF5C00]/15 text-[#FF7A26] border-[#FF5C00]/30 font-semibold",
    secondary: "bg-[#161B28] text-slate-300 border-[#293247]",
    cobalt: "bg-blue-500/10 text-blue-400 border-blue-500/25",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    destructive: "bg-rose-500/10 text-rose-400 border-rose-500/25",
    outline: "text-slate-400 border-[#293247]",
    gradient: "bg-orange-500/10 text-orange-400 border-orange-500/25",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-tight transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
