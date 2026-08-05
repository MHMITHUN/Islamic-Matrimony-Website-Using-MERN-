import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/**
 * Premium metric tile.
 * @param {object} props
 * @param {import('lucide-react').LucideIcon} props.icon
 * @param {string} props.label
 * @param {React.ReactNode} props.value
 * @param {string} [props.hint]
 * @param {string} [props.tint] - tailwind classes for icon chip
 * @param {boolean} [props.loading]
 */
export default function StatCard({ icon: Icon, label, value, hint, tint = 'bg-primary/10 text-primary', loading }) {
    return (
        <Card className="card-lift hover:border-primary/30">
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-muted-foreground mb-1.5">{label}</p>
                        <p className="text-2xl font-bold font-heading text-foreground tabular-nums">
                            {loading ? <span className="inline-block h-7 w-12 bg-muted rounded animate-pulse" /> : value}
                        </p>
                        {hint && <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{hint}</p>}
                    </div>
                    {Icon && (
                        <span className={cn('grid place-items-center h-10 w-10 rounded-xl shrink-0', tint)}>
                            <Icon className="h-5 w-5" />
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
