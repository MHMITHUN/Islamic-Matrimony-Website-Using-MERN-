import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HeartHandshake, Eye, Star, Calendar, Quote, Loader2, Heart } from 'lucide-react';
import { FaMale, FaFemale } from 'react-icons/fa';
import { adminAPI } from '../../../api/api';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const renderStars = (rating) => [...Array(5)].map((_, i) => <Star key={i} className={cn('h-3.5 w-3.5', i < rating ? 'fill-gold text-gold' : 'text-muted-foreground/30')} />);

const AdminSuccessStories = () => {
    const [selectedStory, setSelectedStory] = useState(null);

    const { data: stories = [], isLoading } = useQuery({
        queryKey: ['adminSuccessStories'],
        queryFn: async () => { const response = await adminAPI.getSuccessStories(); return response.data; },
    });

    if (isLoading) return <div className="flex flex-col items-center justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /><p className="mt-3 text-muted-foreground text-sm">Loading stories...</p></div>;

    return (
        <div className="space-y-6">
            <PageHeader title="Marriage Success Stories" description="View all submitted success stories." icon={HeartHandshake} />

            {stories.length === 0 ? (
                <EmptyState icon={HeartHandshake} title="No Success Stories" description="No success stories have been submitted yet." />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {stories.map((story) => (
                        <Card key={story._id} className="overflow-hidden card-lift hover:border-primary/30">
                            <div className="relative h-44 overflow-hidden">
                                {story.coupleImage
                                    ? <img src={story.coupleImage} alt="Couple" className="h-full w-full object-cover" />
                                    : <div className="grid place-items-center h-full w-full bg-gradient-to-br from-rose-100 to-pink-50 dark:from-rose-950 dark:to-slate-900"><HeartHandshake className="h-10 w-10 text-rose-300/60" /></div>}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                                <div className="absolute bottom-3 left-3 flex gap-1">{renderStars(story.reviewStar)}</div>
                                <Badge className="absolute top-3 right-3 gap-1 bg-rose-500/90 border-transparent text-white backdrop-blur"><HeartHandshake className="h-3 w-3" /> Success</Badge>
                            </div>
                            <CardContent className="p-5">
                                <div className="flex items-center gap-2 mb-3 flex-wrap">
                                    <Badge variant="soft" className="gap-1 tabular-nums"><FaMale className="text-sky-500" /> #{story.maleBiodataId || story.selfBiodataId}</Badge>
                                    <Heart className="h-3 w-3 text-rose-400 fill-rose-400" />
                                    <Badge variant="soft" className="gap-1 tabular-nums"><FaFemale className="text-rose-500" /> #{story.femaleBiodataId || story.partnerBiodataId}</Badge>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                                    <Calendar className="h-3.5 w-3.5 text-primary" />
                                    {new Date(story.marriageDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                                <Button onClick={() => setSelectedStory(story)} className="w-full"><Eye className="h-4 w-4" /> View Story</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={!!selectedStory} onOpenChange={(o) => !o && setSelectedStory(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><HeartHandshake className="h-5 w-5 text-rose-500" /> Success Story</DialogTitle>
                    </DialogHeader>
                    {selectedStory && (
                        <div>
                            {selectedStory.coupleImage && <img src={selectedStory.coupleImage} alt="Couple" className="w-full h-52 object-cover rounded-xl mb-4" />}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="rounded-xl border bg-sky-500/5 p-3"><p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Male</p><p className="font-bold text-sky-600 tabular-nums">#{selectedStory.maleBiodataId || selectedStory.selfBiodataId}</p></div>
                                <div className="rounded-xl border bg-rose-500/5 p-3"><p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Female</p><p className="font-bold text-rose-600 tabular-nums">#{selectedStory.femaleBiodataId || selectedStory.partnerBiodataId}</p></div>
                            </div>
                            <div className="flex items-center justify-between rounded-xl border bg-muted/30 p-3 mb-4">
                                <div className="flex items-center gap-1.5 text-sm"><Calendar className="h-4 w-4 text-primary" />{new Date(selectedStory.marriageDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                <div className="flex gap-0.5">{renderStars(selectedStory.reviewStar)}</div>
                            </div>
                            <div className="rounded-xl border bg-gold/[0.05] p-4">
                                <Quote className="h-4 w-4 text-gold/60 mb-2" />
                                <p className="text-foreground leading-relaxed italic text-sm">“{selectedStory.successStoryText}”</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminSuccessStories;
