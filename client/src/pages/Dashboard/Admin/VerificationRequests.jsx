import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, Check, X, Mail, Hash, Clock, RefreshCw, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { adminAPI } from '../../../api/api';
import { useLanguage } from '../../../contexts/LanguageContext';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const methodLabels = {
    nid: 'NID (National ID)',
    imam_endorsement: 'Imam Endorsement',
    community_leader: 'Community Leader'
};

const VerificationRequests = () => {
    const queryClient = useQueryClient();
    const { t } = useLanguage();

    const { data: requests = [], isLoading, error, refetch } = useQuery({
        queryKey: ['verificationRequests'],
        queryFn: async () => { const response = await adminAPI.getVerificationRequests(); return response.data; },
        refetchOnMount: 'always', staleTime: 0,
    });

    const approveMutation = useMutation({
        mutationFn: (biodataId) => adminAPI.approveVerification(biodataId),
        onSuccess: () => { queryClient.invalidateQueries(['verificationRequests']); toast.success('Profile verified'); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); },
    });

    const rejectMutation = useMutation({
        mutationFn: (biodataId) => adminAPI.rejectVerification(biodataId),
        onSuccess: () => { queryClient.invalidateQueries(['verificationRequests']); toast.success('Verification rejected'); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); },
    });

    const handleApprove = async (item) => {
        const result = await Swal.fire({ title: 'Verify this profile?', text: `Mark ${item.name}'s profile as verified via ${methodLabels[item.verification?.method] || 'the chosen method'}.`, icon: 'question', showCancelButton: true, confirmButtonColor: '#10b981', cancelButtonColor: '#ef4444', confirmButtonText: 'Yes, verify!' });
        if (result.isConfirmed) approveMutation.mutate(item.biodataId);
    };

    const handleReject = async (item) => {
        const result = await Swal.fire({ title: 'Reject verification?', text: `Reject ${item.name}'s verification request. They may re-apply.`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280', confirmButtonText: 'Reject' });
        if (result.isConfirmed) rejectMutation.mutate(item.biodataId);
    };

    return (
        <>
            <Helmet><title>Verification Requests - Admin</title></Helmet>
            <div className="space-y-6">
                <PageHeader title="Verification Requests" description="Review and approve profile verification (NID / Imam / Leader)" icon={ShieldCheck}>
                    <Button variant="outline" size="icon" onClick={() => refetch()} title="Refresh"><RefreshCw className="h-4 w-4" /></Button>
                </PageHeader>

                {error && (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                        <p className="font-semibold mb-1">Error loading data</p>
                        <p>{error.response?.data?.message || error.message}</p>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center py-12"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
                ) : requests.length === 0 ? (
                    <EmptyState icon={ShieldCheck} title="No pending verifications" description="When users request profile verification, they will appear here." />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {requests.map((item) => (
                            <Card key={item._id} className="card-lift hover:border-primary/30">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="bg-emerald-600 text-white">{item.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-foreground text-sm truncate">{item.name}</h3>
                                            <Badge variant="outline" className="gap-1 border-emerald-500/40 bg-emerald-500/10 text-emerald-600 mt-0.5">{methodLabels[item.verification?.method] || item.verification?.method}</Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 mb-3 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-2"><Mail className="h-3 w-3" /><span className="truncate">{item.userEmail}</span></div>
                                        <div className="flex items-center gap-2"><Hash className="h-3 w-3" /><span className="tabular-nums">Biodata #{item.biodataId}</span></div>
                                        {item.verification?.referenceName && <div className="flex items-center gap-2"><ShieldCheck className="h-3 w-3" /><span>Ref: {item.verification.referenceName}</span></div>}
                                        {item.verification?.referenceContact && <div className="flex items-center gap-2"><Clock className="h-3 w-3" /><span>{item.verification.referenceContact}</span></div>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button onClick={() => handleApprove(item)} disabled={approveMutation.isLoading} className="bg-emerald-600 hover:bg-emerald-700"><Check className="h-4 w-4" /> Approve</Button>
                                        <Button onClick={() => handleReject(item)} disabled={rejectMutation.isLoading} variant="outline" className="text-rose-600 border-rose-500/40 hover:bg-rose-500/10"><X className="h-4 w-4" /> Reject</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default VerificationRequests;
