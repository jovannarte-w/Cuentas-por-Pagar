import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-base transition-all duration-200 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-900 placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-3 focus-visible:ring-blue-500/20 focus-visible:bg-blue-50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-50 disabled:text-slate-400 aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-200 aria-invalid:focus-visible:ring-red-200 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
