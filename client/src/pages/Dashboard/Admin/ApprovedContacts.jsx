import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Mail, Clock, Hash, Loader2, UserCheck } from 'lucide-react';
import { adminAPI } from '../../../api/api';
import { useLanguage } from '../../../contexts/LanguageContext';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import StatusBadge from '../../../components/dashboard/StatusBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ApprovedContacts = () => {
    const queryClient = useQueryClient();
    const { t } = useLanguage();

    const { data: requests = [], isLoading } = useQuery({
        queryKey: ['adminContactRequests'],
        queryFn: async () => { const response = await adminAPI.getContactRequests(); return response.data; },
    });

    const approveMutation = useMutation({
        mutationFn: (id) => adminAPI.approveContact(id),
        onSuccess: () => { queryClient.invalidateQueries(['adminContactRequests']); toast.success(t('toast.contactApproved')); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); },
    });

    const handleApprove = async (request) => {
        const result = await Swal.fire({ title: t('admin.approvedContacts.approveTitle'), text: t('admin.approvedContacts.approveText').replace('{name}', request.requesterName), icon: 'question', showCancelButton: true, confirmButtonColor: '#10b981', cancelButtonColor: '#ef4444', confirmButtonText: t('admin.approvedContacts.approveConfirm') });
        if (result.isConfirmed) approveMutation.mutate(request._id);
    };

    if (isLoading) return <div className="flex flex-col items-center justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /><p className="mt-3 text-muted-foreground text-sm">{t('admin.approvedContacts.loading')}</p></div>;

    return (
        <div className="space-y-6">
            <PageHeader title={t('admin.approvedContacts.heading')} description={t('admin.approvedContacts.subtitle')} icon={UserCheck} />

            {requests.length === 0 ? (
                <EmptyState icon={Mail} title={t('admin.approvedContacts.noRequests')} description={t('admin.approvedContacts.noRequestsDesc')} />
            ) : (
                <Card className="overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('admin.approvedContacts.requester')}</TableHead>
                                <TableHead className="hidden md:table-cell">{t('admin.approvedContacts.email')}</TableHead>
                                <TableHead>{t('admin.approvedContacts.biodataId')}</TableHead>
                                <TableHead>{t('admin.approvedContacts.status')}</TableHead>
                                <TableHead className="text-right">{t('admin.approvedContacts.action')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map((request) => (
                                <TableRow key={request._id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9"><AvatarFallback className="bg-gradient-brand text-white text-xs">{request.requesterName?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback></Avatar>
                                            <span className="font-semibold text-foreground">{request.requesterName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground">{request.requesterEmail}</TableCell>
                                    <TableCell><Badge variant="soft" className="gap-1 tabular-nums"><Hash className="h-3 w-3" /> #{request.biodataId}</Badge></TableCell>
                                    <TableCell><StatusBadge status={request.status} /></TableCell>
                                    <TableCell className="text-right">
                                        {request.status === 'pending' ? (
                                            <Button size="sm" onClick={() => handleApprove(request)} disabled={approveMutation.isLoading}><CheckCircle2 className="h-4 w-4" /> {t('admin.approvedContacts.approve')}</Button>
                                        ) : (
                                            <span className="text-xs text-emerald-600 font-medium inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> {t('admin.approvedContacts.completed')}</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    );
};

export default ApprovedContacts;
