import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaSearch, FaUserShield, FaCrown, FaUser, FaCheck, FaUsers, FaStar } from 'react-icons/fa';
import { adminAPI } from '../../../api/api';
import { useLanguage } from '../../../contexts/LanguageContext';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ManageUsers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient();
    const { t } = useLanguage();

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['adminUsers', searchTerm],
        queryFn: async () => { const response = await adminAPI.getUsers(searchTerm); return response.data; }
    });

    const makeAdminMutation = useMutation({
        mutationFn: (id) => adminAPI.makeAdmin(id),
        onSuccess: () => { queryClient.invalidateQueries(['adminUsers']); toast.success(t('toast.userMadeAdmin')); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); }
    });

    const makePremiumMutation = useMutation({
        mutationFn: (id) => adminAPI.makePremium(id),
        onSuccess: () => { queryClient.invalidateQueries(['adminUsers']); toast.success(t('toast.userMadePremium')); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); }
    });

    const removePremiumMutation = useMutation({
        mutationFn: (id) => adminAPI.removePremium(id),
        onSuccess: () => { queryClient.invalidateQueries(['adminUsers']); toast.success(t('toast.premiumRemoved')); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); }
    });

    const handleMakeAdmin = async (user) => {
        const result = await Swal.fire({ title: t('admin.manageUsers.makeAdminTitle'), text: t('admin.manageUsers.makeAdminText').replace('{name}', user.name), icon: 'question', showCancelButton: true, confirmButtonColor: '#10b981', cancelButtonColor: '#ef4444', confirmButtonText: t('admin.manageUsers.makeAdminConfirm') });
        if (result.isConfirmed) makeAdminMutation.mutate(user._id);
    };

    const handleMakePremium = async (user) => {
        const result = await Swal.fire({ title: t('admin.manageUsers.makePremiumTitle'), text: t('admin.manageUsers.makePremiumText').replace('{name}', user.name), icon: 'question', showCancelButton: true, confirmButtonColor: '#f59e0b', cancelButtonColor: '#ef4444', confirmButtonText: t('admin.manageUsers.makePremiumConfirm') });
        if (result.isConfirmed) makePremiumMutation.mutate(user._id);
    };

    const handleRemovePremium = async (user) => {
        const result = await Swal.fire({ title: t('admin.manageUsers.removePremiumTitle'), text: t('admin.manageUsers.removePremiumText').replace('{name}', user.name), icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b', confirmButtonText: t('admin.manageUsers.removePremiumConfirm') });
        if (result.isConfirmed) removePremiumMutation.mutate(user._id);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-600 text-sm font-medium mb-2"><FaStar className="text-xs" /><span>{t('admin.manageUsers.badge')}</span></div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">{t('admin.manageUsers.heading')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{t('admin.manageUsers.subtitle')}</p>
                </div>
                <div className="relative group"><FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={t('admin.manageUsers.search')} className="w-full sm:w-72 pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl outline-none transition-all duration-300 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/10 placeholder:text-slate-400 dark:text-slate-200" /></div>
            </div>

            {isLoading ? (<div className="flex flex-col items-center justify-center py-20"><div className="spinner-lg"></div><p className="mt-4 text-slate-500">{t('admin.manageUsers.loading')}</p></div>) : users.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-700 p-12 text-center">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6"><FaUser className="text-4xl text-slate-300 dark:text-slate-500" /></div>
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">{t('admin.manageUsers.noUsers')}</h2><p className="text-slate-500 dark:text-slate-400">{t('admin.manageUsers.noUsersDesc')}</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead><tr className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800">
                                <th className="text-left px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{t('admin.manageUsers.user')}</th>
                                <th className="text-left px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{t('admin.manageUsers.email')}</th>
                                <th className="text-left px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{t('admin.manageUsers.role')}</th>
                                <th className="text-left px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{t('admin.manageUsers.status')}</th>
                                <th className="text-left px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{t('admin.manageUsers.actions')}</th>
                            </tr></thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {users.map((user, index) => (
                                    <tr key={user._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                        <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold">{user.name?.charAt(0)?.toUpperCase() || 'U'}</div><span className="font-semibold text-slate-800 dark:text-slate-200">{user.name || 'N/A'}</span></div></td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{user.email}</td>
                                        <td className="px-6 py-4">{user.role === 'admin' ? <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full"><FaUserShield className="text-[10px]" /> {t('admin.manageUsers.admin')}</span> : <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full"><FaUser className="text-[10px]" /> {t('admin.manageUsers.userRole')}</span>}</td>
                                        <td className="px-6 py-4">{user.isPremium ? <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg shadow-amber-500/25"><FaCrown className="text-[10px]" /> {t('admin.manageUsers.premium')}</span> : <span className="text-slate-400 text-sm">{t('admin.manageUsers.standard')}</span>}</td>
                                        <td className="px-6 py-4"><div className="flex items-center gap-2 flex-wrap">
                                            {user.role !== 'admin' && <button onClick={() => handleMakeAdmin(user)} disabled={makeAdminMutation.isLoading} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all text-sm font-medium hover:shadow-md disabled:opacity-50"><FaUserShield className="text-xs" /> {t('admin.manageUsers.makeAdmin')}</button>}
                                            {!user.isPremium && <button onClick={() => handleMakePremium(user)} disabled={makePremiumMutation.isLoading} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-all text-sm font-medium hover:shadow-md disabled:opacity-50"><FaCrown className="text-xs" /> {t('admin.manageUsers.makePremium')}</button>}
                                            {user.isPremium && <button onClick={() => handleRemovePremium(user)} disabled={removePremiumMutation.isLoading} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all text-sm font-medium hover:shadow-md disabled:opacity-50"><FaCrown className="text-xs" /> {t('admin.manageUsers.removePremium')}</button>}
                                            {user.role === 'admin' && user.isPremium && <span className="inline-flex items-center gap-1.5 text-emerald-600 text-sm font-medium"><FaCheck className="text-xs" /> {t('admin.manageUsers.fullyPrivileged')}</span>}
                                        </div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
