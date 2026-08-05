import { cn } from '@/lib/utils'
import Reveal from './Reveal'

/**
 * Premium section heading: optional badge pill + gradient title + subtitle.
 */
export default function SectionHeading({
  badge,
  badgeIcon,
  badgeClassName,
  title,
  highlight,
  highlightClassName = 'text-gradient-brand',
  subtitle,
  align = 'center',
  className,
}) {
  const alignClass =
    align === 'center'
      ? 'text-center items-center mx-auto'
      : align === 'right'
      ? 'text-right items-end ml-auto'
      : 'text-left items-start'

  return (
    <Reveal className={cn('flex flex-col gap-3 max-w-2xl', alignClass, className)}>
      {badge && (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ring-border bg-muted/60 backdrop-blur',
            badgeClassName
          )}
        >
          {badgeIcon}
          {badge}
        </span>
      )}
      {title && (
        <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          {title} {highlight && <span className={highlightClassName}>{highlight}</span>}
        </h2>
      )}
      {subtitle && (
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </Reveal>
  )
}
