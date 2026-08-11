import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { Mail, Loader2, ChevronDown, Clock, CheckCircle2, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { guardianAPI } from '../../../api/api';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const GuardianRequests = () => {
    const [params, setParams] = useSearchParams();
    const wardId = Number(params.get('ward'));
    const { data: wards = [] } = useQuery({ queryKey: ['guardianWards'], queryFn: async () => { const r = await guardianAPI.getMyWards(); return r.data; } });
    const { data: requests = [], isLoading } = useQuery({
        queryKey: ['guardianRequests', wardId],
        queryFn: async () => { const r = await guardianAPI.getWardRequests(wardId); return r.data; },
        enabled: !!wardId
    });

    return (
        <>
            <Helmet><title>Requests - Guardian</title></Helmet>
            <div className="space-y-6">
                <PageHeader title="Contact Requests" description="Incoming requests for your ward" icon={Mail} />
                <Card><CardContent className="p-4 flex flex-wrap items-center gap-3">
                    <span className="text-sm text-muted-foreground">Ward:</span>
                    <div className="relative">
                        <select value={wardId || ''} onChange={(e) => setParams(e.target.value ? { ward: e.target.value } : {})}
                            className="appearance-none rounded-lg border border-border bg-background pl-3 pr-9 py-2 text-sm font-medium text-foreground">
                            <option value="">Select a ward…</option>
                            {wards.filter(w => w.status === 'approved' && w.wardBiodataId).map(w => <option key={w._id} value={w.wardBiodataId}>{w.wardName} (#{w.wardBiodataId})</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                </CardContent></Card>

                {!wardId ? <EmptyState icon={Mail} title="Select a ward" description="Pick a ward to view incoming contact requests." />
                    : isLoading ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                        : requests.length === 0 ? <EmptyState icon={Mail} title="No requests" description="When someone requests your ward's contact info, it appears here." />
                            : (
                                <div className="space-y-3">
                                    {requests.map(r => (
                                        <Card key={r._id}><CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <p className="font-semibold text-foreground text-sm">{r.requesterName} <span className="text-xs text-muted-foreground tabular-nums">#{r.requesterBiodataId || r.biodataId}</span></p>
                                                <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className={cn('capitalize', r.status === 'approved' ? 'border-emerald-500/40 text-emerald-600' : r.status === 'rejected' ? 'border-rose-500/40 text-rose-600' : 'border-amber-500/40 text-amber-600')}>
                                                    {r.status === 'approved' ? <CheckCircle2 className="h-3 w-3" /> : r.status === 'wali_pending' ? <Clock className="h-3 w-3" /> : r.status === 'rejected' ? <X className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                                    {r.status.replace('_', ' ')}
                                                </Badge>
                                                <Button asChild size="sm" variant="outline"><Link to={`/biodata/${r.requesterBiodataId || r.biodataId}`}>View</Link></Button>
                                            </div>
                                        </CardContent></Card>
                                    ))}
                                </div>
                            )}
            </div>
        </>
    );
};

export default GuardianRequests;
