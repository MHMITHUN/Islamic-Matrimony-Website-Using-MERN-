import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, Trash2, Mail, Crown, Eye, CheckCircle2, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { notificationAPI } from '../../../api/api';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ICON_MAP = {
    contact_request: { icon: Mail, tint: 'bg-sky-500/10 text-sky-600' },
    contact_approved: { icon: CheckCircle2, tint: 'bg-emerald-500/10 text-emerald-600' },
    premium_approved: { icon: Crown, tint: 'bg-amber-500/10 text-amber-600' },
    new_message: { icon: Mail, tint: 'bg-purple-500/10 text-purple-600' },
    profile_viewed: { icon: Eye, tint: 'bg-rose-500/10 text-rose-600' },
};

const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMins = Math.floor((now - d) / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffH = Math.floor(diffMins / 60);
    if (diffH < 24) return `${diffH}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const Notifications = () => {
    const queryClient = useQueryClient();
    const { data = { notifications: [], unreadCount: 0 }, isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => { const res = await notificationAPI.getAll(); return res.data; },
        refetchInterval: 30000,
    });

    const markReadMutation = useMutation({
        mutationFn: (id) => notificationAPI.markRead(id),
        onSuccess: () => queryClient.invalidateQueries(['notifications']),
    });
    const markAllReadMutation = useMutation({
        mutationFn: () => notificationAPI.markAllRead(),
        onSuccess: () => { queryClient.invalidateQueries(['notifications']); },
    });
    const deleteMutation = useMutation({
        mutationFn: (id) => notificationAPI.delete(id),
        onSuccess: () => queryClient.invalidateQueries(['notifications']),
    });

    const getIcon = (type) => {
        const cfg = ICON_MAP[type] || { icon: Bell, tint: 'bg-muted text-muted-foreground' };
        return cfg;
    };

    return (
        <>
            <Helmet><title>Notifications - Nikah Matrimony</title></Helmet>
            <div className="space-y-6">
                <PageHeader title="Notifications" description="Stay updated on your activity." icon={Bell}>
                    {data.unreadCount > 0 && (
                        <>
                            <Badge variant="destructive">{data.unreadCount} unread</Badge>
                            <Button variant="outline" size="sm" onClick={() => markAllReadMutation.mutate()}>
                                <Check className="h-4 w-4" /> Mark all read
                            </Button>
                        </>
                    )}
                </PageHeader>

                {isLoading ? (
                    <div className="flex justify-center py-12"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
                ) : data.notifications.length === 0 ? (
                    <EmptyState icon={Bell} title="No notifications" description="You're all caught up!" />
                ) : (
                    <Card>
                        <div className="divide-y divide-border">
                            {data.notifications.map((notif) => {
                                const { icon: Icon, tint } = getIcon(notif.type);
                                return (
                                    <div key={notif._id} className={cn('flex items-start gap-3 p-4 transition-colors', !notif.isRead && 'bg-primary/[0.03]')}>
                                        <span className={cn('grid place-items-center h-9 w-9 rounded-lg shrink-0', tint)}><Icon className="h-4 w-4" /></span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold text-foreground">{notif.title}</p>
                                                {!notif.isRead && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                                            <p className="text-[10px] text-muted-foreground/70 mt-1">{formatTime(notif.createdAt)}</p>
                                        </div>
                                        <div className="flex items-center gap-0.5 shrink-0">
                                            {!notif.isRead && (
                                                <Button variant="ghost" size="icon-sm" onClick={() => markReadMutation.mutate(notif._id)} title="Mark as read">
                                                    <Check className="h-3.5 w-3.5" />
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => deleteMutation.mutate(notif._id)} title="Delete">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                )}
            </div>
        </>
    );
};

export default Notifications;
