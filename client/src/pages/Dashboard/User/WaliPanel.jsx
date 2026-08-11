import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, Loader2, Copy, Check, Clock, RefreshCw, Mail, User as UserIcon, Phone } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { waliAPI } from '../../../api/api';
import { useLanguage } from '../../../contexts/LanguageContext';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import toast from 'react-hot-toast';

const waliRelations = ['Father', 'Brother', 'Uncle', 'Grandfather', 'Son', 'Other'];

const WaliPanel = () => {
    const { t } = useLanguage();
    const queryClient = useQueryClient();
    const [form, setForm] = useState({ waliEnabled: false, waliName: '', waliRelation: '', waliContact: '', waliEmail: '' });
    const [copied, setCopied] = useState({});

    const { data: info, isLoading } = useQuery({
        queryKey: ['waliInfo'],
        queryFn: async () => { const res = await waliAPI.getMyWaliInfo(); return res.data; },
    });

    useEffect(() => {
        if (info) {
            setForm({
                waliEnabled: !!info.waliEnabled,
                waliName: info.waliName || '', waliRelation: info.waliRelation || '',
                waliContact: info.waliContact || '', waliEmail: info.waliEmail || ''
            });
        }
    }, [info]);

    const { data: pending = [], refetch } = useQuery({
        queryKey: ['waliPending'],
        queryFn: async () => { const res = await waliAPI.getPendingForMe(); return res.data; },
        refetchOnMount: 'always', staleTime: 0,
    });

    const saveMutation = useMutation({
        mutationFn: (data) => waliAPI.updateWaliInfo(data),
        onSuccess: () => { queryClient.invalidateQueries(['waliInfo']); toast.success('Wali information saved'); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); },
    });

    const resendMutation = useMutation({
        mutationFn: (id) => waliAPI.resend(id),
        onSuccess: () => { queryClient.invalidateQueries(['waliPending']); toast.success('Magic link regenerated'); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); },
    });

    const handleSave = (e) => {
        e.preventDefault();
        saveMutation.mutate(form);
    };

    const copyLink = async (id, link) => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(prev => ({ ...prev, [id]: true }));
            toast.success('Magic link copied — forward it to your wali');
            setTimeout(() => setCopied(prev => ({ ...prev, [id]: false })), 2000);
        } catch {
            toast.error('Could not copy link');
        }
    };

    return (
        <>
            <Helmet><title>Wali (Guardian) - Nikah</title></Helmet>
            <div className="space-y-6">
                <PageHeader title="Wali (Guardian) Oversight" description="Islamic guardian consent built into the contact-request flow" icon={ShieldCheck} />

                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-start gap-3">
                            <span className="grid place-items-center h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600"><ShieldCheck className="h-5 w-5" /></span>
                            <div>
                                <h3 className="font-heading font-bold text-foreground">Enable Wali Oversight</h3>
                                <p className="text-sm text-muted-foreground">When enabled, every contact request for your profile must be approved by your wali (guardian) before your contact info is shared.</p>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                        ) : (
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Checkbox id="waliEnabled" checked={form.waliEnabled} onCheckedChange={(c) => setForm(prev => ({ ...prev, waliEnabled: c }))} />
                                    <Label htmlFor="waliEnabled" className="cursor-pointer text-sm">Require my wali's approval for contact requests</Label>
                                </div>

                                {form.waliEnabled && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-border p-4 bg-muted/20">
                                        <div className="space-y-1.5">
                                            <Label>Wali's Name</Label>
                                            <Input value={form.waliName} onChange={(e) => setForm(prev => ({ ...prev, waliName: e.target.value }))} placeholder="e.g., Abdul Karim" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>Relationship</Label>
                                            <Select value={form.waliRelation} onValueChange={(v) => setForm(prev => ({ ...prev, waliRelation: v }))}>
                                                <SelectTrigger><SelectValue placeholder="Select relationship" /></SelectTrigger>
                                                <SelectContent>{waliRelations.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>Wali's Contact (phone)</Label>
                                            <Input value={form.waliContact} onChange={(e) => setForm(prev => ({ ...prev, waliContact: e.target.value }))} placeholder="+8801XXXXXXXXX" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>Wali's Email</Label>
                                            <Input type="email" value={form.waliEmail} onChange={(e) => setForm(prev => ({ ...prev, waliEmail: e.target.value }))} placeholder="wali@example.com" />
                                        </div>
                                    </div>
                                )}

                                {info?.waliConsent === 'pending' && (
                                    <Badge variant="outline" className="gap-1 border-amber-500/40 bg-amber-500/10 text-amber-600"><Clock className="h-3.5 w-3.5" /> Wali consent pending</Badge>
                                )}

                                <Button type="submit" disabled={saveMutation.isLoading}>{saveMutation.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} Save Wali Information</Button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Mail className="h-5 w-5 text-primary" />
                                <h3 className="font-heading font-bold text-foreground">Incoming Wali Approvals</h3>
                            </div>
                            <Button variant="outline" size="icon" onClick={() => refetch()} title="Refresh"><RefreshCw className="h-4 w-4" /></Button>
                        </div>

                        {pending.length === 0 ? (
                            <EmptyState icon={ShieldCheck} title="No wali approvals yet" description="When someone requests your contact info, their request will appear here for your wali to approve." />
                        ) : (
                            <div className="space-y-3">
                                {pending.map((a) => (
                                    <div key={a._id} className="rounded-xl border border-border p-4 flex flex-wrap items-center justify-between gap-3">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <UserIcon className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-semibold text-foreground text-sm">{a.requesterName}</span>
                                                <span className="text-xs text-muted-foreground tabular-nums">#{a.requesterBiodataId}</span>
                                            </div>
                                            {a.status === 'pending'
                                                ? <Badge variant="outline" className="gap-1 border-amber-500/40 bg-amber-500/10 text-amber-600"><Clock className="h-3 w-3" /> Awaiting wali</Badge>
                                                : a.status === 'approved'
                                                    ? <Badge variant="outline" className="gap-1 border-emerald-500/40 bg-emerald-500/10 text-emerald-600"><Check className="h-3 w-3" /> Approved</Badge>
                                                    : <Badge variant="outline" className="gap-1 border-rose-500/40 bg-rose-500/10 text-rose-600">Declined</Badge>}
                                            {a.waliNote && <p className="text-xs text-muted-foreground italic">“{a.waliNote}”</p>}
                                        </div>
                                        {a.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" onClick={() => copyLink(a._id, a.magicLink)}>
                                                    {copied[a._id] ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />} Copy magic link
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => resendMutation.mutate(a.contactRequestId || a._id)} disabled={resendMutation.isLoading}>
                                                    <RefreshCw className="h-4 w-4" /> Regenerate
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Phone className="h-3 w-3" /> Email delivery is stubbed in this demo — copy the magic link and forward it to your wali manually.</p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default WaliPanel;
