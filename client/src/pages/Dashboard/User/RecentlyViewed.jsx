import { Link } from 'react-router-dom';
import { FaTrash, FaEye, FaClock, FaMapMarkerAlt, FaBriefcase, FaHistory } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { useRecentlyViewed } from '../../../hooks/useRecentlyViewed';

const RecentlyViewed = () => {
    const { items, removeItem, clearAll } = useRecentlyViewed();

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    return (
        <>
            <Helmet><title>Recently Viewed - Nikah Matrimony</title></Helmet>
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <FaHistory className="text-emerald-600" /> Recently Viewed
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Profiles you've recently browsed</p>
                    </div>
                    {items.length > 0 && (
                        <button onClick={clearAll} className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium">
                            Clear All
                        </button>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <FaEye className="text-3xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-gray-700 dark:text-gray-200 mb-1">No recently viewed profiles</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Start browsing biodatas to see them here</p>
                        <Link to="/biodatas" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors">
                            Browse Biodatas
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((item) => (
                            <div key={item.biodataId} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors group">
                                <div className="relative h-36 overflow-hidden">
                                    <img
                                        src={item.profileImage || 'https://via.placeholder.com/300x300?text=No+Image'}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                    <div className="absolute top-2 right-2">
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${item.biodataType === 'Male' ? 'bg-blue-500 text-white' : 'bg-pink-500 text-white'}`}>
                                            {item.biodataType}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white/70 text-[10px]">
                                        <FaClock className="text-[8px]" /> {formatTime(item.viewedAt)}
                                    </div>
                                </div>
                                <div className="p-3.5">
                                    <p className="text-[10px] text-gray-400 mb-0.5">ID: #{item.biodataId}</p>
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1.5">{item.name}</h3>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                                        <span className="flex items-center gap-1"><FaBriefcase className="text-[10px]" />{item.occupation}</span>
                                        <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-[10px]" />{item.permanentDivision}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link to={`/biodata/${item.biodataId}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors">
                                            <FaEye className="text-[10px]" /> View
                                        </Link>
                                        <button onClick={() => removeItem(item.biodataId)} className="px-3 py-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                            <FaTrash className="text-xs" />
                                        </button>
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

export default RecentlyViewed;
