import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Users, Check, X, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { guardianAPI } from '../../api/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Public page — a member approves/rejects a guardian link via a single-use token.
const GuardianDecision = () => {
    const { token } = useParams();
    const { t } = useLanguage();
    const [result, setResult] = useState(null);

    const { data, isLoading, error } = useQuery({
        queryKey: ['guardianLink', token],
        queryFn: async () => { const r = await guardianAPI.getLinkByToken(token); return r.data; },
        retry: false
    });

    const decide = useMutation({
        mutationFn: (decision) => guardianAPI.decideLink(token, { decision }),
        onSuccess: (_d, decision) => setResult(decision)
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-slate-950 grid place-items-center px-4 py-10">
            <Helmet><title>Guardian Link - Nikah</title></Helmet>
            <div className="w-full max-w-lg">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
                        <Users className="h-4 w-4" /> {t('fp.guardian.decisionTitle')}
                    </div>
                </div>
                <Card>
                    <CardContent className="p-6 md:p-8">
                        {isLoading ? (
                            <div className="flex flex-col items-center py-10"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /><p className="mt-3 text-sm text-muted-foreground">Loading…</p></div>
                        ) : error ? (
                            <div className="text-center py-8"><X className="h-10 w-10 text-rose-500 mx-auto mb-3" /><h2 className="font-bold text-lg">{t('fp.guardian.invalidLink')}</h2></div>
                        ) : result ? (
                            <div className="text-center py-8">
                                {result === 'approved'
                                    ? <><Check className="h-12 w-12 text-emerald-600 mx-auto mb-3" /><h2 className="font-bold text-lg">{t('fp.guardian.approvedTitle')}</h2><p className="text-sm text-muted-foreground mt-1">{t('fp.guardian.approvedMsg').replace('{name}', data.guardianName)}</p></>
                                    : <><X className="h-12 w-12 text-rose-500 mx-auto mb-3" /><h2 className="font-bold text-lg">{t('fp.guardian.declinedTitle')}</h2><p className="text-sm text-muted-foreground mt-1">{t('fp.guardian.declinedMsg')}</p></>}
                            </div>
                        ) : data?.status === 'approved' ? (
                            <div className="text-center py-8"><Check className="h-10 w-10 text-emerald-600 mx-auto mb-3" /><h2 className="font-bold text-lg">{t('fp.guardian.alreadyApproved')}</h2><p className="text-sm text-muted-foreground">{t('fp.guardian.alreadyApprovedMsg').replace('{name}', data.guardianName)}</p></div>
                        ) : (
                            <>
                                <p className="text-sm text-muted-foreground mb-4">
                                    <span className="font-semibold text-foreground">{data.guardianName || data.guardianEmail}</span>
                                    {data.relation ? ` (${data.relation})` : ''} is requesting to act as your <span className="font-semibold text-foreground">guardian</span> on Nikah — to help you find a spouse on your behalf.
                                </p>
                                <p className="text-xs text-muted-foreground mb-5">{t('fp.guardian.decisionHelp')}</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button onClick={() => decide.mutate('approved')} disabled={decide.isLoading} className="bg-emerald-600 hover:bg-emerald-700"><Check className="h-4 w-4" /> {t('fp.guardian.approve')}</Button>
                                    <Button onClick={() => decide.mutate('rejected')} disabled={decide.isLoading} variant="outline" className="text-rose-600 border-rose-500/40 hover:bg-rose-500/10"><X className="h-4 w-4" /> {t('fp.guardian.decline')}</Button>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
                <p className="text-center text-xs text-muted-foreground mt-4">Nikah — Family-first, guardian-led matchmaking</p>
            </div>
        </div>
    );
};

export default GuardianDecision;
