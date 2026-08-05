import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaEdit, FaHeart, FaEnvelope, FaEye, FaCrown, FaSearch, FaRing, FaClock, FaCheckCircle, FaHourglassHalf, FaHistory, FaCog } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { biodataAPI, favoritesAPI, contactRequestAPI } from '../../../api/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useProfileCompletion } from '../../../hooks/useProfileCompletion';
import ProfileCompleteness from '../../../components/ProfileCompleteness';

const UserOverview = () => {
    const { user, isPremium } = useAuth();
    const { t } = useLanguage();

    const { data: biodata, isLoading: loadingBiodata } = useQuery({
        queryKey: ['myBiodata'],
        queryFn: async () => { try { const res = await biodataAPI.getMyBiodata(); return res.data; } catch (e) { if (e.response?.status === 404) return null; throw e; } }
    });

    const { data: favorites = [] } = useQuery({
        queryKey: ['myFavorites'],
        queryFn: async () => { const res = await favoritesAPI.getAll(); return res.data; }
    });

    const { data: requests = [] } = useQuery({
        queryKey: ['myContactRequests'],
        queryFn: async () => { const res = await contactRequestAPI.getMyRequests(); return res.data; }
    });

    const completion = useProfileCompletion(biodata);
    const approvedRequests = requests.filter(r => r.status === 'approved').length;
    const pendingRequests = requests.filter(r => r.status === 'pending').length;

    const quickActions = [
        { to: '/dashboard/edit-biodata', icon: <FaEdit />, label: biodata ? 'Edit Biodata' : 'Create Biodata', color: 'bg-emerald-600' },
        { to: '/biodatas', icon: <FaSearch />, label: 'Browse Biodatas', color: 'bg-blue-600' },
        { to: '/dashboard/favorites', icon: <FaHeart />, label: 'My Favorites', color: 'bg-pink-600' },
        { to: '/dashboard/contact-requests', icon: <FaEnvelope />, label: 'Contact Requests', color: 'bg-purple-600' },
    ];

    return (
        <>
            <Helmet><title>Dashboard - Nikah Matrimony</title></Helmet>
            <div className="space-y-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {user?.displayName?.split(' ')[0] || 'User'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Here's an overview of your account</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Profile Completion</h2>
                        {loadingBiodata ? (
                            <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                        ) : biodata ? (
                            <ProfileCompleteness {...completion} />
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">You haven't created a biodata yet</p>
                                <Link to="/dashboard/edit-biodata" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors">
                                    <FaEdit className="text-xs" /> Create Biodata
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Account Status</h2>
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Premium</span>
                                {isPremium ? (
                                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded"><FaCrown className="text-[9px]" /> Active</span>
                                ) : (
                                    <span className="text-xs text-gray-400">Standard</span>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Biodata</span>
                                {biodata ? (
                                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600"><FaCheckCircle className="text-[9px]" /> Created</span>
                                ) : (
                                    <span className="text-xs text-gray-400">Not created</span>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Biodata ID</span>
                                <span className="text-xs font-mono text-gray-700 dark:text-gray-300">#{biodata?.biodataId || '---'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                        { icon: <FaHeart />, value: favorites.length, label: 'Favorites', color: 'bg-pink-600' },
                        { icon: <FaEnvelope />, value: requests.length, label: 'Contact Requests', color: 'bg-purple-600' },
                        { icon: <FaCheckCircle />, value: approvedRequests, label: 'Approved', color: 'bg-emerald-600' },
                        { icon: <FaHourglassHalf />, value: pendingRequests, label: 'Pending', color: 'bg-amber-600' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                            <div className={`w-9 h-9 mx-auto mb-2 ${stat.color} rounded-lg flex items-center justify-center text-white`}>{stat.icon}</div>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Quick Actions</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {quickActions.map((action, i) => (
                            <Link key={i} to={action.to} className="flex items-center gap-3 p-3.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors group">
                                <div className={`w-9 h-9 ${action.color} rounded-lg flex items-center justify-center text-white text-sm group-hover:scale-105 transition-transform`}>{action.icon}</div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {biodata && (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                            <Link to="/dashboard/activity" className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline">View all</Link>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
                            {[
                                { icon: <FaEdit />, text: 'Biodata created/updated', time: biodata.updatedAt ? new Date(biodata.updatedAt).toLocaleDateString() : 'N/A', color: 'text-emerald-600' },
                                ...(favorites.length > 0 ? [{ icon: <FaHeart />, text: `${favorites.length} profiles favorited`, time: 'Active', color: 'text-pink-600' }] : []),
                                ...(approvedRequests > 0 ? [{ icon: <FaCheckCircle />, text: `${approvedRequests} contact requests approved`, time: 'Active', color: 'text-blue-600' }] : []),
                            ].slice(0, 4).map((item, i) => (
                                <div key={i} className="flex items-center gap-3 px-4 py-3">
                                    <span className={`${item.color} text-sm`}>{item.icon}</span>
                                    <span className="text-sm text-gray-700 dark:text-gray-200 flex-1">{item.text}</span>
                                    <span className="text-[10px] text-gray-400">{item.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default UserOverview;
