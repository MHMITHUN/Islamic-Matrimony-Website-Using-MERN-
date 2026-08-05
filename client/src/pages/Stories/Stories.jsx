import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, Quote, Heart, Calendar, Frown, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { successStoryAPI } from '../../api/api';
import SectionHeading from '../../components/shared/SectionHeading';
import Reveal from '../../components/shared/Reveal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';

const Stories = () => {
    const { t, language } = useLanguage();
    const [selectedStory, setSelectedStory] = useState(null);
    const [minRating, setMinRating] = useState(0);

    const { data: stories = [], isLoading } = useQuery({
        queryKey: ['successStories'],
        queryFn: async () => { const res = await successStoryAPI.getAll(); return res.data; },
    });

    const filtered = stories.filter(s => minRating === 0 || s.reviewStar >= minRating);
    const renderStars = (rating, size = 'h-3.5 w-3.5') => [...Array(5)].map((_, i) => (
        <Star key={i} className={cn(size, i < rating ? 'fill-gold text-gold' : 'text-muted-foreground/30')} />
    ));

    return (
        <>
            <Helmet><title>{t('storiesPage.title', 'Success Stories - Nikah Matrimony')}</title></Helmet>
            <div className="min-h-screen pt-20 pb-16 bg-muted/30">
                <div className="container-custom">
                    {/* Hero */}
                    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-10 md:p-14 mb-10 text-center">
                        <div className="absolute inset-0 bg-dots opacity-[0.08]" />
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-60 w-60 rounded-full bg-emerald-400/20 blur-3xl" />
                        <div className="relative">
                            <Badge className="mb-4 gap-1 bg-white/10 text-emerald-100 ring-1 ring-inset ring-white/15 border-transparent"><Heart className="h-3 w-3" /> {t('storiesPage.badge', 'Success Stories')}</Badge>
                            <h1 className="font-heading text-3xl md:text-4xl font-bold">{t('storiesPage.heading', 'Real couples,')} <span className="text-amber-300">{t('storiesPage.highlight', 'real unions')}</span></h1>
                            <p className="mt-3 text-emerald-100/80 max-w-lg mx-auto text-sm">{t('storiesPage.subtitle', 'Couples who found their life partners through our platform, alhamdulillah.')}</p>
                        </div>
                    </section>

                    {/* Filter */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <span className="text-xs text-muted-foreground">{t('storiesPage.filterByRating', 'Filter by rating:')}</span>
                        <div className="inline-flex rounded-lg bg-muted p-0.5">
                            {[0, 3, 4, 5].map(r => (
                                <button key={r} onClick={() => setMinRating(r)}
                                    className={cn('px-3 py-1.5 text-xs font-medium rounded-md transition-colors inline-flex items-center gap-1',
                                        minRating === r ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
                                    {r === 0 ? t('storiesPage.all', 'All') : <>{r}+ <Star className="h-3 w-3 fill-gold text-gold" /></>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-12"><div className="spinner-lg" /></div>
                    ) : filtered.length === 0 ? (
                        <Card className="text-center"><CardContent className="pt-12 pb-12 flex flex-col items-center">
                            <div className="grid place-items-center h-14 w-14 rounded-full bg-muted text-muted-foreground mb-3"><Frown className="h-6 w-6" /></div>
                            <h3 className="font-bold text-foreground mb-1">{t('storiesPage.noStoriesFound', 'No stories found')}</h3>
                            <p className="text-muted-foreground text-sm">{t('storiesPage.noStoriesDesc', 'No success stories match your filter.')}</p>
                        </CardContent></Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtered.map((story, i) => (
                                <Reveal key={story._id} delay={(i % 3) * 0.08}>
                                    <Card className="overflow-hidden card-lift hover:border-primary/30 cursor-pointer h-full" onClick={() => setSelectedStory(story)}>
                                        <div className="relative h-48 overflow-hidden">
                                            {story.coupleImage ? (
                                                <img src={story.coupleImage} alt="Couple" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                                            ) : (
                                                <div className="grid place-items-center h-full w-full bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-950 dark:to-slate-900"><Heart className="h-10 w-10 text-emerald-300/60" /></div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                            <div className="absolute bottom-3 left-3 flex gap-0.5">{renderStars(story.reviewStar)}</div>
                                        </div>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(story.marriageDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'long' })}
                                            </div>
                                            <p className="text-muted-foreground text-sm italic line-clamp-3">“{story.successStoryText}”</p>
                                        </CardContent>
                                    </Card>
                                </Reveal>
                            ))}
                        </div>
                    )}

                    {/* Detail dialog */}
                    <Dialog open={!!selectedStory} onOpenChange={(o) => !o && setSelectedStory(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2"><Heart className="h-4 w-4 text-rose-500" /> {t('storiesPage.detailTitle', 'Success Story')}</DialogTitle>
                            </DialogHeader>
                            {selectedStory && (
                                <div>
                                    {selectedStory.coupleImage && (
                                        <img src={selectedStory.coupleImage} alt="Couple" className="w-full h-48 object-cover rounded-xl mb-4" />
                                    )}
                                    <div className="flex items-center gap-2 mb-3">{renderStars(selectedStory.reviewStar, 'h-4 w-4')}</div>
                                    <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {t('storiesPage.married', 'Married')} {new Date(selectedStory.marriageDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <div className="rounded-xl border bg-muted/30 p-4">
                                        <Quote className="h-4 w-4 text-primary/40 mb-2" />
                                        <p className="text-foreground leading-relaxed italic text-sm">“{selectedStory.successStoryText}”</p>
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </>
    );
};

export default Stories;
