import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
    Search, ArrowRight, Users, HeartHandshake, User as UserIcon,
    Star, ShieldCheck, BadgeCheck, Crown, Quote, Sparkles, CheckCircle2, Heart,
} from 'lucide-react';
import { FaMale, FaFemale } from 'react-icons/fa';
import { biodataAPI, successStoryAPI, analyticsAPI } from '../../api/api';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedCounter from '../../components/AnimatedCounter';
import FeaturedProfiles from '../../components/FeaturedProfiles';
import BiodataCard from '../../components/shared/BiodataCard';
import SectionHeading from '../../components/shared/SectionHeading';
import Reveal from '../../components/shared/Reveal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/* ============================ HERO ============================ */
const HeroSection = () => {
    const { t } = useLanguage();
    const slides = [
        { image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600', title: t('home.hero.heading1'), subtitle: t('home.hero.subtitle1') },
        { image: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=1600', title: t('home.hero.heading2'), subtitle: t('home.hero.subtitle2') },
        { image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600', title: t('home.hero.heading3'), subtitle: t('home.hero.subtitle3') },
    ];
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % slides.length), 6000);
        return () => clearInterval(timer);
    }, []);

    const features = t('home.hero.features', ['Verified Profiles', 'Islamic Values', '100% Secure']);
    const fallbackFeatures = ['Verified Profiles', 'Islamic Values', '100% Secure'];

    const heroStats = [
        { icon: Users, value: '50K+', label: t('home.stats.activeMembers'), tint: 'text-emerald-300', bg: 'bg-emerald-500/20' },
        { icon: HeartHandshake, value: '1000+', label: t('home.stats.marriages'), tint: 'text-amber-300', bg: 'bg-amber-500/20' },
        { icon: FaMale, value: '25K+', label: t('home.stats.maleProfiles'), tint: 'text-sky-300', bg: 'bg-sky-500/20' },
        { icon: FaFemale, value: '25K+', label: t('home.stats.femaleProfiles'), tint: 'text-rose-300', bg: 'bg-rose-500/20' },
    ];

    return (
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div key={index} className={cn('absolute inset-0 transition-opacity duration-1000', index === currentSlide ? 'opacity-100' : 'opacity-0')}>
                    <div
                        key={`${index}-${currentSlide === index}`}
                        className={cn('absolute inset-0 bg-cover bg-center', index === currentSlide && 'animate-[kenburns_8s_ease-out_forwards]')}
                        style={{ backgroundImage: `url(${slide.image})` }}
                    />
                </div>
            ))}
            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/95 via-emerald-950/80 to-slate-950/90" />
            <div className="absolute inset-0 bg-dots opacity-[0.07]" />

            <div className="relative container-custom py-20 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left */}
                    <div>
                        <motion.span
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-200 ring-1 ring-inset ring-white/15 backdrop-blur"
                        >
                            <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
                            {t('home.hero.bismillah')}
                        </motion.span>

                        <motion.h1
                            key={currentSlide}
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="mt-5 font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-white"
                        >
                            {slides[currentSlide].title}
                        </motion.h1>

                        <motion.p
                            key={`sub-${currentSlide}`}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.15 }}
                            className="mt-5 text-base md:text-lg text-slate-300 max-w-xl leading-relaxed"
                        >
                            {slides[currentSlide].subtitle}
                        </motion.p>

                        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                            {(Array.isArray(features) ? features : fallbackFeatures).map((feature, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-sm text-slate-300">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />{feature}
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button asChild size="lg" className="shadow-glow">
                                <Link to="/register">{t('home.hero.getStarted')} <ArrowRight className="h-4 w-4" /></Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                                <Link to="/biodatas"><Search className="h-4 w-4" /> {t('home.hero.browseBiodatas')}</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right: stat glass cards */}
                    <div className="hidden lg:grid grid-cols-2 gap-4">
                        {heroStats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                className={cn('rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md hover:bg-white/10 transition-colors', i % 2 === 1 && 'translate-y-6')}
                            >
                                <div className={cn('grid place-items-center h-11 w-11 rounded-xl mb-3', stat.bg, stat.tint)}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <p className="text-3xl font-bold font-heading text-white leading-none">{stat.value}</p>
                                <p className="text-xs text-slate-400 mt-1.5">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Slide dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={cn('h-1.5 rounded-full transition-all duration-300', index === currentSlide ? 'w-7 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/60')}
                    />
                ))}
            </div>
        </section>
    );
};

