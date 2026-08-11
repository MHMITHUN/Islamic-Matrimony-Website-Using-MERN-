import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, Heart, Mail, MessageSquare, ShieldCheck, ArrowRight, UserPlus } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../../contexts/AuthContext';
import { guardianAPI } from '../../../api/api';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const GuardianOverview = () => {
    const { user } = useAuth();
    const { data: wards = [] } = useQuery({
        queryKey: ['guardianWards'],
        queryFn: async () => { const r = await guardianAPI.getMyWards(); return r.data; }
    });
    const approved = wards.filter(w => w.status === 'approved' && w.wardBiodataId);

    // Real counts: family threads + total shortlisted across all wards
    const { data: threads = [] } = useQuery({
        queryKey: ['familyThreads'],
        queryFn: async () => { const r = await guardianAPI.getFamilyThreads(); return r.data; },
        enabled: approved.length > 0
    });
    const shortlistCount = useQuery({
        queryKey: ['guardianShortlistTotals', approved.map(w => w.wardBiodataId)],
        queryFn: async () => {
            const results = await Promise.all(approved.map(w => guardianAPI.getShortlist(w.wardBiodataId).then(r => r.data.length).catch(() => 0)));
            return results.reduce((a, b) => a + b, 0);
        },
        enabled: approved.length > 0
    }).data ?? 0;

    return (
        <>
            <Helmet><title>Guardian Dashboard - Nikah</title></Helmet>
            <div className="space-y-6">
                <PageHeader title="Guardian Dashboard" description="Help your ward find a righteous spouse" icon={Users}>
                    <Button asChild><Link to="/dashboard/guardian/wards"><UserPlus className="h-4 w-4" /> Invite ward</Link></Button>
                </PageHeader>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-emerald-600 mb-1"><Users className="h-4 w-4" /><span className="text-xs text-muted-foreground">Approved wards</span></div><p className="text-2xl font-bold text-foreground">{approved.length}</p></CardContent></Card>
                    <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-amber-600 mb-1"><Mail className="h-4 w-4" /><span className="text-xs text-muted-foreground">Pending invites</span></div><p className="text-2xl font-bold text-foreground">{wards.filter(w => w.status === 'pending').length}</p></CardContent></Card>
                    <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-rose-500 mb-1"><Heart className="h-4 w-4" /><span className="text-xs text-muted-foreground">Shortlisted</span></div><p className="text-2xl font-bold text-foreground">{shortlistCount}</p></CardContent></Card>
                    <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-sky-500 mb-1"><MessageSquare className="h-4 w-4" /><span className="text-xs text-muted-foreground">Family chats</span></div><p className="text-2xl font-bold text-foreground">{threads.length}</p></CardContent></Card>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <h3 className="font-heading font-bold text-foreground mb-3">Your wards</h3>
                        {approved.length === 0 ? (
                            <EmptyState icon={Users} title="No approved wards yet" description="Invite your son/daughter by email — they approve the link, then you can browse on their behalf."
                                action={<Button asChild><Link to="/dashboard/guardian/wards"><UserPlus className="h-4 w-4" /> Invite a ward</Link></Button>} />
                        ) : (
                            <div className="space-y-2">
                                {approved.map(w => (
                                    <div key={w._id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                                        <div className="flex items-center gap-3">
                                            <span className="grid place-items-center h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600"><ShieldCheck className="h-5 w-5" /></span>
                                            <div>
                                                <p className="font-semibold text-foreground text-sm">{w.wardName} {w.relation && <Badge variant="outline" className="ml-1 text-[10px]">{w.relation}</Badge>}</p>
                                                <p className="text-xs text-muted-foreground tabular-nums">#{w.wardBiodataId || 'pending'}</p>
                                            </div>
                                        </div>
                                        <Button asChild size="sm" variant="outline"><Link to={`/dashboard/guardian/browse?ward=${w.wardBiodataId}`}>Browse <ArrowRight className="h-4 w-4" /></Link></Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default GuardianOverview;
