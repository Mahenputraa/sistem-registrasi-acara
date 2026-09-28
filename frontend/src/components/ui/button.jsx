import React from 'react'
import { cn } from '../../lib/utils'

export const Button = React.forwardRef(({
  className,
  variant = 'default',
  size = 'md',
  children,
  disabled,
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-40 disabled:pointer-events-none cursor-pointer select-none tracking-tight hover:scale-[1.015] active:scale-[0.985] will-change-transform"

  const variants = {
    default: "bg-[#FF5C00] hover:bg-[#FF7322] text-white font-semibold shadow-lg shadow-orange-500/20 active:translate-y-0.5",
    gradient: "bg-[#FF5C00] hover:bg-[#FF7322] text-white font-semibold shadow-lg shadow-orange-500/20 active:translate-y-0.5",
    secondary: "dark:bg-[#161B28] dark:hover:bg-[#1E2536] dark:text-slate-100 dark:border-[#293247] bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 shadow-sm",
    outline: "dark:border-[#293247] dark:hover:border-slate-500 dark:bg-transparent dark:hover:bg-[#161B28] dark:text-slate-200 border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 shadow-sm",
    ghost: "dark:bg-transparent dark:hover:bg-[#161B28] dark:text-slate-300 dark:hover:text-white bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900",
    destructive: "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/40",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40",
  }

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5 rounded-lg",
    md: "text-sm px-4 py-2.5 gap-2 rounded-xl",
    lg: "text-base px-6 py-3 gap-2.5 font-semibold rounded-xl",
    icon: "h-10 w-10 p-0 items-center justify-center rounded-xl",
  }

  return (
    <button
      ref={ref}
      type={type}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'
