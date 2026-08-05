import { Link } from 'react-router-dom'
import { FaMosque } from 'react-icons/fa'
import { cn } from '@/lib/utils'

/**
 * Brand logo — emerald gradient tile with shine-sweep on hover.
 * @param {object} props
 * @param {string} [props.to]
 * @param {boolean} [props.compact] - hide wordmark
 * @param {string} [props.className]
 * @param {'dark'|'light'} [props.textVariant] - for use on dark backgrounds
 */
export default function Logo({ to = '/', compact = false, className, textVariant = 'default' }) {
  return (
    <Link to={to} className={cn('group flex items-center gap-2.5', className)}>
      <span className="relative grid place-items-center h-10 w-10 rounded-xl bg-gradient-brand text-white shadow-glow overflow-hidden shrink-0">
        {/* shine sweep */}
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-out" />
        <FaMosque className="relative text-[18px]" />
        <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              'font-heading text-lg font-bold tracking-tight',
              textVariant === 'light' ? 'text-white' : 'text-foreground'
            )}
          >
            Nikah
          </span>
          <span
            className={cn(
              'text-[10px] font-medium tracking-wide',
              textVariant === 'light' ? 'text-white/60' : 'text-muted-foreground'
            )}
          >
            Islamic Matrimony
          </span>
        </span>
      )}
    </Link>
  )
}
