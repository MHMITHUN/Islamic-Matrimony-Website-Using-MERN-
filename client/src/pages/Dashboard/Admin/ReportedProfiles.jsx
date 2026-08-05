import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Flag, Eye, Check, X, Loader2, TriangleAlert } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { reportAPI } from '../../../api/api';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import StatusBadge from '../../../components/dashboard/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const reasonLabels = {
    fake_profile: 'Fake Profile',
    inappropriate_content: 'Inappropriate Content',
    harassment: 'Harassment',
    spam: 'Spam',
    other: 'Other',
};

const ReportedProfiles = () => {
    const [statusFilter, setStatusFilter] = useState('all');
    const queryClient = useQueryClient();

    const { data: reports = [], isLoading } = useQuery({
        queryKey: ['adminReports'],
        queryFn: async () => { const res = await reportAPI.getAll(); return res.data; },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, status }) => reportAPI.updateStatus(id, status),
        onSuccess: () => { queryClient.invalidateQueries(['adminReports']); toast.success('Report status updated'); },
        onError: () => { toast.error('Failed to update report'); },
    });

    const filtered = statusFilter === 'all' ? reports : reports.filter(r => r.status === statusFilter);
    const pendingCount = reports.filter(r => r.status === 'pending').length;

    return (
        <>
            <Helmet><title>Reported Profiles - Admin</title></Helmet>
            <div className="space-y-6">
                <PageHeader title="Reported Profiles" description={pendingCount > 0 ? `${pendingCount} pending report(s)` : 'No pending reports'} icon={Flag}>
                    <div className="inline-flex rounded-lg bg-muted p-0.5">
                        {['all', 'pending', 'reviewed', 'resolved', 'dismissed'].map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)}
                                className={cn('px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors capitalize',
                                    statusFilter === s ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
                                {s}
                            </button>
                        ))}
                    </div>
                </PageHeader>

                {isLoading ? (
                    <div className="flex justify-center py-12"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
                ) : filtered.length === 0 ? (
                    <EmptyState icon={Flag} title="No reports found" description={statusFilter === 'all' ? 'No profiles have been reported' : `No ${statusFilter} reports`} />
                ) : (
                    <div className="space-y-3">
                        {filtered.map((report) => (
                            <Card key={report._id} className="card-lift hover:border-primary/30">
                                <CardContent className="p-4">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <span className="grid place-items-center h-10 w-10 rounded-lg bg-destructive/10 text-destructive shrink-0"><TriangleAlert className="h-5 w-5" /></span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                                    <span className="font-semibold text-foreground text-sm">{report.biodata?.name || `Biodata #${report.biodataId}`}</span>
                                                    <StatusBadge status={report.status} />
                                                    <Badge variant="soft">{reasonLabels[report.reason] || report.reason}</Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground">Reported by {report.reporterEmail}</p>
                                                {report.description && <p className="text-xs text-muted-foreground mt-1 italic">“{report.description}”</p>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {report.status === 'pending' && (
                                                <>
                                                    <Button size="sm" variant="outline" onClick={() => updateMutation.mutate({ id: report._id, status: 'reviewed' })}><Eye className="h-3.5 w-3.5" /> Review</Button>
                                                    <Button size="sm" onClick={() => updateMutation.mutate({ id: report._id, status: 'resolved' })}><Check className="h-3.5 w-3.5" /> Resolve</Button>
                                                    <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => updateMutation.mutate({ id: report._id, status: 'dismissed' })}><X className="h-3.5 w-3.5" /> Dismiss</Button>
                                                </>
                                            )}
                                        </div>
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

export default ReportedProfiles;
