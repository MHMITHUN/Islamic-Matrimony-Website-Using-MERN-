import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaCrown, FaCheck, FaUser, FaStar, FaEnvelope, FaIdCard, FaClock, FaHistory, FaHourglassHalf, FaSyncAlt } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { adminAPI } from '../../../api/api';
import { useLanguage } from '../../../contexts/LanguageContext';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ApprovedPremium = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const queryClient = useQueryClient();
    const { t } = useLanguage();

    const { data: pendingRequests = [], isLoading: loadingPending, error: pendingError, refetch: refetchPending } = useQuery({
        queryKey: ['premiumRequests'],
        queryFn: async () => {
            const response = await adminAPI.getPremiumRequests();
            return response.data;
        },
        refetchOnMount: 'always',
        staleTime: 0
    });

    const { data: approvedMembers = [], isLoading: loadingHistory, error: historyError, refetch: refetchHistory } = useQuery({
        queryKey: ['approvedPremiumHistory'],
        queryFn: async () => {
            const response = await adminAPI.getApprovedPremiumHistory();
            return response.data;
        },
        refetchOnMount: 'always',
        staleTime: 0
    });

    const approveMutation = useMutation({
        mutationFn: (biodataId) => adminAPI.approvePremium(biodataId),
        onSuccess: () => {
            queryClient.invalidateQueries(['premiumRequests']);
            queryClient.invalidateQueries(['approvedPremiumHistory']);
            toast.success(t('toast.premiumApproved'));
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || t('toast.genericError'));
        }
    });

    const handleApprove = async (request) => {
        const result = await Swal.fire({
            title: t('admin.approvedPremium.approveTitle'),
            text: t('admin.approvedPremium.approveText').replace('{name}', request.name),
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#f59e0b',
            cancelButtonColor: '#ef4444',
            confirmButtonText: t('admin.approvedPremium.approveConfirm')
        });
        if (result.isConfirmed) approveMutation.mutate(request.biodataId);
    };

    const isLoading = activeTab === 'pending' ? loadingPending : loadingHistory;
    const error = activeTab === 'pending' ? pendingError : historyError;
    const data = activeTab === 'pending' ? pendingRequests : approvedMembers;
    const refetch = activeTab === 'pending' ? refetchPending : refetchHistory;

    return (
        <>
            <Helmet><title>Approved Premium - Admin</title></Helmet>
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{t('admin.approvedPremium.heading')}</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('admin.approvedPremium.subtitle')}</p>
                    </div>
                    <button onClick={() => refetch()} className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors" title="Refresh">
                        <FaSyncAlt />
                    </button>
                </div>

                <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                    <button onClick={() => setActiveTab('pending')} className={`px-4 py-2.5 text-sm font-semibold transition-colors relative ${activeTab === 'pending' ? 'text-amber-600 dark:text-amber-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>
                        <span className="flex items-center gap-2"><FaHourglassHalf className="text-xs" />Pending Requests{pendingRequests.length > 0 && <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full">{pendingRequests.length}</span>}</span>
                        {activeTab === 'pending' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"></div>}
                    </button>
                    <button onClick={() => setActiveTab('history')} className={`px-4 py-2.5 text-sm font-semibold transition-colors relative ${activeTab === 'history' ? 'text-emerald-600 dark:text-emerald-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>
                        <span className="flex items-center gap-2"><FaHistory className="text-xs" />Approved History<span className="text-xs text-gray-400">({approvedMembers.length})</span></span>
                        {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"></div>}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-700 dark:text-red-300">
                        <p className="font-semibold mb-1">Error loading data</p>
                        <p>{error.response?.data?.message || error.message}</p>
                        <button onClick={() => refetch()} className="mt-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">Retry</button>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center py-12"><div className="spinner-lg"></div></div>
                ) : error ? null : data.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <FaCrown className="text-3xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-gray-700 dark:text-gray-200 mb-1">
                            {activeTab === 'pending' ? 'No pending requests' : 'No approved members yet'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {activeTab === 'pending' ? 'When users request premium, they will appear here' : 'Approved premium members will appear here'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.map((item) => (
                            <div key={item._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${activeTab === 'pending' ? 'bg-amber-500' : 'bg-emerald-600'}`}>
                                        {item.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{item.name}</h3>
                                        <span className={`text-[10px] font-medium ${activeTab === 'pending' ? 'text-amber-600' : 'text-emerald-600'}`}>
                                            {activeTab === 'pending' ? 'Wants Premium' : 'Premium Member'}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-1.5 mb-3">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <FaEnvelope className="text-[10px]" />
                                        <span className="truncate">{item.userEmail}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <FaIdCard className="text-[10px]" />
                                        <span>Biodata #{item.biodataId}</span>
                                    </div>
                                </div>
                                {activeTab === 'pending' ? (
                                    <button onClick={() => handleApprove(item)} disabled={approveMutation.isLoading} className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
                                        <FaCheck className="text-xs" /> Approve Premium
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Active Member
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default ApprovedPremium;
