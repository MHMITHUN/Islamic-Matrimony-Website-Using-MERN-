import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaBell, FaCheck, FaTrash, FaEnvelope, FaCrown, FaEye, FaUser, FaCheckCircle } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { notificationAPI } from '../../../api/api';
import toast from 'react-hot-toast';

const Notifications = () => {
    const queryClient = useQueryClient();

    const { data = { notifications: [], unreadCount: 0 }, isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => { const res = await notificationAPI.getAll(); return res.data; },
        refetchInterval: 30000
    });

    const markReadMutation = useMutation({
        mutationFn: (id) => notificationAPI.markRead(id),
        onSuccess: () => { queryClient.invalidateQueries(['notifications']); }
    });

    const markAllReadMutation = useMutation({
        mutationFn: () => notificationAPI.markAllRead(),
        onSuccess: () => { queryClient.invalidateQueries(['notifications']); toast.success('All marked as read'); }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => notificationAPI.delete(id),
        onSuccess: () => { queryClient.invalidateQueries(['notifications']); }
    });

    const getIcon = (type) => {
        switch (type) {
            case 'contact_request': return <FaEnvelope className="text-blue-500" />;
            case 'contact_approved': return <FaCheckCircle className="text-emerald-500" />;
            case 'premium_approved': return <FaCrown className="text-amber-500" />;
            case 'new_message': return <FaEnvelope className="text-purple-500" />;
            case 'profile_viewed': return <FaEye className="text-pink-500" />;
            default: return <FaBell className="text-gray-500" />;
        }
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

    return (
        <>
            <Helmet><title>Notifications - Nikah Matrimony</title></Helmet>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <FaBell className="text-emerald-600" /> Notifications
                            {data.unreadCount > 0 && (
                                <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">{data.unreadCount}</span>
                            )}
                        </h1>
                    </div>
                    {data.unreadCount > 0 && (
                        <button onClick={() => markAllReadMutation.mutate()} className="px-3 py-1.5 text-xs text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors font-medium">
                            Mark all read
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12"><div className="spinner-lg"></div></div>
                ) : data.notifications.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <FaBell className="text-3xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-gray-700 dark:text-gray-200 mb-1">No notifications</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">You're all caught up!</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {data.notifications.map(notif => (
                            <div key={notif._id} className={`flex items-start gap-3 p-3.5 rounded-xl border transition-colors ${notif.isRead ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' : 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'}`}>
                                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 text-sm">
                                    {getIcon(notif.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{notif.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notif.message}</p>
                                    <p className="text-[10px] text-gray-400 mt-1">{formatTime(notif.createdAt)}</p>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    {!notif.isRead && (
                                        <button onClick={() => markReadMutation.mutate(notif._id)} className="p-1.5 text-gray-400 hover:text-emerald-600 rounded transition-colors" title="Mark as read">
                                            <FaCheck className="text-xs" />
                                        </button>
                                    )}
                                    <button onClick={() => deleteMutation.mutate(notif._id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors" title="Delete">
                                        <FaTrash className="text-xs" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Notifications;
