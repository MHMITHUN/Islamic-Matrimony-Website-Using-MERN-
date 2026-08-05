import { useQuery } from '@tanstack/react-query';
import { FaEdit, FaHeart, FaEnvelope, FaCheckCircle, FaRing, FaClock, FaStream } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { biodataAPI, favoritesAPI, contactRequestAPI } from '../../../api/api';

const ActivityFeed = () => {
    const { data: biodata } = useQuery({
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

    const activities = [];

    if (biodata) {
        activities.push({
            id: 'biodata-created',
            icon: <FaEdit />,
            color: 'bg-emerald-600',
            title: 'Biodata Created',
            desc: `Biodata #${biodata.biodataId} was created`,
            time: biodata.createdAt,
            date: new Date(biodata.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        });

        if (biodata.updatedAt !== biodata.createdAt) {
            activities.push({
                id: 'biodata-updated',
                icon: <FaEdit />,
                color: 'bg-blue-600',
                title: 'Biodata Updated',
                desc: 'Profile information was updated',
                time: biodata.updatedAt,
                date: new Date(biodata.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            });
        }
    }

    favorites.forEach((fav, i) => {
        activities.push({
            id: `fav-${i}`,
            icon: <FaHeart />,
            color: 'bg-pink-600',
            title: 'Added to Favorites',
            desc: `${fav.name || 'Profile'} #${fav.biodataId}`,
            time: fav.createdAt,
            date: new Date(fav.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        });
    });

    requests.forEach((req) => {
        activities.push({
            id: `req-${req._id}`,
            icon: req.status === 'approved' ? <FaCheckCircle /> : <FaClock />,
            color: req.status === 'approved' ? 'bg-emerald-600' : 'bg-amber-600',
            title: req.status === 'approved' ? 'Contact Request Approved' : 'Contact Request Sent',
            desc: `${req.name || 'Profile'} #${req.biodataId}`,
            time: req.createdAt,
            date: new Date(req.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        });
    });

    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    const grouped = activities.reduce((acc, act) => {
        if (!acc[act.date]) acc[act.date] = [];
        acc[act.date].push(act);
        return acc;
    }, {});

    return (
        <>
            <Helmet><title>Activity Feed - Nikah Matrimony</title></Helmet>
            <div className="space-y-5">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FaStream className="text-emerald-600" /> Activity Feed
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Your recent activity timeline</p>
                </div>

                {activities.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <FaStream className="text-3xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-gray-700 dark:text-gray-200 mb-1">No activity yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Your activities will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(grouped).map(([date, acts]) => (
                            <div key={date}>
                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">{date}</h3>
                                <div className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-700 space-y-3">
                                    {acts.map((act) => (
                                        <div key={act.id} className="relative">
                                            <div className={`absolute -left-[25px] w-4 h-4 ${act.color} rounded-full flex items-center justify-center`}>
                                                <span className="text-white text-[8px]">{act.icon}</span>
                                            </div>
                                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 ml-2">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{act.title}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{act.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default ActivityFeed;
