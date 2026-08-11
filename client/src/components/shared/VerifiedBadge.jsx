import { BadgeCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';

// Renders a "verified" trust badge when a profile's verification.status === 'verified'.
// `verification` may be undefined for older profiles — the badge simply won't render.
const VerifiedBadge = ({ verification, className }) => {
    const { t } = useLanguage();

    if (!verification || verification.status !== 'verified') return null;

    return (
        <Badge
            variant="outline"
            title={t('biodata.details.verifiedTooltip') || 'Verified profile (NID / Imam endorsement)'}
            className={cn('gap-1 border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', className)}
        >
            <BadgeCheck className="h-3.5 w-3.5" /> {t('biodata.details.verified')}
        </Badge>
    );
};

export default VerifiedBadge;
