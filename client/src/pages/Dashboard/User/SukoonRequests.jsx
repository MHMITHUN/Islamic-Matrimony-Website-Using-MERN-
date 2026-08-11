import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Leaf, Check, X, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { sukoonAPI } from '../../../api/api';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

const SukoonRequests = () => {
    const qc = useQueryClient();
    const { data: requests = [], isLoading } = useQuery({
        queryKey: ['sukoonRevealRequests'],
        queryFn: async () => { const r = await sukoonAPI.getRevealRequests(); return r.data; }
    });

    const decideMut = useMutation({
        mutationFn: ({ id, decision }) => sukoonAPI.decideReveal(id, { decision }),
        onSuccess: () => { qc.invalidateQueries(['sukoonRevealRequests']); toast.success('Decision recorded'); },
        onError: (e) => toast.error(e.response?.data?.message || 'Failed')
    });

    return (
        <>
            <Helmet><title>Sukoon Reveal Requests - Nikah</title></Helmet>
            <div className="space-y-6">
                <PageHeader title="Sukoon Reveal Requests" description="Members asking to see your identity" icon={Leaf} />
                {isLoading ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                    : requests.length === 0 ? <EmptyState icon={Leaf} title="No requests" description="When someone requests to reveal your Sukoon identity, it appears here." />
                        : (
                            <div className="space-y-3">
                                {requests.map(r => (
                                    <Card key={r._id}><CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-foreground text-sm">Biodata #{r.requesterBiodataId} {r.message && <span className="text-xs text-muted-foreground font-normal">— “{r.message}”</span>}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={r.status === 'approved' ? 'border-emerald-500/40 text-emerald-600' : r.status === 'rejected' ? 'border-rose-500/40 text-rose-600' : 'border-amber-500/40 text-amber-600'}>{r.status}</Badge>
                                            {r.status === 'pending' && (
                                                <>
                                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => decideMut.mutate({ id: r._id, decision: 'approved' })}><Check className="h-4 w-4" /> Reveal</Button>
                                                    <Button size="sm" variant="outline" className="text-rose-600 border-rose-500/40 hover:bg-rose-500/10" onClick={() => decideMut.mutate({ id: r._id, decision: 'rejected' })}><X className="h-4 w-4" /></Button>
                                                </>
                                            )}
                                            <Button asChild size="sm" variant="ghost"><Link to={`/biodata/${r.requesterBiodataId}`}>View</Link></Button>
                                        </div>
                                    </CardContent></Card>
                                ))}
                            </div>
                        )}
            </div>
        </>
    );
};

export default SukoonRequests;
