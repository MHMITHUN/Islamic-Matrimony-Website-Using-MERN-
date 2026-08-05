import { ShieldCheck, BadgeCheck, Heart, Users, Quote, Sparkles } from 'lucide-react';
import { FaMosque } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeading from '../../components/shared/SectionHeading';
import Reveal from '../../components/shared/Reveal';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const About = () => {
    const { t } = useLanguage();

    const values = [
        { icon: ShieldCheck, title: t('about.values.privacy.title'), description: t('about.values.privacy.desc'), tint: 'bg-sky-500/10 text-sky-600' },
        { icon: BadgeCheck, title: t('about.values.verified.title'), description: t('about.values.verified.desc'), tint: 'bg-emerald-500/10 text-emerald-600' },
        { icon: Heart, title: t('about.values.islamic.title'), description: t('about.values.islamic.desc'), tint: 'bg-rose-500/10 text-rose-600' },
        { icon: Users, title: t('about.values.community.title'), description: t('about.values.community.desc'), tint: 'bg-amber-500/10 text-amber-600' },
    ];

    const stats = [
        { value: '50K+', label: t('about.stats.members') },
        { value: '1000+', label: t('about.stats.marriages') },
        { value: '7', label: t('about.stats.divisions') },
    ];

    return (
        <div className="min-h-screen pt-16">
            {/* Hero */}
            <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-950 text-white">
                <div className="absolute inset-0 bg-dots opacity-[0.08]" />
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
                <div className="relative container-custom text-center">
                    <div className="inline-grid place-items-center h-14 w-14 rounded-2xl bg-gradient-gold shadow-glow mx-auto mb-5"><FaMosque className="text-2xl text-white" /></div>
                    <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">{t('about.hero.heading1')} <span className="text-amber-300">{t('about.hero.highlight')}</span> {t('about.hero.heading2')}</h1>
                    <p className="mt-4 text-base md:text-lg text-emerald-100/80 max-w-2xl mx-auto">{t('about.hero.desc')}</p>
                </div>
            </section>

            {/* Mission */}
            <section className="py-16 md:py-20">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <Reveal>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20 mb-4"><Sparkles className="h-3.5 w-3.5" /> Our Mission</span>
                            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">{t('about.mission.heading1')} <span className="text-gradient-brand">{t('about.mission.highlight')}</span></h2>
                            <p className="text-muted-foreground mb-3 leading-relaxed">{t('about.mission.text1')}</p>
                            <p className="text-muted-foreground leading-relaxed">{t('about.mission.text2')}</p>
                        </Reveal>
                        <Reveal delay={0.1} className="relative">
                            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600" alt="Islamic Wedding" className="rounded-2xl w-full shadow-premium-lg" />
                            <div className="absolute -bottom-5 -left-5 hidden sm:block rounded-2xl bg-gradient-brand text-white p-5 shadow-glow">
                                <p className="text-3xl font-bold font-heading leading-none">1000+</p>
                                <p className="text-emerald-100 text-xs mt-1">{t('about.mission.stat')}</p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 md:py-20 bg-muted/30">
                <div className="container-custom">
                    <SectionHeading title={t('about.values.heading')} subtitle={t('about.values.subtitle')} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
                        {values.map((value, index) => (
                            <Reveal key={index} delay={index * 0.08}>
                                <Card className="card-lift hover:border-primary/30 text-center h-full">
                                    <CardContent className="p-6">
                                        <div className={cn('grid place-items-center h-12 w-12 rounded-xl mx-auto mb-4', value.tint)}>
                                            <value.icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-heading font-bold text-foreground mb-1.5">{value.title}</h3>
                                        <p className="text-muted-foreground text-xs leading-relaxed">{value.description}</p>
                                    </CardContent>
                                </Card>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quote */}
            <section className="py-16 bg-gradient-gold relative overflow-hidden">
                <div className="absolute inset-0 bg-dots opacity-[0.12]" />
                <div className="relative container-custom text-center">
                    <Quote className="h-8 w-8 text-white/40 mx-auto mb-3" />
                    <p className="text-2xl md:text-3xl text-white mb-3 leading-relaxed font-arabic">{t('about.quote.arabic')}</p>
                    <p className="text-base text-white/90 italic mb-3 max-w-2xl mx-auto">{t('about.quote.text')}</p>
                    <p className="text-sm font-semibold text-white">— {t('about.quote.ref')}</p>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 md:py-20">
                <div className="container-custom">
                    <SectionHeading title={t('about.stats.heading')} subtitle={t('about.stats.subtitle')} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
                        {stats.map((stat, index) => (
                            <Reveal key={index} delay={index * 0.1}>
                                <Card className="text-center card-lift hover:border-primary/30">
                                    <CardContent className="p-8">
                                        <div className="text-4xl md:text-5xl font-bold font-heading text-gradient-brand mb-2">{stat.value}</div>
                                        <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                                    </CardContent>
                                </Card>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
