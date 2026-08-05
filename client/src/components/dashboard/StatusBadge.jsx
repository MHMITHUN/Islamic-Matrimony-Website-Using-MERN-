import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, XCircle } from 'lucide-react'

const MAP = {
    approved: { variant: 'success', icon: CheckCircle2 },
    pending: { variant: 'gold', icon: Clock },
    rejected: { variant: 'destructive', icon: XCircle },
    active: { variant: 'success', icon: CheckCircle2 },
    inactive: { variant: 'soft', icon: XCircle },
}

/**
 * Status pill for request/user states.
 */
export default function StatusBadge({ status }) {
    const s = String(status || '').toLowerCase()
    const config = MAP[s] || { variant: 'soft', icon: null }
    const Icon = config.icon
    return (
        <Badge variant={config.variant} className="capitalize gap-1">
            {Icon && <Icon className="h-3 w-3" />}
            {s}
        </Badge>
    )
}
