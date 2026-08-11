import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Send, Loader2, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { guardianAPI } from '../../../api/api';
import { useLanguage } from '../../../contexts/LanguageContext';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const formatTime = (d) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const FamilyChat = () => {
    const qc = useQueryClient();
    const { t } = useLanguage();
    const [active, setActive] = useState(null);
    const [text, setText] = useState('');
    const [compose, setCompose] = useState({ partnerBiodataId: '', wardBiodataId: '', content: '' });

    const { data: threads = [], isLoading } = useQuery({
        queryKey: ['familyThreads'],
        queryFn: async () => { const r = await guardianAPI.getFamilyThreads(); return r.data; }
    });
    const { data: wards = [] } = useQuery({ queryKey: ['guardianWards'], queryFn: async () => { const r = await guardianAPI.getMyWards(); return r.data; } });
    const approved = wards.filter(w => w.status === 'approved' && w.wardBiodataId);

    const { data: activeData } = useQuery({
        queryKey: ['familyMessages', active],
        queryFn: async () => { const r = await guardianAPI.getFamilyMessages(active); return r.data; },
        enabled: !!active,
        refetchInterval: 5000
    });

    const sendMut = useMutation({
        mutationFn: (data) => guardianAPI.sendFamilyMessage(data),
        onSuccess: () => { qc.invalidateQueries(['familyThreads']); qc.invalidateQueries(['familyMessages', active]); setText(''); setCompose(c => ({ ...c, content: '' })); },
        onError: (e) => toast.error(e.response?.data?.message || 'Failed')
    });

    const sendExisting = () => { if (!text.trim()) return; sendMut.mutate({ wardBiodataId: activeData?.thread?.biodataA, partnerBiodataId: activeData?.thread?.biodataB, content: text }); };

    return (
        <>
            <Helmet><title>Family Chats - Guardian</title></Helmet>
            <div className="space-y-6">
                <PageHeader title={t('fp.guardian.chatTitle')} description={t('fp.guardian.chatDesc')} icon={MessageSquare} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Threads */}
                    <Card className="lg:col-span-1">
                        <CardContent className="p-3 space-y-2 max-h-[60vh] overflow-y-auto">
                            {isLoading ? <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                                : threads.length === 0 ? <p className="text-sm text-muted-foreground p-4 text-center">No family threads yet. Start one below.</p>
                                    : threads.map(th => (
                                        <button key={th._id} onClick={() => setActive(th._id)}
                                            className={cn('w-full text-left p-3 rounded-xl border transition-colors', active === th._id ? 'border-emerald-500 bg-emerald-500/5' : 'border-border hover:bg-accent')}>
                                            <p className="font-semibold text-foreground text-sm">#{th.biodataA} ↔ #{th.biodataB}</p>
                                            <p className="text-xs text-muted-foreground">{th.lastMessageAt ? formatTime(th.lastMessageAt) : 'No messages yet'}</p>
                                        </button>
                                    ))}
                        </CardContent>
                    </Card>

                    {/* Conversation / start */}
                    <Card className="lg:col-span-2">
                        <CardContent className="p-4">
                            {active ? (
                                <div className="space-y-3">
                                    <Button variant="ghost" size="sm" onClick={() => setActive(null)}><ArrowLeft className="h-4 w-4" /> Back</Button>
                                    <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                                        {(activeData?.messages || []).map(m => (
                                            <div key={m._id} className="rounded-xl bg-muted p-2.5">
                                                <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">{m.senderName}</p>
                                                <p className="text-sm text-foreground">{m.content}</p>
                                                <p className="text-[10px] text-muted-foreground">{formatTime(m.createdAt)}</p>
                                            </div>
                                        ))}
                                        {(activeData?.messages || []).length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
                                    </div>
                                    <div className="flex gap-2">
                                        <Input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendExisting()} placeholder="Message the other family…" />
                                        <Button onClick={sendExisting} disabled={sendMut.isLoading || !text.trim()} size="icon"><Send className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <h3 className="font-heading font-bold text-foreground">Start a family conversation</h3>
                                    <p className="text-sm text-muted-foreground">Open a channel with another family whose profile is connected to your ward.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-muted-foreground">Your ward</label>
                                            <select value={compose.wardBiodataId} onChange={(e) => setCompose(c => ({ ...c, wardBiodataId: e.target.value }))}
                                                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                                                <option value="">Select ward…</option>
                                                {approved.map(w => <option key={w._id} value={w.wardBiodataId}>{w.wardName} (#{w.wardBiodataId})</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-muted-foreground">Connected partner's biodata ID</label>
                                            <Input value={compose.partnerBiodataId} onChange={(e) => setCompose(c => ({ ...c, partnerBiodataId: e.target.value }))} placeholder="e.g. 1042" />
                                        </div>
                                    </div>
                                    <Input value={compose.content} onChange={(e) => setCompose(c => ({ ...c, content: e.target.value }))} placeholder="First message…" />
                                    <Button disabled={sendMut.isLoading || !compose.wardBiodataId || !compose.partnerBiodataId || !compose.content}
                                        onClick={() => sendMut.mutate({ wardBiodataId: Number(compose.wardBiodataId), partnerBiodataId: Number(compose.partnerBiodataId), content: compose.content })}
                                        className="bg-emerald-600 hover:bg-emerald-700">
                                        {sendMut.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default FamilyChat;
