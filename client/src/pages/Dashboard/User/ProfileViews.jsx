import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FaEye, FaUser, FaMapMarkerAlt, FaBriefcase, FaChartLine, FaUsers } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { profileViewAPI } from '../../../api/api';

const ProfileViews = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['profileViews'],
        queryFn: async () => { const res = await profileViewAPI.getMyViews(); return res.data; }
    });

    const views = data?.views || [];
    const totalViews = data?.totalViews || 0;
    const uniqueViewers = data?.uniqueViewers || 0;

    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diffH = Math.floor((now - d) / 3600000);
        if (diffH < 1) return 'Just now';
        if (diffH < 24) return `${diffH}h ago`;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <>
            <Helmet><title>Profile Views - Nikah Matrimony</title></Helmet>
            <div className="space-y-5">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FaEye className="text-emerald-600" /> Profile Views
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">See who viewed your profile</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                        <FaChartLine className="text-emerald-600 text-lg mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalViews}</p>
                        <p className="text-xs text-gray-500">Total Views</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                        <FaUsers className="text-blue-600 text-lg mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{uniqueViewers}</p>
                        <p className="text-xs text-gray-500">Unique Viewers</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12"><div className="spinner-lg"></div></div>
                ) : views.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <FaEye className="text-3xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-gray-700 dark:text-gray-200 mb-1">No views yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">When someone views your profile, it will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {views.map(view => (
                            <div key={view._id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors">
                                {view.viewer?.profileImage ? (
                                    <img src={view.viewer.profileImage} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                ) : (
                                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                        <FaUser className="text-gray-400" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                        {view.viewer?.name || 'Anonymous'}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                        {view.viewer?.occupation && <span className="flex items-center gap-1"><FaBriefcase className="text-[10px]" />{view.viewer.occupation}</span>}
                                        {view.viewer?.permanentDivision && <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-[10px]" />{view.viewer.permanentDivision}</span>}
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-[10px] text-gray-400">{formatTime(view.createdAt)}</p>
                                    {view.viewer?.biodataId && (
                                        <Link to={`/biodata/${view.viewer.biodataId}`} className="text-[10px] text-emerald-600 hover:underline">View profile</Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default ProfileViews;
