import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Crown, Check, Mail, Hash, Clock, History, RefreshCw, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { adminAPI } from '../../../api/api';
import { useLanguage } from '../../../contexts/LanguageContext';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const RequestCard = ({ item, pending, onApprove, isLoadingApprove }) => (
    <Card className="card-lift hover:border-primary/30">
        <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10">
                    <AvatarFallback className={cn('text-white', pending ? 'bg-amber-500' : 'bg-emerald-600')}>{item.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm truncate">{item.name}</h3>
                    <span className={cn('text-[10px] font-medium', pending ? 'text-amber-600' : 'text-emerald-600')}>{pending ? 'Wants Premium' : 'Premium Member'}</span>
                </div>
            </div>
            <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="h-3 w-3" /><span className="truncate">{item.userEmail}</span></div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Hash className="h-3 w-3" /><span className="tabular-nums">Biodata #{item.biodataId}</span></div>
            </div>
            {pending ? (
                <Button onClick={() => onApprove(item)} disabled={isLoadingApprove} variant="gold" className="w-full"><Check className="h-4 w-4" /> Approve Premium</Button>
            ) : (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active Member</div>
            )}
        </CardContent>
    </Card>
);

const ApprovedPremium = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const queryClient = useQueryClient();
    const { t } = useLanguage();

    const { data: pendingRequests = [], isLoading: loadingPending, error: pendingError, refetch: refetchPending } = useQuery({
        queryKey: ['premiumRequests'],
        queryFn: async () => { const response = await adminAPI.getPremiumRequests(); return response.data; },
        refetchOnMount: 'always', staleTime: 0,
    });
    const { data: approvedMembers = [], isLoading: loadingHistory, error: historyError, refetch: refetchHistory } = useQuery({
        queryKey: ['approvedPremiumHistory'],
        queryFn: async () => { const response = await adminAPI.getApprovedPremiumHistory(); return response.data; },
        refetchOnMount: 'always', staleTime: 0,
    });

    const approveMutation = useMutation({
        mutationFn: (biodataId) => adminAPI.approvePremium(biodataId),
        onSuccess: () => { queryClient.invalidateQueries(['premiumRequests']); queryClient.invalidateQueries(['approvedPremiumHistory']); toast.success(t('toast.premiumApproved')); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); },
    });

    const handleApprove = async (request) => {
        const result = await Swal.fire({ title: t('admin.approvedPremium.approveTitle'), text: t('admin.approvedPremium.approveText').replace('{name}', request.name), icon: 'question', showCancelButton: true, confirmButtonColor: '#f59e0b', cancelButtonColor: '#ef4444', confirmButtonText: t('admin.approvedPremium.approveConfirm') });
        if (result.isConfirmed) approveMutation.mutate(request.biodataId);
    };

    const isLoading = activeTab === 'pending' ? loadingPending : loadingHistory;
    const error = activeTab === 'pending' ? pendingError : historyError;
    const data = activeTab === 'pending' ? pendingRequests : approvedMembers;
    const refetch = activeTab === 'pending' ? refetchPending : refetchHistory;



    return (
        <>
            <Helmet><title>Approved Premium - Admin</title></Helmet>
            <div className="space-y-6">
                <PageHeader title={t('admin.approvedPremium.heading')} description={t('admin.approvedPremium.subtitle')} icon={Crown}>
                    <Button variant="outline" size="icon" onClick={() => refetch()} title="Refresh"><RefreshCw className="h-4 w-4" /></Button>
                </PageHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="pending" className="gap-1.5"><Clock className="h-3.5 w-3.5" /> Pending
                            {pendingRequests.length > 0 && <Badge variant="gold" className="ml-1">{pendingRequests.length}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger value="history" className="gap-1.5"><History className="h-3.5 w-3.5" /> History ({approvedMembers.length})</TabsTrigger>
                    </TabsList>

                    {error && (
                        <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                            <p className="font-semibold mb-1">Error loading data</p>
                            <p>{error.response?.data?.message || error.message}</p>
                            <Button variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>Retry</Button>
                        </div>
                    )}

                    <TabsContent value="pending" className="mt-4">
                        {loadingPending ? (
                            <div className="flex justify-center py-12"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
                        ) : pendingRequests.length === 0 ? (
                            <EmptyState icon={Clock} title="No pending requests" description="When users request premium, they will appear here." />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{pendingRequests.map((item) => <RequestCard key={item._id} item={item} pending onApprove={handleApprove} isLoadingApprove={approveMutation.isLoading} />)}</div>
                        )}
                    </TabsContent>

                    <TabsContent value="history" className="mt-4">
                        {loadingHistory ? (
                            <div className="flex justify-center py-12"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
                        ) : approvedMembers.length === 0 ? (
                            <EmptyState icon={Crown} title="No approved members yet" description="Approved premium members will appear here." />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{approvedMembers.map((item) => <RequestCard key={item._id} item={item} />)}</div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
};

export default ApprovedPremium;
