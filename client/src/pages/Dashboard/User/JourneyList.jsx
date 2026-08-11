import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { HeartHandshake, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { journeyAPI } from '../../../api/api';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const STAGE_LABELS = ['Connected', 'Supervised Intro', 'Counseling', 'Mahr Agreed', 'Kazi Booked', 'Nikah Registered'];
const stagePct = (stage) => ((STAGE_LABELS.findIndex(l => l.toLowerCase().replace(/ /g, '_') === stage) + 1) / 6) * 100;

const JourneyList = () => {
    const { data: journeys = [], isLoading } = useQuery({
        queryKey: ['myJourneys'],
        queryFn: async () => { const r = await journeyAPI.getMine(); return r.data; }
    });

    return (
        <>
            <Helmet><title>Marriage Journeys - Nikah</title></Helmet>
            <div className="space-y-6">
                <PageHeader title="Marriage Journeys" description="Your end-to-end path from match to nikah" icon={HeartHandshake} />

                {isLoading ? (
                    <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : journeys.length === 0 ? (
                    <EmptyState icon={HeartHandshake} title="No journeys yet" description="When a contact request you sent (or received) is approved, a marriage journey starts automatically and appears here." />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {journeys.map((j) => {
                            const idx = STAGE_LABELS.findIndex(l => l.toLowerCase().replace(/ /g, '_') === j.currentStage);
                            const completed = j.currentStage === 'nikah_registered';
                            return (
                                <Card key={j._id} className="card-lift hover:border-emerald-500/40">
                                    <CardContent className="p-5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="grid place-items-center h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600"><HeartHandshake className="h-5 w-5" /></span>
                                                <div>
                                                    <p className="font-semibold text-foreground text-sm">Biodata #{j.biodataA} ↔ #{j.biodataB}</p>
                                                    <p className="text-xs text-muted-foreground">Started {new Date(j.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            {completed
                                                ? <Badge className="bg-emerald-600 text-white gap-1"><CheckCircle2 className="h-3 w-3" /> Nikah</Badge>
                                                : <Badge variant="outline">{STAGE_LABELS[idx] || j.currentStage}</Badge>}
                                        </div>
                                        <Progress value={stagePct(j.currentStage)} className="h-1.5" indicatorClassName="bg-emerald-500" />
                                        <Button asChild size="sm" variant="outline" className="w-full border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10">
                                            <Link to={`/dashboard/journey/${j._id}`}>Open journey <ArrowRight className="h-4 w-4" /></Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

export default JourneyList;
