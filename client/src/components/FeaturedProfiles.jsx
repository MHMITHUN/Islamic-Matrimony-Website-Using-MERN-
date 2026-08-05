import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Crown, MapPin, Heart, ArrowRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

const FeaturedProfiles = ({ biodatas = [] }) => {
    const { t } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [perView, setPerView] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setPerView(1);
            else if (window.innerWidth < 1024) setPerView(2);
            else setPerView(3);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(1, biodatas.length - perView + 1);

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % maxIndex);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + maxIndex) % maxIndex);
    };

    useEffect(() => {
        const timer = setInterval(handleNext, 5000);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, biodatas.length, perView]);

    const visibleBiodatas = biodatas.slice(currentIndex, currentIndex + perView);

    const variants = {
        enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir) => ({ x: dir < 0 ? 60 : -60, opacity: 0 }),
    };

    if (!biodatas || biodatas.length === 0) return null;

    const NavBtn = ({ onClick, icon: Icon, label, side }) => (
        <button
            onClick={onClick}
            aria-label={label}
            className={cn(
                'absolute top-1/2 -translate-y-1/2 z-20 grid place-items-center h-11 w-11 rounded-full bg-background/90 backdrop-blur border border-border shadow-premium-lg text-foreground/70 hover:text-primary hover:border-primary/40 hover:-translate-y-1/2 hover:scale-105 transition-all',
                side === 'left' ? '-left-2 md:-left-5' : '-right-2 md:-right-5'
            )}
        >
            <Icon className="h-5 w-5" />
        </button>
    );

    return (
        <div className="relative px-2 md:px-5">
            <div className="overflow-hidden">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ x: { type: 'spring', stiffness: 260, damping: 30 }, opacity: { duration: 0.2 } }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                    >
                        {visibleBiodatas.map((biodata) => {
                            const isMale = biodata.biodataType === 'Male';
                            return (
                                <div key={biodata._id} className="group relative rounded-2xl overflow-hidden border border-border bg-card shadow-premium card-lift hover:shadow-premium-lg hover:border-primary/30">
                                    <div className="relative aspect-[4/5] overflow-hidden">
                                        {biodata.profileImage ? (
                                            <img
                                                src={biodata.profileImage}
                                                alt={`Featured Profile ${biodata.biodataId}`}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="grid place-items-center h-full w-full bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-950 dark:to-slate-900">
                                                <User className="h-16 w-16 text-emerald-300/60" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/15" />

                                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                            <Badge className="gap-1 bg-primary border-transparent text-primary-foreground"><Heart className="h-3 w-3 fill-current" /> {t('home.featured.featured', 'Featured')}</Badge>
                                            {biodata.isPremium && (
                                                <Badge className="gap-1 bg-gradient-gold border-transparent text-white"><Crown className="h-3 w-3" /> {t('biodata.card.premium', 'Premium')}</Badge>
                                            )}
                                        </div>
                                        <span className={cn('absolute top-3 right-3 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur', isMale ? 'bg-sky-500/85 text-white' : 'bg-rose-500/85 text-white')}>
                                            {isMale ? t('biodata.filters.male', 'Male') : t('biodata.filters.female', 'Female')}
                                        </span>

                                        <div className="absolute bottom-3 left-3 right-3 text-white">
                                            <p className="text-[10px] text-white/60 tabular-nums">ID: {biodata.biodataId}</p>
                                            <div className="flex items-end gap-1.5">
                                                <span className="text-2xl font-bold font-heading leading-none">{biodata.age}</span>
                                                <span className="text-[11px] text-white/80 mb-0.5">{t('biodata.card.years', 'yrs')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <p className="font-semibold text-sm text-foreground truncate mb-2">{biodata.occupation ? t(`enum.occupation.${biodata.occupation.toLowerCase()}`, biodata.occupation) : '—'}</p>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                                            <MapPin className="h-3.5 w-3.5 text-primary" />
                                            <span className="truncate">{biodata.permanentDivision ? t(`enum.division.${biodata.permanentDivision.toLowerCase()}`, biodata.permanentDivision) : '—'}</span>
                                        </div>
                                        <Button asChild size="sm" className="w-full">
                                            <Link to={`/biodata/${biodata.biodataId}`}>{t('biodata.card.viewProfile', 'View Profile')} <ArrowRight className="h-3.5 w-3.5" /></Link>
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>

            {biodatas.length > perView && (
                <>
                    <NavBtn onClick={handlePrev} icon={ChevronLeft} label="Previous profiles" side="left" />
                    <NavBtn onClick={handleNext} icon={ChevronRight} label="Next profiles" side="right" />
                    <div className="flex justify-center gap-1.5 mt-6">
                        {[...Array(maxIndex)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => { setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i); }}
                                aria-label={`Go to slide ${i + 1}`}
                                className={cn('h-1.5 rounded-full transition-all', i === currentIndex ? 'w-7 bg-primary' : 'w-1.5 bg-border hover:bg-primary/50')}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default FeaturedProfiles;
