import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Loader2, CheckCircle2, Award, Printer, LinkIcon } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../../contexts/LanguageContext';
import { courseAPI, journeyAPI } from '../../../api/api';
import { premaritalCourse } from '../../../data/premaritalCourse';
import PageHeader from '../../../components/dashboard/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const PremaritalCourse = () => {
    const { t } = useLanguage();
    const qc = useQueryClient();
    const [answers, setAnswers] = useState({}); // module index -> selected option index

    const { data: enroll, isLoading } = useQuery({
        queryKey: ['courseProgress'],
        queryFn: async () => { const r = await courseAPI.getProgress(); return r.data; }
    });

    // Link this course to a marriage journey so the readiness badge reflects there
    const { data: journeys = [] } = useQuery({
        queryKey: ['myJourneys'],
        queryFn: async () => { const r = await journeyAPI.getMine(); return r.data; }
    });
    const [pickedJourney, setPickedJourney] = useState('');
    const linkMut = useMutation({
        mutationFn: (jid) => courseAPI.linkJourney(jid),
        onSuccess: () => { qc.invalidateQueries(['courseProgress']); toast.success('Course linked to your journey'); },
        onError: (e) => toast.error(e.response?.data?.message || 'Failed')
    });

    const completeMut = useMutation({
        mutationFn: (n) => courseAPI.completeModule(n),
        onSuccess: () => qc.invalidateQueries(['courseProgress']),
        onError: (e) => toast.error(e.response?.data?.message || 'Failed')
    });

    const isDone = (i) => enroll?.completedModules?.includes(i);
    const completed = enroll?.status === 'completed';

    const submit = (i) => {
        if (answers[i] === undefined) { toast.error('Select an answer'); return; }
        if (answers[i] !== premaritalCourse[i].answer) { toast.error('Not quite — re-read and try again'); return; }
        completeMut.mutate(i);
    };

    return (
        <>
            <Helmet><title>Premarital Course - Nikah</title></Helmet>
            <div className="space-y-6">
                <PageHeader title={t('fp.course.title')} description={t('fp.course.desc')} icon={BookOpen} />

                {isLoading ? (
                    <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : (
                    <>
                        <Card>
                            <CardContent className="p-5 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{t('fp.course.progress')}</p>
                                    <p className="text-xs text-muted-foreground">{enroll?.completedModules?.length || 0} / {premaritalCourse.length} modules</p>
                                </div>
                                {completed
                                    ? <Badge className="bg-emerald-600 text-white gap-1"><Award className="h-3.5 w-3.5" /> Certificate earned</Badge>
                                    : <Badge variant="outline">{enroll?.progress || 0}%</Badge>}
                            </CardContent>
                        </Card>

                        {completed && (
                            <Card className="border-emerald-500/30 bg-emerald-500/[0.04]">
                                <CardContent className="p-8 text-center">
                                    <Award className="h-14 w-14 text-emerald-600 mx-auto mb-3" />
                                    <h2 className="font-heading text-xl font-bold text-foreground mb-1">Marriage-Readiness Certificate</h2>
                                    <p className="text-sm text-muted-foreground mb-4">You completed all modules. This badge appears on your journey.</p>
                                    <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" /> {t('fp.course.printCert')}</Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Link course to a marriage journey so the readiness badge reflects there */}
                        {journeys.length > 0 && (
                            <Card>
                                <CardContent className="p-5 flex flex-wrap items-end gap-3">
                                    <div className="flex-1 min-w-[200px] space-y-1.5">
                                        <label className="text-xs font-medium text-muted-foreground">Link this course to a marriage journey</label>
                                        <select value={pickedJourney} onChange={(e) => setPickedJourney(e.target.value)}
                                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                                            <option value="">{enroll?.journeyId ? 'Linked ✓ (change)' : 'Select a journey…'}</option>
                                            {journeys.map(j => <option key={j._id} value={j._id}>#{j.biodataA} ↔ #{j.biodataB}</option>)}
                                        </select>
                                    </div>
                                    <Button onClick={() => pickedJourney && linkMut.mutate(pickedJourney)} disabled={!pickedJourney || linkMut.isLoading}>
                                        {linkMut.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LinkIcon className="h-4 w-4" />} Link journey
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {premaritalCourse.map((mod, i) => {
                            const done = isDone(i);
                            return (
                                <Card key={i} className={cn(done && 'border-emerald-500/30')}>
                                    <CardContent className="p-5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-heading font-bold text-foreground flex items-center gap-2">
                                                <span className={cn('grid place-items-center h-7 w-7 rounded-full text-xs font-bold', done ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground')}>{i + 1}</span>
                                                {mod.title}
                                            </h3>
                                            {done && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{mod.reading}</p>
                                        {!done && (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-foreground">{mod.question}</p>
                                                {mod.options.map((opt, oi) => (
                                                    <label key={oi} className={cn('flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors',
                                                        answers[i] === oi ? 'border-emerald-500 bg-emerald-500/5' : 'border-border hover:bg-accent')}>
                                                        <input type="radio" name={`mod-${i}`} checked={answers[i] === oi} onChange={() => setAnswers(p => ({ ...p, [i]: oi }))} className="accent-emerald-600" />
                                                        <span className="text-sm text-foreground">{opt}</span>
                                                    </label>
                                                ))}
                                                <Button size="sm" onClick={() => submit(i)} disabled={completeMut.isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                                                    {completeMut.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} {t('fp.course.completeModule')}
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </>
                )}
            </div>
        </>
    );
};

export default PremaritalCourse;
