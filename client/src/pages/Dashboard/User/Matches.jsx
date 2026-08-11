import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Scale, Check, X, MapPin, Briefcase, ArrowRight, Loader2, Moon } from 'lucide-react';
import { FaMale, FaFemale } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { matchAPI } from '../../../api/api';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const Matches = () => {
    const { data: matches = [], isLoading } = useQuery({
        queryKey: ['matches'],
        queryFn: async () => { const res = await matchAPI.getMatches(); return res.data; },
    });

    const scoreColor = (score) => {
        if (score >= 75) return 'text-emerald-600';
        if (score >= 50) return 'text-amber-600';
        return 'text-rose-600';
    };
    const scoreBar = (score) => {
        if (score >= 75) return 'bg-emerald-500';
        if (score >= 50) return 'bg-amber-500';
        return 'bg-rose-500';
    };

    return (
        <>
            <Helmet><title>Matches - Nikah Matrimony</title></Helmet>
            <div className="space-y-6">
                <PageHeader title="Compatibility Matches" description="Profiles matched based on your preferences" icon={Scale} />

                {isLoading ? (
                    <div className="flex justify-center py-12"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
                ) : matches.length === 0 ? (
                    <EmptyState icon={Scale} title="No matches found" description="Create your biodata to see compatibility matches."
                        action={<Button asChild><Link to="/dashboard/edit-biodata">Create Biodata <ArrowRight className="h-4 w-4" /></Link></Button>} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {matches.map((match) => {
                            const isMale = match.biodataType === 'Male';
                            return (
                                <Card key={match.biodataId} className="overflow-hidden card-lift hover:border-primary/30">
                                    <div className="relative h-40 overflow-hidden">
                                        {match.profileImage
                                            ? <img src={match.profileImage} alt={match.name} className="h-full w-full object-cover" />
                                            : <div className="grid place-items-center h-full w-full bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-950 dark:to-slate-900"><Scale className="h-10 w-10 text-emerald-300/60" /></div>}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute top-3 left-3">
                                            <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold backdrop-blur', isMale ? 'bg-sky-500/85 text-white' : 'bg-rose-500/85 text-white')}>
                                                {isMale ? <FaMale /> : <FaFemale />} {match.biodataType}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                                            <div className="text-white">
                                                <p className="text-[10px] text-white/70 tabular-nums">#{match.biodataId}</p>
                                                <h3 className="font-semibold text-base truncate">{match.name}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                                            <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3 text-primary" />{match.occupation}</span>
                                            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3 text-primary" />{match.permanentDivision}</span>
                                        </div>

                                        <div className="mb-3">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Compatibility</span>
                                                <span className={cn('text-sm font-bold', scoreColor(match.compatibilityScore))}>{match.compatibilityScore}%</span>
                                            </div>
                                            <Progress value={match.compatibilityScore} className="h-1.5" indicatorClassName={scoreBar(match.compatibilityScore)} />
                                        </div>

                                        <div className="grid grid-cols-2 gap-1.5 mb-3">
                                            {[
                                                { label: 'Age', match: match.matchDetails?.ageMatch },
                                                { label: 'Height', match: match.matchDetails?.heightMatch },
                                                { label: 'Division', match: match.matchDetails?.divisionMatch },
                                                { label: 'Occupation', match: match.matchDetails?.occupationMatch },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center gap-1.5 text-xs">
                                                    {item.match ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-muted-foreground/40" />}
                                                    <span className={item.match ? 'text-foreground' : 'text-muted-foreground'}>{item.label}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className={cn('flex items-center gap-1.5 text-xs rounded-lg px-2.5 py-1.5 mb-4 border', match.matchDetails?.deenMatch ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-border bg-muted/30')}>
                                            {match.matchDetails?.deenMatch
                                                ? <Moon className="h-3.5 w-3.5 text-emerald-600" />
                                                : <X className="h-3 w-3 text-muted-foreground/40" />}
                                            <span className={cn('font-semibold', match.matchDetails?.deenMatch ? 'text-emerald-700 dark:text-emerald-400' : 'text-muted-foreground')}>
                                                Deen {match.matchDetails?.deenMatch ? 'Match' : '—'}
                                            </span>
                                        </div>

                                        <Button asChild size="sm" className="w-full"><Link to={`/biodata/${match.biodataId}`}>View Profile <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
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

export default Matches;
