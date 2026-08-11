import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Loader2, Copy, Check, Trash2, Mail } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { guardianAPI } from '../../../api/api';
import PageHeader from '../../../components/dashboard/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

const RELATIONS = ['Father', 'Mother', 'Brother', 'Uncle', 'Grandfather', 'Son', 'Other'];

const GuardianWards = () => {
    const qc = useQueryClient();
    const [email, setEmail] = useState('');
    const [relation, setRelation] = useState('');
    const [copied, setCopied] = useState({});

    const { data: wards = [], isLoading } = useQuery({
        queryKey: ['guardianWards'],
        queryFn: async () => { const r = await guardianAPI.getMyWards(); return r.data; }
    });

    const inviteMut = useMutation({
        mutationFn: (data) => guardianAPI.inviteWard(data),
        onSuccess: (r) => {
            qc.invalidateQueries(['guardianWards']);
            toast.success('Invitation created — copy the magic link and send it to your ward.');
            setEmail(''); setRelation('');
        },
        onError: (e) => toast.error(e.response?.data?.message || 'Failed')
    });

    const revokeMut = useMutation({
        mutationFn: (id) => guardianAPI.revokeWard(id),
        onSuccess: () => { qc.invalidateQueries(['guardianWards']); toast.success('Link revoked'); }
    });

    const copyLink = async (id, token) => {
        const link = `${window.location.origin}/guardian/link/${token}`;
        try { await navigator.clipboard.writeText(link); setCopied(p => ({ ...p, [id]: true })); toast.success('Link copied — send to your ward'); setTimeout(() => setCopied(p => ({ ...p, [id]: false })), 2000); }
        catch { toast.error('Copy failed'); }
    };

    const submit = (e) => { e.preventDefault(); if (!email) { toast.error('Enter ward email'); return; } inviteMut.mutate({ wardEmail: email, relation }); };

    return (
        <>
            <Helmet><title>My Wards - Guardian</title></Helmet>
            <div className="space-y-6">
                <PageHeader title="My Wards" description="Invite and manage the profiles you represent" icon={Users} />

                <Card>
                    <CardContent className="p-6">
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                                <div className="space-y-1.5 md:col-span-2">
                                    <Label>Ward's email</Label>
                                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ward@example.com" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Your relation</Label>
                                    <Select value={relation} onValueChange={setRelation}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{RELATIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select>
                                </div>
                            </div>
                            <Button type="submit" disabled={inviteMut.isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                                {inviteMut.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />} Invite ward
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h3 className="font-heading font-bold text-foreground mb-3">Links</h3>
                        {isLoading ? <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                            : wards.length === 0 ? <p className="text-sm text-muted-foreground">No invitations yet.</p>
                            : (
                                <div className="space-y-2">
                                    {wards.map(w => (
                                        <div key={w._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3">
                                            <div>
                                                <p className="font-semibold text-foreground text-sm">{w.wardName || w.wardEmail} {w.relation && <Badge variant="outline" className="ml-1 text-[10px]">{w.relation}</Badge>}</p>
                                                <p className="text-xs text-muted-foreground tabular-nums">{w.wardBiodataId ? `#${w.wardBiodataId}` : 'biodata not yet created'}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className={w.status === 'approved' ? 'border-emerald-500/40 text-emerald-600' : w.status === 'pending' ? 'border-amber-500/40 text-amber-600' : 'text-muted-foreground'}>{w.status}</Badge>
                                                {w.status === 'pending' && w.inviteToken && (
                                                    <Button size="sm" variant="outline" onClick={() => copyLink(w._id, w.inviteToken)}>
                                                        {copied[w._id] ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />} Copy link
                                                    </Button>
                                                )}
                                                <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => revokeMut.mutate(w._id)}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
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

export default GuardianWards;
