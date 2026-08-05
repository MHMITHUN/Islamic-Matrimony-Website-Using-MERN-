import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaFlag, FaCheck, FaTimes, FaEye, FaExclamationTriangle, FaUser, FaSearch } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { reportAPI } from '../../../api/api';
import toast from 'react-hot-toast';

const ReportedProfiles = () => {
    const [statusFilter, setStatusFilter] = useState('all');
    const queryClient = useQueryClient();

    const { data: reports = [], isLoading } = useQuery({
        queryKey: ['adminReports'],
        queryFn: async () => { const res = await reportAPI.getAll(); return res.data; }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, status }) => reportAPI.updateStatus(id, status),
        onSuccess: () => { queryClient.invalidateQueries(['adminReports']); toast.success('Report status updated'); },
        onError: () => { toast.error('Failed to update report'); }
    });

    const filtered = statusFilter === 'all' ? reports : reports.filter(r => r.status === statusFilter);
    const pendingCount = reports.filter(r => r.status === 'pending').length;

    const reasonLabels = {
        fake_profile: 'Fake Profile',
        inappropriate_content: 'Inappropriate Content',
        harassment: 'Harassment',
        spam: 'Spam',
        other: 'Other'
    };

    const statusColors = {
        pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
        reviewed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
        resolved: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
        dismissed: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
    };

    return (
        <>
            <Helmet><title>Reported Profiles - Admin</title></Helmet>
            <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <FaFlag className="text-red-500" /> Reported Profiles
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            {pendingCount > 0 ? `${pendingCount} pending report(s)` : 'No pending reports'}
                        </p>
                    </div>
                    <div className="flex gap-1.5">
                        {['all', 'pending', 'reviewed', 'resolved', 'dismissed'].map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)} className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${statusFilter === s ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-emerald-500'}`}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12"><div className="spinner-lg"></div></div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <FaFlag className="text-3xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-gray-700 dark:text-gray-200 mb-1">No reports found</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{statusFilter === 'all' ? 'No profiles have been reported' : `No ${statusFilter} reports`}</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((report) => (
                            <div key={report._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FaExclamationTriangle className="text-red-500 text-sm" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                                    {report.biodata?.name || `Biodata #${report.biodataId}`}
                                                </span>
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold capitalize ${statusColors[report.status]}`}>
                                                    {report.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Reported by {report.reporterEmail} • Reason: {reasonLabels[report.reason] || report.reason}
                                            </p>
                                            {report.description && (
                                                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 italic">"{report.description}"</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {report.status === 'pending' && (
                                            <>
                                                <button onClick={() => updateMutation.mutate({ id: report._id, status: 'reviewed' })} className="px-3 py-1.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">Review</button>
                                                <button onClick={() => updateMutation.mutate({ id: report._id, status: 'resolved' })} className="px-3 py-1.5 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors">Resolve</button>
                                                <button onClick={() => updateMutation.mutate({ id: report._id, status: 'dismissed' })} className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Dismiss</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default ReportedProfiles;
