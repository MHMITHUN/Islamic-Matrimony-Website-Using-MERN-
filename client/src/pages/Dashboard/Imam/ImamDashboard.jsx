import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ShieldCheck, Loader2, Search } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { providerAPI, biodataAPI } from '../../../api/api';
import { useLanguage } from '../../../contexts/LanguageContext';
import PageHeader from '../../../components/dashboard/PageHeader';
import { ENDORSE_CATEGORIES } from '../../../components/shared/EndorseDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

const ImamDashboard = () => {
    const { t } = useLanguage();
    const [query, setQuery] = useState('');
    const [found, setFound] = useState(null);
    const [cats, setCats] = useState(['good_character']);
    const [note, setNote] = useState('Attested by a verified Imam.');

    const searchMut = useMutation({
        mutationFn: async (id) => { const r = await biodataAPI.getById(id); return r.data; },
        onSuccess: setFound,
        onError: () => { setFound(null); toast.error('Biodata not found'); }
    });

    const attestMut = useMutation({
        mutationFn: () => providerAPI.attest(found.biodataId, { categories: cats, note }),
        onSuccess: () => { toast.success('Attestation recorded — significant trust boost applied.'); setFound(null); setQuery(''); },
        onError: (e) => toast.error(e.response?.data?.message || 'Failed to attest')
    });

    const toggle = (k) => setCats(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);

    return (
        <>
            <Helmet><title>{t('fp.imam.consoleTitle')} - Nikah</title></Helmet>
            <div className="space-y-6">
                <PageHeader title={t('fp.imam.consoleTitle')} description={t('fp.imam.consoleDesc')} icon={ShieldCheck} />

                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label>{t('fp.imam.findLabel')}</Label>
                            <div className="flex gap-2">
                                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('fp.imam.findPh')} onKeyDown={(e) => e.key === 'Enter' && searchMut.mutate(query)} />
                                <Button onClick={() => searchMut.mutate(query)} disabled={searchMut.isLoading}>
                                    {searchMut.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} {t('fp.common.find')}
                                </Button>
                            </div>
                        </div>

                        {found && (
                            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] p-4 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                        {found.profileImage ? <AvatarImage src={found.profileImage} /> : null}
                                        <AvatarFallback className="bg-emerald-500/10 text-emerald-600">{found.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-foreground">{found.name} <span className="text-xs text-muted-foreground tabular-nums">#{found.biodataId}</span></p>
                                        <Badge variant="outline" className="text-[10px] mt-0.5">{t('fp.imam.currentTazkiya')}: {found.tazkiyaTier || 'none'} ({found.trustScore || 0})</Badge>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>{t('fp.imam.attestLabel')}</Label>
                                    <div className="space-y-2">
                                        {ENDORSE_CATEGORIES.map(c => (
                                            <div key={c.key} className="flex items-center gap-2">
                                                <Checkbox id={`im-${c.key}`} checked={cats.includes(c.key)} onCheckedChange={() => toggle(c.key)} />
                                                <Label htmlFor={`im-${c.key}`} className="cursor-pointer text-sm font-normal">{t('fp.endorseCat.' + c.key)}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="inote">{t('fp.imam.noteLabel')}</Label>
                                    <Textarea id="inote" value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
                                </div>
                                <Button onClick={() => attestMut.mutate()} disabled={attestMut.isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                                    {attestMut.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} {t('fp.imam.attest')}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default ImamDashboard;
