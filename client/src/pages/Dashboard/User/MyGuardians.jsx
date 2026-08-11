import { useQuery } from '@tanstack/react-query';
import { Users, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { guardianAPI } from '../../../api/api';
import { useLanguage } from '../../../contexts/LanguageContext';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MyGuardians = () => {
    const { t } = useLanguage();
    const { data: guardians = [] } = useQuery({
        queryKey: ['myGuardians'],
        queryFn: async () => { const r = await guardianAPI.getMyGuardians(); return r.data; }
    });

    return (
        <>
            <Helmet><title>My Guardians - Nikah</title></Helmet>
            <div className="space-y-6">
                <PageHeader title={t('fp.guardian.myGuardiansTitle')} description={t('fp.guardian.myGuardiansDesc')} icon={Users} />
                <Card><CardContent className="p-6">
                    {guardians.length === 0 ? (
                        <EmptyState icon={Users} title={t('fp.guardian.myGuardiansEmpty')} description={t('fp.guardian.myGuardiansEmptyDesc')} />
                    ) : (
                        <div className="space-y-2">
                            {guardians.map(g => (
                                <div key={g._id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                                    <div className="flex items-center gap-3">
                                        <span className="grid place-items-center h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600"><ShieldCheck className="h-5 w-5" /></span>
                                        <div>
                                            <p className="font-semibold text-foreground text-sm">{g.guardianName || g.guardianEmail} {g.relation && <Badge variant="outline" className="ml-1 text-[10px]">{g.relation}</Badge>}</p>
                                            <p className="text-xs text-muted-foreground">{g.guardianEmail}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={g.status === 'approved' ? 'border-emerald-500/40 text-emerald-600 gap-1' : g.status === 'pending' ? 'border-amber-500/40 text-amber-600 gap-1' : 'gap-1'}>
                                        {g.status === 'approved' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                        {g.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent></Card>
            </div>
        </>
    );
};

export default MyGuardians;
