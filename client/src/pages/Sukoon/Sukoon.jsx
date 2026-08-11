import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Loader2, Lock, Eye, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { sukoonAPI } from '../../api/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import TazkiyaBadge from '../../components/shared/TazkiyaBadge';
import toast from 'react-hot-toast';

const Sukoon = () => {
    const qc = useQueryClient();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { user } = useAuth();
    const [filter, setFilter] = useState({ biodataType: '', division: '' });

    const { data: profiles = [], isLoading } = useQuery({
        queryKey: ['sukoonProfiles', filter],
        queryFn: async () => { const r = await sukoonAPI.getProfiles(filter); return r.data; }
    });

    const revealMut = useMutation({
        mutationFn: (biodataId) => sukoonAPI.requestReveal(biodataId, {}),
        onSuccess: () => { qc.invalidateQueries(['sukoonProfiles']); toast.success('Identity reveal requested'); },
        onError: (e) => toast.error(e.response?.data?.message || 'Failed')
    });

    const handleReveal = (biodataId) => {
        if (!user) {
            toast('Please log in to request an identity reveal', { icon: '🔒' });
            navigate('/login');
            return;
        }
        revealMut.mutate(biodataId);
    };

    return (
        <>
            <Helmet><title>Sukoon - Second Marriage - Nikah</title></Helmet>
            <div className="min-h-screen bg-muted/30 pt-20 pb-12">
                <div className="container-custom">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-3">
                            <Leaf className="h-3.5 w-3.5" /> Sukoon — Dignified Second-Marriage Channel
                        </span>
                        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">{t('fp.sukoon.title')}</h1>
                        <p className="text-muted-foreground">{t('fp.sukoon.desc')}</p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 justify-center mb-6">
                        <select value={filter.biodataType} onChange={(e) => setFilter(f => ({ ...f, biodataType: e.target.value }))}
                            className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
                            <option value="">{t('fp.sukoon.anyGender')}</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        <select value={filter.division} onChange={(e) => setFilter(f => ({ ...f, division: e.target.value }))}
                            className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
                            <option value="">{t('fp.sukoon.anyDivision')}</option>
                            {['Dhaka', 'Chattagram', 'Rangpur', 'Barisal', 'Khulna', 'Mymensingh', 'Sylhet'].map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                    ) : profiles.length === 0 ? (
                        <p className="text-center text-muted-foreground py-16">{t('fp.sukoon.noProfiles')}</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {profiles.map((p) => (
                                <Card key={p.biodataId} className="card-lift overflow-hidden">
                                    <div className="relative">
                                        <div className={cn('h-40 bg-muted grid place-items-center overflow-hidden', p.profileImageBlurred && 'blur-md')}>
                                            {p.profileImage && !p.profileImageBlurred
                                                ? <img src={p.profileImage} alt={p.name} className="h-full w-full object-cover" />
                                                : <ShieldCheck className="h-10 w-10 text-emerald-300/60" />}
                                        </div>
                                        {p.profileImageBlurred && (
                                            <div className="absolute inset-0 grid place-items-center bg-black/20">
                                                <Lock className="h-7 w-7 text-white/90" />
                                            </div>
                                        )}
                                        <Badge className="absolute top-3 left-3 gap-1 bg-emerald-600 text-white"><Leaf className="h-3 w-3" /> Sukoon</Badge>
                                    </div>
                                    <CardContent className="p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-foreground">{p.revealed ? p.name : `Member #${p.biodataId}`}</h3>
                                            <TazkiyaBadge tier={p.tazkiyaTier} />
                                        </div>
                                        <p className="text-xs text-muted-foreground">{p.age} yrs · {p.permanentDivision} · {p.maritalStatus}</p>
                                        {p.hasChildren && <p className="text-xs text-muted-foreground">Has {p.childrenCount || 0} child(ren)</p>}
                                        {p.revealed ? (
                                            <Button asChild size="sm" variant="outline" className="w-full"><Link to={`/biodata/${p.biodataId}`}><Eye className="h-4 w-4" /> {t('fp.sukoon.viewFull')}</Link></Button>
                                        ) : (
                                            <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => handleReveal(p.biodataId)} disabled={revealMut.isLoading}>
                                                <Lock className="h-4 w-4" /> {t('fp.sukoon.requestReveal')}
                                            </Button>
                                        )}
                                        {p.revealed && <p className="text-[11px] text-emerald-600 flex items-center gap-1 justify-center"><CheckCircle2 className="h-3 w-3" /> {t('fp.sukoon.revealedToYou')}</p>}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Sukoon;
