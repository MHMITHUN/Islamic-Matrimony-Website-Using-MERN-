import { ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Tazkiya = earned character trust. tier may be 'none'|'bronze'|'silver'|'gold'.
// Renders nothing when there's no earned tier (so profiles without endorsements stay clean).
const TIER_STYLE = {
    bronze: 'border-amber-600/40 bg-amber-500/10 text-amber-700 dark:text-amber-400',
    silver: 'border-slate-400/50 bg-slate-400/10 text-slate-600 dark:text-slate-300',
    gold: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
};

const TazkiyaBadge = ({ tier, score, className }) => {
    if (!tier || tier === 'none') return null;
    return (
        <Badge
            variant="outline"
            title={`Tazkiya: earned character trust (${score ?? 0})`}
            className={cn('gap-1 capitalize', TIER_STYLE[tier], className)}
        >
            <ShieldCheck className="h-3.5 w-3.5" /> Tazkiya · {tier}
        </Badge>
    );
};

export default TazkiyaBadge;