/* ===================== QUICK SEARCH BAR ===================== */
const QuickSearch = () => {
    const { t } = useLanguage();
    const [gender, setGender] = useState('');
    const [minAge, setMinAge] = useState('');
    const [division, setDivision] = useState('');

    const divisions = ['Dhaka', 'Chattogram', 'Khulna', 'Rajshahi', 'Sylhet', 'Barisal', 'Rangpur', 'Mymensingh'];

    const buildQuery = () => {
        const p = new URLSearchParams();
        if (gender) p.set('biodataType', gender);
        if (minAge) p.set('age', minAge);
        if (division) p.set('permanentDivision', division);
        return p.toString();
    };

    return (
        <section className="relative z-10 -mt-16 mb-4">
            <div className="container-custom">
                <Reveal>
                    <Card className="shadow-premium-lg border-border/60 overflow-hidden">
                        <CardContent className="p-5 md:p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="grid place-items-center h-9 w-9 rounded-lg bg-primary/10 text-primary"><Search className="h-4 w-4" /></span>
                                <div>
                                    <h3 className="font-heading font-semibold text-foreground leading-none">Find Your Match</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Quick search to begin</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                <select value={gender} onChange={(e) => setGender(e.target.value)} className="h-11 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                                    <option value="">Any Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                <select value={minAge} onChange={(e) => setMinAge(e.target.value)} className="h-11 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                                    <option value="">Any Age</option>
                                    {[18, 21, 25, 28, 30, 35, 40].map(a => <option key={a} value={a}>{a}+ years</option>)}
                                </select>
                                <select value={division} onChange={(e) => setDivision(e.target.value)} className="h-11 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                                    <option value="">Any Location</option>
                                    {divisions.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <Button asChild size="lg" className="h-11">
                                    <Link to={`/biodatas?${buildQuery()}`}>Search <ArrowRight className="h-4 w-4" /></Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </Reveal>
            </div>
        </section>
    );
};

/* ===================== PREMIUM MEMBERS ===================== */
const PremiumMembersSection = () => {
    const { t } = useLanguage();
    const [sortOrder, setSortOrder] = useState('asc');
    const { data: premiumBiodatas = [], isLoading } = useQuery({
        queryKey: ['premiumBiodatas', sortOrder],
        queryFn: async () => { const r = await biodataAPI.getPremium({ sort: sortOrder, limit: 6 }); return r.data; },
    });

    if (!isLoading && premiumBiodatas.length === 0) return null;

    return (
        <section className="py-16 md:py-20">
            <div className="container-custom">
                <SectionHeading
                    badge={t('home.premium.badge')}
                    badgeIcon={<Crown className="h-3.5 w-3.5 text-gold" />}
                    badgeClassName="bg-gold/10 text-gold ring-gold/20"
                    title={t('home.premium.heading')}
                    highlight={t('home.premium.highlight')}
                    highlightClassName="text-gradient-gold"
                    subtitle={t('home.premium.subtitle')}
                />
                <Reveal className="flex justify-center mb-8">
                    <div className="inline-flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Sort by age:</span>
                        <div className="inline-flex rounded-lg bg-muted p-0.5">
                            {[['asc', t('home.premium.sortAgeAsc')], ['desc', t('home.premium.sortAgeDesc')]].map(([val, label]) => (
                                <button
                                    key={val}
                                    onClick={() => setSortOrder(val)}
                                    className={cn('px-3 py-1.5 text-xs font-medium rounded-md transition-colors', sortOrder === val ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </Reveal>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{[...Array(6)].map((_, i) => <div key={i} className="rounded-2xl overflow-hidden border bg-card"><div className="aspect-[4/5] bg-muted animate-pulse" /><div className="p-4 space-y-2"><div className="h-4 bg-muted rounded animate-pulse" /><div className="h-3 w-2/3 bg-muted rounded animate-pulse" /></div></div>)}</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {premiumBiodatas.map((b, i) => <BiodataCard key={b._id} biodata={b} index={i} />)}
                    </div>
                )}

                <Reveal className="text-center mt-10">
                    <Button asChild variant="outline" size="lg">
                        <Link to="/biodatas">{t('home.premium.viewAll')} <ArrowRight className="h-4 w-4" /></Link>
                    </Button>
                </Reveal>
            </div>
        </section>
    );
};

/* ===================== FEATURED ===================== */
const FeaturedProfilesSection = () => {
    const { t } = useLanguage();
    const { data: premiumBiodatas = [], isLoading } = useQuery({
        queryKey: ['featuredPremiumBiodatas'],
        queryFn: async () => { const r = await biodataAPI.getPremium({ limit: 6 }); return r.data; },
    });
    if (!isLoading && (!premiumBiodatas || premiumBiodatas.length === 0)) return null;

    return (
        <section className="py-16 md:py-20 bg-muted/30">
            <div className="container-custom">
                <SectionHeading
                    badge={t('home.featured.badge')}
                    badgeIcon={<Sparkles className="h-3.5 w-3.5 text-primary" />}
                    title={t('home.featured.heading1')}
                    highlight={t('home.featured.highlight')}
                    subtitle={t('home.featured.subtitle')}
                />
                <div className="mt-8">
                    {isLoading ? (
                        <div className="flex justify-center py-10"><div className="spinner-lg" /></div>
                    ) : (
                        <FeaturedProfiles biodatas={premiumBiodatas} />
                    )}
                </div>
            </div>
        </section>
    );
};

/* ===================== HOW IT WORKS ===================== */
const HowItWorksSection = () => {
    const { t } = useLanguage();
    const steps = t('home.howItWorks.steps', [
        { title: 'Create Your Profile', desc: 'Register and create your biodata with accurate information about yourself.' },
        { title: 'Search Partners', desc: 'Browse through verified profiles and use filters to find your match.' },
        { title: 'Connect', desc: 'Request contact information and start meaningful conversations.' },
        { title: 'Get Married', desc: 'Find your compatible partner and take the step towards Nikah.' },
    ]);
    const icons = [Users, Search, HeartHandshake, Sparkles];

    return (
        <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-950 text-white">
            <div className="absolute inset-0 bg-dots opacity-[0.08]" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="relative container-custom">
                <SectionHeading
                    title={t('home.howItWorks.heading')}
                    highlight={t('home.howItWorks.highlight')}
                    highlightClassName="text-amber-300"
                    subtitle={t('home.howItWorks.subtitle')}
                    className="[&_p]:text-emerald-200"
                />
                <div className="relative mt-14 grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* connecting line */}
                    <div className="hidden lg:block absolute top-7 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                    {(Array.isArray(steps) ? steps : []).map((step, index) => (
                        <Reveal key={index} delay={index * 0.1} className="relative text-center">
                            <div className="relative inline-grid place-items-center mb-5">
                                <span className="grid place-items-center h-14 w-14 rounded-2xl bg-white/10 ring-1 ring-inset ring-white/15 backdrop-blur text-white">
                                    {(() => { const Icon = icons[index] || Sparkles; return <Icon className="h-6 w-6" />; })()}
                                </span>
                                <span className="absolute -top-1.5 -right-1.5 grid place-items-center h-6 w-6 rounded-full bg-gradient-gold text-white text-[11px] font-bold ring-4 ring-emerald-950">{index + 1}</span>
                            </div>
                            <h3 className="font-heading font-semibold text-white mb-1.5">{step.title}</h3>
                            <p className="text-xs text-emerald-200/80 leading-relaxed max-w-[22ch] mx-auto">{step.desc}</p>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ===================== SUCCESS COUNTERS ===================== */
const SuccessCounterSection = () => {
    const { t } = useLanguage();
    const { data: stats, isLoading } = useQuery({
        queryKey: ['analyticsStats'],
        queryFn: async () => { const r = await analyticsAPI.getStats(); return r.data; },
    });

    const counters = [
        { icon: Users, value: stats?.totalBiodatas || 0, label: t('home.success.totalBiodatas'), tint: 'text-emerald-600 bg-emerald-500/10' },
        { icon: FaMale, value: stats?.maleCount || 0, label: t('home.success.maleBiodatas'), tint: 'text-sky-600 bg-sky-500/10' },
        { icon: FaFemale, value: stats?.femaleCount || 0, label: t('home.success.femaleBiodatas'), tint: 'text-rose-600 bg-rose-500/10' },
        { icon: HeartHandshake, value: stats?.totalSuccessStories || 0, label: t('home.success.marriagesCompleted'), tint: 'text-amber-600 bg-amber-500/10', suffix: '+' },
    ];

    return (
        <section className="py-16 md:py-20">
            <div className="container-custom">
                <SectionHeading
                    title={t('home.success.heading1')}
                    highlight={t('home.success.heading2')}
                    subtitle={t('home.success.subtitle')}
                />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mt-10">
                    {counters.map((c, i) => (
                        <Reveal key={i} delay={i * 0.08}>
                            <Card className="card-lift hover:border-primary/30 text-center h-full">
                                <CardContent className="p-6">
                                    <div className={cn('grid place-items-center h-12 w-12 mx-auto mb-3 rounded-xl', c.tint)}>
                                        <c.icon className="h-6 w-6" />
                                    </div>
                                    <div className="text-3xl md:text-4xl font-bold font-heading tabular-nums text-foreground">
                                        {isLoading ? <div className="h-9 w-16 bg-muted rounded animate-pulse mx-auto" /> : <AnimatedCounter value={c.value} suffix={c.suffix || ''} />}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
                                </CardContent>
                            </Card>
                        </Reveal>
                    ))}
                </div>
                {stats && stats.successRate > 0 && (
                    <Reveal className="mt-8 flex justify-center">
                        <div className="inline-flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-5 py-3">
                            <Star className="h-5 w-5 fill-gold text-gold" />
                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{t('home.success.successRate')}</p>
                                <p className="text-xl font-bold font-heading text-primary">{isLoading ? '—' : <AnimatedCounter value={stats.successRate} suffix="%" duration={1.5} />}</p>
                            </div>
                        </div>
                    </Reveal>
                )}
            </div>
        </section>
    );
};

/* ===================== SUCCESS STORIES ===================== */
const SuccessStoriesSection = () => {
    const { t } = useLanguage();
    const { data: stories = [], isLoading } = useQuery({
        queryKey: ['successStories'],
        queryFn: async () => { const r = await successStoryAPI.getAll(); return r.data; },
    });
    const renderStars = (rating) => [...Array(5)].map((_, i) => <Star key={i} className={cn('h-3.5 w-3.5', i < rating ? 'fill-gold text-gold' : 'text-muted-foreground/30')} />);

    if (isLoading) return (
        <section className="py-16 md:py-20 bg-muted/30"><div className="container-custom"><div className="flex justify-center py-10"><div className="spinner-lg" /></div></div></section>
    );
    if (stories.length === 0) return null;

    return (
        <section className="py-16 md:py-20 bg-muted/30">
            <div className="container-custom">
                <SectionHeading
                    badge={t('home.stories.badge')}
                    badgeIcon={<HeartHandshake className="h-3.5 w-3.5 text-rose-500" />}
                    badgeClassName="bg-rose-500/10 text-rose-600 ring-rose-500/20"
                    title={t('home.stories.heading1')}
                    highlight={t('home.stories.highlight')}
                    highlightClassName="text-gradient-brand"
                    subtitle={t('home.stories.subtitle')}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
                    {stories.slice(0, 6).map((story, i) => (
                        <Reveal key={story._id} delay={(i % 3) * 0.1}>
                            <Card className="relative h-full card-lift hover:border-primary/30 overflow-hidden">
                                <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="relative">
                                            {story.coupleImage ? (
                                                <img src={story.coupleImage} alt="Couple" className="h-11 w-11 rounded-xl object-cover" />
                                            ) : (
                                                <div className="grid place-items-center h-11 w-11 rounded-xl bg-primary/10 text-primary"><HeartHandshake className="h-5 w-5" /></div>
                                            )}
                                            <span className="absolute -bottom-1 -right-1 grid place-items-center h-5 w-5 rounded-full bg-emerald-500 text-white ring-2 ring-card"><Heart className="h-2.5 w-2.5 fill-white" /></span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-0.5 mb-0.5">{renderStars(story.reviewStar)}</div>
                                            <p className="text-[11px] text-muted-foreground">{t('home.stories.married')} {new Date(story.marriageDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground italic leading-relaxed line-clamp-3">“{story.successStoryText}”</p>
                                </CardContent>
                            </Card>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ===================== CTA ===================== */
const CTASection = () => {
    const { t } = useLanguage();
    return (
        <section className="py-16 md:py-20">
            <div className="container-custom">
                <Reveal>
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-gold p-10 md:p-14 text-center shadow-premium-lg">
                        <div className="absolute inset-0 bg-dots opacity-[0.12]" />
                        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/20 blur-2xl" />
                        <div className="relative">
                            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">{t('home.cta.heading1')} <span className="text-emerald-950">{t('home.cta.highlight')}</span></h2>
                            <p className="mt-3 text-white/90 max-w-xl mx-auto text-sm md:text-base">{t('home.cta.desc')}</p>
                            <div className="mt-7 flex flex-wrap justify-center gap-3">
                                <Button asChild size="xl" className="bg-emerald-900 text-white hover:bg-emerald-800 shadow-lg">
                                    <Link to="/register">{t('home.cta.createProfile')} <ArrowRight className="h-4 w-4" /></Link>
                                </Button>
                                <Button asChild size="xl" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                                    <Link to="/biodatas">{t('home.cta.browseFirst')}</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

/* ============================ PAGE ============================ */
const Home = () => (
    <div className="pt-16">
        <HeroSection />
        <QuickSearch />
        <PremiumMembersSection />
        <FeaturedProfilesSection />
        <HowItWorksSection />
        <SuccessCounterSection />
        <SuccessStoriesSection />
        <CTASection />
    </div>
);

export default Home;
