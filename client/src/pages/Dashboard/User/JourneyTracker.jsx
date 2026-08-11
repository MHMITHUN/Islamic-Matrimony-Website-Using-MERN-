import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    CheckCircle2, MessageSquare, HeartHandshake, Gift, BookOpen, Award,
    ArrowLeft, Loader2, ChevronRight, Printer
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { journeyAPI } from '../../../api/api';
import PageHeader from '../../../components/dashboard/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import BookingWidget from '../../../components/journey/BookingWidget';
import MahrWidget from '../../../components/journey/MahrWidget';

const STAGES = [
    { key: 'connected', label: 'Connected', icon: CheckCircle2 },
    { key: 'supervised_intro', label: 'Supervised Intro', icon: MessageSquare },
    { key: 'counseling', label: 'Counseling', icon: HeartHandshake },
    { key: 'mahr_agreed', label: 'Mahr Agreed', icon: Gift },
    { key: 'kazi_booked', label: 'Kazi Booked', icon: BookOpen },
    { key: 'nikah_registered', label: 'Nikah', icon: Award }
];

const JourneyTracker = () => {
    const { id } = useParams();
    const qc = useQueryClient();

    const { data: journey, isLoading } = useQuery({
        queryKey: ['journey', id],
        queryFn: async () => { const r = await journeyAPI.getById(id); return r.data; },
        refetchInterval: 5000
    });

    const advanceMut = useMutation({
        mutationFn: ({ id, stage }) => journeyAPI.advance(id, { stage }),
        onSuccess: () => { qc.invalidateQueries(['journey', id]); toast.success('Stage advanced'); },
        onError: (e) => toast.error(e.response?.data?.message || 'Cannot advance yet')
    });

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
    if (!journey) return <div className="text-center py-20 text-muted-foreground">Journey not found.</div>;

    const currentIndex = STAGES.findIndex(s => s.key === journey.currentStage);
    const completed = journey.currentStage === 'nikah_registered';

    return (
        <>
            <Helmet><title>Marriage Journey - Nikah</title></Helmet>
            <div className="space-y-6">
                <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
                    <Link to="/dashboard/journey"><ArrowLeft className="h-4 w-4" /> All journeys</Link>
                </Button>
                <PageHeader title="Marriage Journey" description={`Biodata #${journey.biodataA} ↔ #${journey.biodataB}`} icon={HeartHandshake} />

                {/* Stepper */}
                <Card>
                    <CardContent className="p-5 md:p-6 overflow-x-auto">
                        <div className="flex items-center gap-1 md:gap-2 min-w-max">
                            {STAGES.map((s, i) => {
                                const done = i < currentIndex || completed;
                                const current = i === currentIndex && !completed;
                                const Icon = s.icon;
                                return (
                                    <div key={s.key} className="flex items-center gap-1 md:gap-2">
                                        <div className="flex flex-col items-center gap-1.5 w-20 md:w-24 text-center">
                                            <span className={cn('grid place-items-center h-10 w-10 rounded-full border-2 transition-colors',
                                                done ? 'bg-emerald-600 border-emerald-600 text-white' : current ? 'border-emerald-600 text-emerald-600 bg-emerald-500/10' : 'border-border text-muted-foreground')}>
                                                <Icon className="h-5 w-5" />
                                            </span>
                                            <span className={cn('text-[10px] md:text-xs font-medium leading-tight', done || current ? 'text-foreground' : 'text-muted-foreground')}>{s.label}</span>
                                        </div>
                                        {i < STAGES.length - 1 && <div className={cn('h-0.5 w-6 md:w-10 rounded', i < currentIndex || completed ? 'bg-emerald-600' : 'bg-border')} />}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Current-stage action */}
                {completed ? (
                    <Card className="border-emerald-500/30">
                        <CardContent className="p-8 text-center">
                            <Award className="h-14 w-14 text-emerald-600 mx-auto mb-3" />
                            <h2 className="font-heading text-xl font-bold text-foreground mb-1">Mabrouk — your nikah journey is complete!</h2>
                            <p className="text-sm text-muted-foreground mb-1">Nikah date: {journey.nikahDate ? new Date(journey.nikahDate).toLocaleDateString() : '—'}</p>
                            <p className="text-sm text-muted-foreground mb-5">May Allah bless your union with barakah.</p>
                            <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print certificate</Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                {(() => { const Icon = STAGES[currentIndex].icon; return <Icon className="h-5 w-5 text-emerald-600" />; })()}
                                <h3 className="font-heading font-bold text-foreground">Current step: {STAGES[currentIndex].label}</h3>
                            </div>

                            {/* Stage-specific content — the work for each stage is done IN that stage */}
                            {journey.currentStage === 'connected' && (
                                <>
                                    <p className="text-sm text-muted-foreground">Your contact request was approved. Begin the supervised intro phase — involve your wali and exchange respectful messages through the platform.</p>
                                    <Button onClick={() => advanceMut.mutate({ id, stage: 'supervised_intro' })} disabled={advanceMut.isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                                        {advanceMut.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4" />} Begin supervised intro
                                    </Button>
                                </>
                            )}
                            {journey.currentStage === 'supervised_intro' && (
                                <>
                                    <p className="text-sm text-muted-foreground">You're in the supervised intro phase. When you're ready, proceed to premarital counseling.</p>
                                    <Button onClick={() => advanceMut.mutate({ id, stage: 'counseling' })} disabled={advanceMut.isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                                        {advanceMut.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4" />} Proceed to counseling
                                    </Button>
                                </>
                            )}
                            {journey.currentStage === 'counseling' && (
                                <>
                                    <p className="text-sm text-muted-foreground">Complete a premarital counseling session, then proceed to the mahr stage.</p>
                                    <BookingWidget journeyId={id} serviceType="counselor" existing={journey.counselingBooking} />
                                    <Button onClick={() => advanceMut.mutate({ id, stage: 'mahr_agreed' })} disabled={advanceMut.isLoading || journey.counselingBooking?.status !== 'completed'} className="bg-emerald-600 hover:bg-emerald-700">
                                        {advanceMut.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4" />} {journey.counselingBooking?.status === 'completed' ? 'Counseling done — proceed to mahr' : 'Complete counseling to proceed'}
                                    </Button>
                                </>
                            )}
                            {journey.currentStage === 'mahr_agreed' && (
                                <>
                                    <p className="text-sm text-muted-foreground">Agree the mahr terms. Both parties must confirm before booking the kazi.</p>
                                    <MahrWidget journeyId={id} agreement={journey.mahr} />
                                    <Button onClick={() => advanceMut.mutate({ id, stage: 'kazi_booked' })} disabled={advanceMut.isLoading || journey.mahr?.status !== 'agreed'} className="bg-emerald-600 hover:bg-emerald-700">
                                        {advanceMut.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4" />} {journey.mahr?.status === 'agreed' ? 'Mahr agreed — proceed to kazi' : 'Both must confirm mahr to proceed'}
                                    </Button>
                                </>
                            )}
                            {journey.currentStage === 'kazi_booked' && (
                                <>
                                    <p className="text-sm text-muted-foreground">Book a kazi (officiant) to conduct and register the nikah.</p>
                                    <BookingWidget journeyId={id} serviceType="kazi" existing={journey.kaziBooking} />
                                    <Button onClick={() => advanceMut.mutate({ id, stage: 'nikah_registered' })} disabled={advanceMut.isLoading || journey.kaziBooking?.status !== 'confirmed'} className="bg-emerald-600 hover:bg-emerald-700">
                                        {advanceMut.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Award className="h-4 w-4" />} {journey.kaziBooking?.status === 'confirmed' ? 'Register the nikah' : 'Confirm kazi booking to register'}
                                    </Button>
                                </>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
};

export default JourneyTracker;
