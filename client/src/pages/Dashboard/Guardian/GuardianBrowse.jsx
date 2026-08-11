import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { Eye, Heart, Loader2, Scale, Check, X, ChevronDown } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { guardianAPI } from '../../../api/api';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import TazkiyaBadge from '../../../components/shared/TazkiyaBadge';
import toast from 'react-hot-toast';

const GuardianBrowse = () => {
    const [params, setParams] = useSearchParams();
    const wardId = Number(params.get('ward'));
    const qc = useQueryClient();

    const { data: wards = [] } = useQuery({ queryKey: ['guardianWards'], queryFn: async () => { const r = await guardianAPI.getMyWards(); return r.data; } });
    const approved = wards.filter(w => w.status === 'approved' && w.wardBiodataId);

    const { data, isLoading } = useQuery({
        queryKey: ['guardianBrowse', wardId],
        queryFn: async () => { const r = await guardianAPI.browseWard(wardId); return r.data; },
        enabled: !!wardId
    });

    const shortlistMut = useMutation({
        mutationFn: ({ biodataId, tag }) => guardianAPI.addShortlist({ wardBiodataId: wardId, biodataId, tag }),
        onSuccess: () => { qc.invalidateQueries(['guardianShortlist', wardId]); },
        onError: (e) => toast.error(e.response?.data?.message || 'Failed')
    });

    const { data: shortlist = [] } = useQuery({
        queryKey: ['guardianShortlist', wardId],
        queryFn: async () => { const r = await guardianAPI.getShortlist(wardId); return r.data; },
        enabled: !!wardId
    });
    const shortlistedIds = shortlist.map(s => s.biodataId);

    return (
        <>
            <Helmet><title>Browse for Ward - Guardian</title></Helmet>
            <div className="space-y-6">
                <PageHeader title="Browse for Ward" description="Find compatible matches on behalf of your ward" icon={Eye} />

                <Card>
                    <CardContent className="p-4 flex flex-wrap items-center gap-3">
                        <span className="text-sm text-muted-foreground">Ward:</span>
                        <div className="relative">
                            <select
                                value={wardId || ''}
                                onChange={(e) => setParams(e.target.value ? { ward: e.target.value } : {})}
                                className="appearance-none rounded-lg border border-border bg-background pl-3 pr-9 py-2 text-sm font-medium text-foreground"
                            >
                                <option value="">Select a ward…</option>
                                {approved.map(w => <option key={w._id} value={w.wardBiodataId}>{w.wardName} (#{w.wardBiodataId})</option>)}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                        {approved.length === 0 && <p className="text-xs text-muted-foreground">No approved wards. <Link to="/dashboard/guardian/wards" className="underline">Invite one</Link>.</p>}
                    </CardContent>
                </Card>

                {!wardId ? (
                    <EmptyState icon={Eye} title="Select a ward to begin" description="Choose one of your approved wards to see their compatibility matches." />
                ) : isLoading ? (
                    <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {(data?.results || []).map((m) => {
                            const isShortlisted = shortlistedIds.includes(m.biodataId);
                            return (
                                <Card key={m.biodataId} className="card-lift">
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-12 w-12">{m.profileImage ? <AvatarImage src={m.profileImage} /> : null}<AvatarFallback className="bg-emerald-500/10 text-emerald-600">{m.name?.charAt(0)}</AvatarFallback></Avatar>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-foreground truncate">{m.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{m.age} yrs · {m.permanentDivision}</p>
                                                <TazkiyaBadge tier={m.tazkiyaTier} score={m.trustScore} className="mt-0.5" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Scale className="h-4 w-4 text-emerald-600" />
                                            <span className="text-sm font-bold text-foreground">{m.compatibilityScore}%</span>
                                            <span className="text-xs text-muted-foreground">compatibility for {data.ward.name}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            {[['Age', m.matchDetails?.ageMatch], ['Deen', m.matchDetails?.deenMatch], ['Division', m.matchDetails?.divisionMatch]].map(([l, ok]) => (
                                                <span key={l} className={cn('inline-flex items-center gap-1', ok ? 'text-emerald-600' : 'text-muted-foreground')}>{ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}{l}</span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button asChild size="sm" variant="outline" className="flex-1"><Link to={`/biodata/${m.biodataId}`}>View</Link></Button>
                                            <Button size="sm" variant={isShortlisted ? 'secondary' : 'default'} onClick={() => shortlistMut.mutate({ biodataId: m.biodataId, tag: 'shortlisted' })} disabled={shortlistMut.isLoading}>
                                                <Heart className={cn('h-4 w-4', isShortlisted && 'fill-current')} /> {isShortlisted ? 'Saved' : 'Shortlist'}
                                            </Button>
                                        </div>
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

export default GuardianBrowse;
