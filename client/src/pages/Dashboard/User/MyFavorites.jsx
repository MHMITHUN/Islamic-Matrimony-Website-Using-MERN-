import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash, FaEye, FaMapMarkerAlt, FaBriefcase, FaStar, FaUser } from 'react-icons/fa';
import { favoritesAPI } from '../../../api/api';
import { useLanguage } from '../../../contexts/LanguageContext';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const MyFavorites = () => {
    const queryClient = useQueryClient();
    const { t } = useLanguage();

    const { data: favorites = [], isLoading } = useQuery({
        queryKey: ['myFavorites'],
        queryFn: async () => { const response = await favoritesAPI.getAll(); return response.data; }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => favoritesAPI.remove(id),
        onSuccess: () => { queryClient.invalidateQueries(['myFavorites']); toast.success(t('toast.removeFromFavorites')); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); }
    });

    const handleDelete = async (id) => {
        const result = await Swal.fire({ title: t('dashboard.favorites.removeTitle'), text: t('dashboard.favorites.removeText'), icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b', confirmButtonText: t('dashboard.favorites.removeConfirm') });
        if (result.isConfirmed) deleteMutation.mutate(id);
    };

    if (isLoading) return <div className="flex flex-col items-center justify-center py-20"><div className="spinner-lg"></div><p className="mt-4 text-slate-500">{t('dashboard.favorites.loading')}</p></div>;

    return (
        <div className="space-y-6">
            <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 rounded-full text-pink-600 text-sm font-medium mb-2"><FaStar className="text-xs" /><span>{t('dashboard.favorites.badge')}</span></div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">{t('dashboard.favorites.heading')}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{t('dashboard.favorites.subtitle')}</p>
            </div>

            {favorites.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-700 p-12 text-center">
                    <div className="w-20 h-20 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6"><FaHeart className="text-4xl text-pink-300 dark:text-pink-400" /></div>
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">{t('dashboard.favorites.noFavorites')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">{t('dashboard.favorites.noFavoritesDesc')}</p>
                    <Link to="/biodatas" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors text-sm">{t('dashboard.favorites.browseBiodatas')}</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((favorite, index) => (
                        <div key={favorite._id} className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                            <div className="relative p-5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 overflow-hidden">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
                                <div className="relative flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white font-bold text-lg">{favorite.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                                    <div><h3 className="font-bold text-white">{favorite.name}</h3><span className="text-white/70 text-sm">ID: #{favorite.biodataId}</span></div>
                                </div>
                                <div className="absolute top-3 right-3"><FaHeart className="text-white/50 text-xl animate-pulse" /></div>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300"><div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center"><FaMapMarkerAlt className="text-emerald-500 text-sm" /></div><span className="truncate">{favorite.permanentAddress || t('biodata.details.notSpecified')}</span></div>
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300"><div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center"><FaBriefcase className="text-blue-500 text-sm" /></div><span className="truncate">{favorite.occupation || t('biodata.details.notSpecified')}</span></div>
                                <div className="flex gap-2 pt-2">
                                    <Link to={`/biodata/${favorite.biodataId}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors text-sm"><FaEye /> {t('dashboard.favorites.viewProfile')}</Link>
                                    <button onClick={() => handleDelete(favorite._id)} disabled={deleteMutation.isLoading} className="px-4 py-3 border-2 border-red-200 dark:border-red-900/30 text-red-500 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-800 transition-all disabled:opacity-50" title={t('dashboard.favorites.remove')}><FaTrash /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyFavorites;
