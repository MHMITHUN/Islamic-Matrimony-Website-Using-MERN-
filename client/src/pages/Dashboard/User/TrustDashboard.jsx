import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, Loader2, Trash2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { endorsementAPI, authAPI } from '../../../api/api';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import TazkiyaBadge from '../../../components/shared/TazkiyaBadge';
import { ENDORSE_CATEGORIES } from '../../../components/shared/EndorseDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const TIER_MAX = 50; // gold threshold, for the progress visualization

const TrustDashboard = () => {
    const { t } = useLanguage();
    const { trustTier } = useAuth();
    const qc = useQueryClient();

    const { data: me } = useQuery({ queryKey: ['me'], queryFn: async () => { const r = await authAPI.getCurrentUser(); return r.data; } });
    const { data: received = [], isLoading } = useQuery({
        queryKey: ['endorsementsReceived'],
        queryFn: async () => { const r = await endorsementAPI.getReceived(); return r.data; }
    });
    const { data: given = [] } = useQuery({
        queryKey: ['endorsementsGiven'],
        queryFn: async () => { const r = await endorsementAPI.getGiven(); return r.data; }
    });

    const revokeMutation = useMutation({
        mutationFn: (id) => endorsementAPI.revoke(id),
        onSuccess: () => { qc.invalidateQueries(['endorsementsGiven']); qc.invalidateQueries(['endorsementsReceived']); qc.invalidateQueries(['me']); toast.success('Endorsement revoked'); },
        onError: (e) => toast.error(e.response?.data?.message || 'Failed')
    });
    const handleRevoke = async (id) => {
        const r = await Swal.fire({ title: 'Revoke endorsement?', text: 'This will reduce their trust score.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Revoke' });
        if (r.isConfirmed) revokeMutation.mutate(id);
    };

    const score = me?.trustScore || 0;
    const tier = me?.tazkiyaTier || trustTier || 'none';
    const pct = Math.min(100, Math.round((score / TIER_MAX) * 100));

    // category breakdown
    const catCounts = {};
    received.forEach(e => e.categories.forEach(c => { catCounts[c] = (catCounts[c] || 0) + 1; }));

    return (
        <>
            <Helmet><title>Tazkiya Trust - Nikah</title></Helmet>
            <div className="space-y-6">
                <PageHeader title={t('fp.tazkiya.title')} description={t('fp.tazkiya.desc')} icon={ShieldCheck} />

                {/* Score card */}
                <Card>
                    <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                        <div className="relative grid place-items-center h-32 w-32 shrink-0">
                            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted/30" />
                                <circle cx="60" cy="60" r="52" fill="none" stroke="#10b981" strokeWidth="10" strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 52}`} strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct / 100)}`} />
                            </svg>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-foreground tabular-nums">{score}</p>
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">/ {TIER_MAX} gold</p>
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                <h2 className="font-heading text-lg font-bold text-foreground">{t('fp.tazkiya.yourTier')}</h2>
                                <TazkiyaBadge tier={tier} score={score} />
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                                {tier === 'none'
                                    ? 'Earn your first endorsements (≥10) to reach Bronze. Imam attestations give a big boost.'
                                    : `${received.length} endorsement${received.length === 1 ? '' : 's'} · keep building trust to reach the next tier.`}
                            </p>
                            <Progress value={pct} className="h-2" indicatorClassName="bg-emerald-500" />
                        </div>
                    </CardContent>
                </Card>

                {/* Category breakdown */}
                <Card>
                    <CardContent className="p-6">
                        <h3 className="font-heading font-bold text-foreground mb-3">{t('fp.tazkiya.byCategory')}</h3>
                        {Object.keys(catCounts).length === 0 ? (
                            <p className="text-sm text-muted-foreground">No endorsements yet.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {ENDORSE_CATEGORIES.map(c => (
                                    <Badge key={c.key} variant="outline" className="gap-1 border-emerald-500/30 text-emerald-700 dark:text-emerald-400">
                                        {t('fp.endorseCat.' + c.key)} <span className="tabular-nums font-bold">{catCounts[c.key] || 0}</span>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Given endorsements (revoke) */}
                <Card>
                    <CardContent className="p-6">
                        <h3 className="font-heading font-bold text-foreground mb-3">{t('fp.tazkiya.given')}</h3>
                        {isLoading ? (
                            <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                        ) : given.length === 0 ? (
                            <EmptyState icon={ShieldCheck} title={t('fp.tazkiya.givenNone')} description={t('fp.tazkiya.givenNoneDesc')} />
                        ) : (
                            <div className="space-y-2">
                                {given.map(e => (
                                    <div key={e._id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{e.endorsedName || `Biodata #${e.endorsedBiodataId}`}</p>
                                            <p className="text-xs text-muted-foreground">{e.categories.map(c => t('fp.endorseCat.' + c)).join(', ')}</p>
                                        </div>
                                        <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleRevoke(e._id)} disabled={revokeMutation.isLoading}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
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

export default TrustDashboard;
