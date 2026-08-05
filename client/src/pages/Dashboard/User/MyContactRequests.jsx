import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, Trash2, CheckCircle2, Clock, Phone, User, Lock, Loader2 } from 'lucide-react';
import { contactRequestAPI } from '../../../api/api';
import { useLanguage } from '../../../contexts/LanguageContext';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import StatusBadge from '../../../components/dashboard/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const MyContactRequests = () => {
    const queryClient = useQueryClient();
    const { t } = useLanguage();

    const { data: requests = [], isLoading } = useQuery({
        queryKey: ['myContactRequests'],
        queryFn: async () => { const response = await contactRequestAPI.getMyRequests(); return response.data; },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => contactRequestAPI.delete(id),
        onSuccess: () => { queryClient.invalidateQueries(['myContactRequests']); toast.success(t('toast.contactDeleted')); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); },
    });

    const handleDelete = async (id) => {
        const result = await Swal.fire({ title: t('dashboard.contactRequests.deleteTitle'), text: t('dashboard.contactRequests.deleteText'), icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b', confirmButtonText: t('dashboard.contactRequests.deleteConfirm') });
        if (result.isConfirmed) deleteMutation.mutate(id);
    };

    if (isLoading) return <div className="flex flex-col items-center justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /><p className="mt-3 text-muted-foreground text-sm">{t('dashboard.contactRequests.loading')}</p></div>;

    return (
        <div className="space-y-6">
            <PageHeader title={t('dashboard.contactRequests.heading')} description={t('dashboard.contactRequests.subtitle')} icon={Mail} />

            {requests.length === 0 ? (
                <EmptyState icon={Mail} title={t('dashboard.contactRequests.noRequests')} description={t('dashboard.contactRequests.noRequestsDesc')} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {requests.map((request) => {
                        const approved = request.status === 'approved';
                        return (
                            <Card key={request._id} className="overflow-hidden card-lift hover:border-primary/30">
                                <div className={cn('p-4 text-white', approved ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-amber-500 to-orange-500')}>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="grid place-items-center h-10 w-10 rounded-xl bg-white/20 backdrop-blur shrink-0"><User className="h-5 w-5" /></span>
                                            <div className="min-w-0">
                                                <h3 className="font-bold truncate">{request.name}</h3>
                                                <span className="text-white/70 text-sm tabular-nums">#{request.biodataId}</span>
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold backdrop-blur shrink-0">
                                            {approved ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                            {approved ? t('dashboard.contactRequests.approved') : t('dashboard.contactRequests.pending')}
                                        </span>
                                    </div>
                                </div>
                                <CardContent className="p-5 space-y-3">
                                    {approved ? (
                                        <>
                                            <a href={`tel:${request.mobileNumber}`} className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:border-primary/30 transition-colors group">
                                                <span className="grid place-items-center h-10 w-10 rounded-xl bg-emerald-500 text-white group-hover:scale-110 transition-transform"><Phone className="h-4 w-4" /></span>
                                                <div className="min-w-0"><p className="text-xs text-muted-foreground">{t('dashboard.contactRequests.phone')}</p><p className="font-semibold text-foreground truncate">{request.mobileNumber}</p></div>
                                            </a>
                                            <a href={`mailto:${request.email}`} className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:border-primary/30 transition-colors group">
                                                <span className="grid place-items-center h-10 w-10 rounded-xl bg-sky-500 text-white group-hover:scale-110 transition-transform"><Mail className="h-4 w-4" /></span>
                                                <div className="min-w-0"><p className="text-xs text-muted-foreground">Email</p><p className="font-semibold text-foreground truncate">{request.email}</p></div>
                                            </a>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                                            <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                                            <p className="text-muted-foreground text-sm">{t('dashboard.contactRequests.locked')}</p>
                                        </div>
                                    )}
                                    <Button variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(request._id)} disabled={deleteMutation.isLoading}>
                                        <Trash2 className="h-4 w-4" /> {t('common.delete')}
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyContactRequests;
