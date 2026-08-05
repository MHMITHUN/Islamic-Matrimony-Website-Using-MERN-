import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaCheckCircle, FaEnvelope, FaUser, FaClock, FaStar, FaIdCard, FaCalendar } from 'react-icons/fa';
import { adminAPI } from '../../../api/api';
import { useLanguage } from '../../../contexts/LanguageContext';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ApprovedContacts = () => {
    const queryClient = useQueryClient();
    const { t } = useLanguage();

    const { data: requests = [], isLoading } = useQuery({ queryKey: ['adminContactRequests'], queryFn: async () => { const response = await adminAPI.getContactRequests(); return response.data; } });

    const approveMutation = useMutation({
        mutationFn: (id) => adminAPI.approveContact(id),
        onSuccess: () => { queryClient.invalidateQueries(['adminContactRequests']); toast.success(t('toast.contactApproved')); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); }
    });

    const handleApprove = async (request) => {
        const result = await Swal.fire({ title: t('admin.approvedContacts.approveTitle'), text: t('admin.approvedContacts.approveText').replace('{name}', request.requesterName), icon: 'question', showCancelButton: true, confirmButtonColor: '#10b981', cancelButtonColor: '#ef4444', confirmButtonText: t('admin.approvedContacts.approveConfirm') });
        if (result.isConfirmed) approveMutation.mutate(request._id);
    };

    if (isLoading) return <div className="flex flex-col items-center justify-center py-20"><div className="spinner-lg"></div><p className="mt-4 text-slate-500">{t('admin.approvedContacts.loading')}</p></div>;

    return (
        <div className="space-y-6">
            <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-600 text-sm font-medium mb-2"><FaStar className="text-xs" /><span>{t('admin.approvedContacts.badge')}</span></div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">{t('admin.approvedContacts.heading')}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{t('admin.approvedContacts.subtitle')}</p>
            </div>
            {requests.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-12 text-center"><div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6"><FaEnvelope className="text-4xl text-emerald-300 dark:text-emerald-400" /></div><h2 className="text-xl font-bold text-slate-700 mb-2">{t('admin.approvedContacts.noRequests')}</h2><p className="text-slate-500">{t('admin.approvedContacts.noRequestsDesc')}</p></div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800"><th className="text-left px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 uppercase">{t('admin.approvedContacts.requester')}</th><th className="text-left px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 uppercase">{t('admin.approvedContacts.email')}</th><th className="text-left px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 uppercase">{t('admin.approvedContacts.biodataId')}</th><th className="text-left px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 uppercase">{t('admin.approvedContacts.status')}</th><th className="text-left px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 uppercase">{t('admin.approvedContacts.action')}</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-700">{requests.map((request, index) => (<tr key={request._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors" style={{ animationDelay: `${index * 50}ms` }}><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold">{request.requesterName?.charAt(0)?.toUpperCase() || 'U'}</div><span className="font-semibold text-slate-800 dark:text-slate-200">{request.requesterName}</span></div></td><td className="px-6 py-4 text-slate-600 dark:text-slate-400">{request.requesterEmail}</td><td className="px-6 py-4"><span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-full"><FaIdCard className="text-xs text-emerald-500" /> #{request.biodataId}</span></td><td className="px-6 py-4">{request.status === 'approved' ? <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full"><FaCheckCircle className="text-[10px]" /> {t('admin.approvedContacts.approved')}</span> : <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full"><FaClock className="text-[10px]" /> {t('admin.approvedContacts.pending')}</span>}</td><td className="px-6 py-4">{request.status === 'pending' ? <button onClick={() => handleApprove(request)} disabled={approveMutation.isLoading} className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"><FaCheckCircle /> {t('admin.approvedContacts.approve')}</button> : <span className="text-emerald-600 text-sm font-medium flex items-center gap-1"><FaCheckCircle className="text-xs" /> {t('admin.approvedContacts.completed')}</span>}</td></tr>))}</tbody></table></div></div>
            )}
        </div>
    );
};

export default ApprovedContacts;
