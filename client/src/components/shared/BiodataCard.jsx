import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, MapPin, Heart, User, BadgeCheck, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Premium reusable biodata profile card.
 * @param {object} biodata - profile data
 * @param {number} [index] - for stagger animation
 * @param {boolean} [featured] - show "Featured" pill
 * @param {boolean} [isFavorite] - controlled favorite state
 * @param {(val:boolean)=>void} [onFavoriteChange] - favorite handler
 */
export default function BiodataCard({ biodata, index = 0, featured = false, isFavorite: controlledFav, onFavoriteChange }) {
    const [internalFav, setInternalFav] = useState(false);
    const [imgError, setImgError] = useState(false);
    const isFavorite = controlledFav !== undefined ? controlledFav : internalFav;
    const isMale = biodata.biodataType === 'Male';

    const toggleFav = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const next = !isFavorite;
        if (onFavoriteChange) onFavoriteChange(next);
        else setInternalFav(next);
    };

    const showImg = biodata.profileImage && !imgError;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4), ease: [0.22, 1, 0.36, 1] }}
            className="group relative rounded-2xl overflow-hidden border border-border bg-card shadow-premium card-lift hover:shadow-premium-lg hover:border-primary/30"
        >
            {/* Image */}
            <div className="relative aspect-[4/5] overflow-hidden">
                {showImg ? (
                    <img
                        src={biodata.profileImage}
                        alt={`Biodata ${biodata.biodataId}`}
                        onError={() => setImgError(true)}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-50 dark:from-emerald-950 dark:to-slate-900">
                        <User className="h-16 w-16 text-emerald-300/60" />
                    </div>
                )}

                {/* gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/20" />

                {/* Top badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {biodata.isPremium && (
                        <Badge className="gap-1 bg-gradient-gold border-transparent text-white shadow-sm">
                            <Crown className="h-3 w-3" /> Premium
                        </Badge>
                    )}
                    {featured && (
                        <Badge className="gap-1 bg-primary border-transparent text-primary-foreground shadow-sm">
                            <BadgeCheck className="h-3 w-3" /> Featured
                        </Badge>
                    )}
                </div>

                {/* Gender pill */}
                <div className="absolute top-3 right-3">
                    <span className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur',
                        isMale ? 'bg-sky-500/85 text-white' : 'bg-rose-500/85 text-white'
                    )}>
                        {biodata.biodataType}
                    </span>
                </div>

                {/* Favorite */}
                <button
                    onClick={toggleFav}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    aria-pressed={isFavorite}
                    className="absolute bottom-3 right-3 grid place-items-center h-9 w-9 rounded-full bg-white/15 backdrop-blur-md text-white hover:bg-white/25 transition-colors"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {isFavorite ? (
                            <motion.span key="filled" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
                                <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                            </motion.span>
                        ) : (
                            <motion.span key="outline" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
                                <Heart className="h-4 w-4" />
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>

                {/* Bottom info */}
                <div className="absolute bottom-3 left-3 right-14 text-white">
                    <p className="text-[10px] text-white/60 mb-0.5 tabular-nums">ID: {biodata.biodataId}</p>
                    <div className="flex items-end gap-1.5">
                        <span className="text-2xl font-bold font-heading leading-none">{biodata.age}</span>
                        <span className="text-[11px] text-white/80 mb-0.5">yrs</span>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-4">
                <p className="font-semibold text-sm text-foreground truncate mb-2">{biodata.occupation || '—'}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span className="truncate">{biodata.permanentDivision || '—'}</span>
                </div>
                <Button asChild size="sm" className="w-full group/btn">
                    <Link to={`/biodata/${biodata.biodataId}`}>
                        View Profile
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                    </Link>
                </Button>
            </div>
        </motion.div>
    );
}
