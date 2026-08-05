import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Lightweight progress bar (no Radix dependency).
 * Props: value (0-100), indicatorClassName
 */
const Progress = React.forwardRef(({ className, value = 0, indicatorClassName, ...props }, ref) => (
  <div
    ref={ref}
    role="progressbar"
    aria-valuenow={Math.round(value)}
    aria-valuemin={0}
    aria-valuemax={100}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-muted",
      className
    )}
    {...props}
  >
    <div
      className={cn(
        "h-full w-full flex-1 rounded-full bg-primary transition-all duration-500 ease-out",
        indicatorClassName
      )}
      style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, value))}%)` }}
    />
  </div>
))
Progress.displayName = "Progress"

export { Progress }
