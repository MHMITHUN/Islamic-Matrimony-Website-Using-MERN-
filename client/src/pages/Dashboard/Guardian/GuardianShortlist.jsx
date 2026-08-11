import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { Heart, Loader2, Trash2, ChevronDown } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { guardianAPI } from '../../../api/api';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import toast from 'react-hot-toast';

const useWardParam = () => {
    const [params, setParams] = useSearchParams();
    const wardId = Number(params.get('ward'));
    return { wardId, setParams };
};

const WardSelect = ({ wards, wardId, setParams }) => (
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
);

const GuardianShortlist = () => {
    const qc = useQueryClient();
    const { wardId, setParams } = useWardParam();
    const { data: wards = [] } = useQuery({ queryKey: ['guardianWards'], queryFn: async () => { const r = await guardianAPI.getMyWards(); return r.data; } });
    const { data: items = [], isLoading } = useQuery({
        queryKey: ['guardianShortlist', wardId],
        queryFn: async () => { const r = await guardianAPI.getShortlist(wardId); return r.data; },
        enabled: !!wardId
    });
    const removeMut = useMutation({
        mutationFn: (id) => guardianAPI.removeShortlist(id),
        onSuccess: () => { qc.invalidateQueries(['guardianShortlist', wardId]); toast.success('Removed'); }
    });

    return (
        <>
            <Helmet><title>Shortlist - Guardian</title></Helmet>
            <div className="space-y-6">
                <PageHeader title="Shortlist" description="Profiles you've saved on behalf of your ward" icon={Heart} />
                <WardSelect wards={wards} wardId={wardId} setParams={setParams} />
                {!wardId ? <EmptyState icon={Heart} title="Select a ward" description="Pick a ward to view their shortlist." />
                    : isLoading ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                        : items.length === 0 ? <EmptyState icon={Heart} title="Nothing shortlisted yet" description="Browse matches for this ward and save the promising ones." />
                            : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {items.map(it => (
                                        <Card key={it._id}>
                                            <CardContent className="p-4 flex items-center gap-3">
                                                <Avatar className="h-11 w-11">{it.biodata?.profileImage ? <AvatarImage src={it.biodata.profileImage} /> : null}<AvatarFallback className="bg-emerald-500/10 text-emerald-600">{it.biodata?.name?.charAt(0)}</AvatarFallback></Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-foreground text-sm truncate">{it.biodata?.name || `#${it.biodataId}`}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{it.biodata?.age} yrs · {it.biodata?.permanentDivision}</p>
                                                    {it.note && <p className="text-xs text-muted-foreground italic truncate">“{it.note}”</p>}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <Button asChild size="sm" variant="outline"><Link to={`/biodata/${it.biodataId}`}>View</Link></Button>
                                                    <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => removeMut.mutate(it._id)}><Trash2 className="h-4 w-4" /></Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
            </div>
        </>
    );
};

export default GuardianShortlist;
