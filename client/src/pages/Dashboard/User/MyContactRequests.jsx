import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaEnvelope, FaTrash, FaCheckCircle, FaClock, FaPhone, FaStar, FaIdCard, FaUser, FaLock } from 'react-icons/fa';
import { contactRequestAPI } from '../../../api/api';
import { useLanguage } from '../../../contexts/LanguageContext';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const MyContactRequests = () => {
    const queryClient = useQueryClient();
    const { t } = useLanguage();

    const { data: requests = [], isLoading } = useQuery({
        queryKey: ['myContactRequests'],
        queryFn: async () => { const response = await contactRequestAPI.getMyRequests(); return response.data; }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => contactRequestAPI.delete(id),
        onSuccess: () => { queryClient.invalidateQueries(['myContactRequests']); toast.success(t('toast.contactDeleted')); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); }
    });

    const handleDelete = async (id) => {
        const result = await Swal.fire({ title: t('dashboard.contactRequests.deleteTitle'), text: t('dashboard.contactRequests.deleteText'), icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b', confirmButtonText: t('dashboard.contactRequests.deleteConfirm') });
        if (result.isConfirmed) deleteMutation.mutate(id);
    };

    if (isLoading) return <div className="flex flex-col items-center justify-center py-20"><div className="spinner-lg"></div><p className="mt-4 text-slate-500">{t('dashboard.contactRequests.loading')}</p></div>;

    return (
        <div className="space-y-6">
            <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full text-purple-600 text-sm font-medium mb-2"><FaStar className="text-xs" /><span>{t('dashboard.contactRequests.badge')}</span></div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">{t('dashboard.contactRequests.heading')}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{t('dashboard.contactRequests.subtitle')}</p>
            </div>

            {requests.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-700 p-12 text-center">
                    <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6"><FaEnvelope className="text-4xl text-purple-300 dark:text-purple-400" /></div>
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">{t('dashboard.contactRequests.noRequests')}</h2>
                    <p className="text-slate-500 dark:text-slate-400">{t('dashboard.contactRequests.noRequestsDesc')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map((request, index) => (
                        <div key={request._id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                            <div className={`p-4 ${request.status === 'approved' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"><FaUser className="text-white" /></div>
                                        <div><h3 className="font-bold text-white">{request.name}</h3><span className="text-white/70 text-sm">{t('dashboard.contactRequests.id')} {t('dashboard.contactRequests.idHash')}{request.biodataId}</span></div>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/20 text-white flex items-center gap-1">
                                        {request.status === 'approved' ? <FaCheckCircle /> : <FaClock />}
                                        {request.status === 'approved' ? t('dashboard.contactRequests.approved') : t('dashboard.contactRequests.pending')}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                {request.status === 'approved' ? (<>
                                    <a href={`tel:${request.mobileNumber}`} className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors group">
                                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform"><FaPhone /></div>
                                        <div><p className="text-xs text-slate-500 dark:text-slate-400">{t('dashboard.contactRequests.phone')}</p><p className="font-semibold text-emerald-700 dark:text-emerald-400">{request.mobileNumber}</p></div>
                                    </a>
                                    <a href={`mailto:${request.email}`} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group">
                                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform"><FaEnvelope /></div>
                                        <div><p className="text-xs text-slate-500 dark:text-slate-400">Email</p><p className="font-semibold text-blue-700 dark:text-blue-400">{request.email}</p></div>
                                    </a>
                                </>) : (
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl"><FaLock className="text-slate-400" /><p className="text-slate-500 dark:text-slate-400 text-sm">{t('dashboard.contactRequests.locked')}</p></div>
                                )}
                                <button onClick={() => handleDelete(request._id)} disabled={deleteMutation.isLoading} className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-semibold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-800 transition-all disabled:opacity-50"><FaTrash /> {t('common.delete')}</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyContactRequests;
