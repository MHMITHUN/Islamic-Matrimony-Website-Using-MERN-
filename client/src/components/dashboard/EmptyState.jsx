import { Card, CardContent } from '@/components/ui/card'

/**
 * Premium empty state for dashboard lists/tables.
 */
export default function EmptyState({ icon: Icon, title, description, action, className }) {
    return (
        <Card className={className}>
            <CardContent className="py-16 flex flex-col items-center text-center">
                {Icon && (
                    <div className="grid place-items-center h-16 w-16 rounded-2xl bg-muted text-muted-foreground mb-4">
                        <Icon className="h-7 w-7" />
                    </div>
                )}
                <h3 className="font-heading font-bold text-foreground mb-1">{title}</h3>
                {description && <p className="text-muted-foreground text-sm mb-5 max-w-sm">{description}</p>}
                {action}
            </CardContent>
        </Card>
    )
}
