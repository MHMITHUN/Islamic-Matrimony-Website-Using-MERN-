import { cn } from '@/lib/utils'

/**
 * Dashboard page header: optional icon tile, title, description, and trailing actions.
 */
export default function PageHeader({ title, description, icon: Icon, children, className }) {
    return (
        <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4', className)}>
            <div className="flex items-center gap-3">
                {Icon && (
                    <span className="hidden sm:grid place-items-center h-11 w-11 rounded-xl bg-primary/10 text-primary shrink-0">
                        <Icon className="h-5 w-5" />
                    </span>
                )}
                <div>
                    <h1 className="font-heading text-xl md:text-2xl font-bold tracking-tight text-foreground">{title}</h1>
                    {description && <p className="text-muted-foreground text-sm mt-0.5">{description}</p>}
                </div>
            </div>
            {children && <div className="flex items-center gap-2 flex-wrap">{children}</div>}
        </div>
    )
}
