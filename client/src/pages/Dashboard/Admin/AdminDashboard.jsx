import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaUsers, FaUserTie, FaHeart, FaChartLine, FaVenus, FaMars, FaTrophy } from 'react-icons/fa';
import { analyticsAPI } from '../../../api/api';
import { useLanguage } from '../../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const { t } = useLanguage();
    const [stats, setStats] = useState(null);
    const [userGrowth, setUserGrowth] = useState([]);
    const [locationStats, setLocationStats] = useState([]);
    const [ageDistribution, setAgeDistribution] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchAnalytics(); }, []);

    const fetchAnalytics = async () => {
        try {
            const [statsRes, growthRes, locationRes, ageRes, activityRes] = await Promise.all([
                analyticsAPI.getStats(), analyticsAPI.getUserGrowth(), analyticsAPI.getLocationStats(), analyticsAPI.getAgeDistribution(), analyticsAPI.getRecentActivity()
            ]);
            setStats(statsRes.data); setUserGrowth(growthRes.data); setLocationStats(locationRes.data.slice(0, 6)); setAgeDistribution(ageRes.data); setRecentActivity(activityRes.data);
        } catch (error) { toast.error(t('toast.analyticsFailed')); } finally { setLoading(false); }
    };

    const COLORS = ['#059669', '#0d9488', '#0891b2', '#2563eb', '#4f46e5', '#7c3aed'];

    const StatCard = ({ icon, label, value, color, bgColor, trend }) => (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors">
            <div className="flex items-start justify-between">
                <div className="flex-1"><p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-1.5">{label}</p><h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-0.5">{value?.toLocaleString() || 0}</h3>{trend && <p className="text-xs text-emerald-600 flex items-center gap-1"><FaChartLine className="text-[9px]" /><span>{trend}</span></p>}</div>
                <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center text-lg ${color}`}>{icon}</div>
            </div>
        </div>
    );

    if (loading) return <div className="flex items-center justify-center py-20"><div className="text-center"><div className="spinner-lg mx-auto mb-3"></div><p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('admin.dashboard.loading')}</p></div></div>;

    const genderData = [{ name: 'Male', value: stats?.maleCount || 0, color: '#3b82f6' }, { name: 'Female', value: stats?.femaleCount || 0, color: '#ec4899' }];

    return (<>
        <Helmet><title>{t('admin.dashboard.heading')}</title></Helmet>
        <div className="space-y-6">
            <div><h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('admin.dashboard.heading')}</h1><p className="text-gray-500 dark:text-gray-400 text-sm">{t('admin.dashboard.subtitle')}</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<FaUsers />} label={t('admin.dashboard.totalUsers')} value={stats?.totalUsers} color="text-emerald-600" bgColor="bg-emerald-50 dark:bg-emerald-900/20" />
                <StatCard icon={<FaUserTie />} label={t('admin.dashboard.premiumMembers')} value={stats?.totalPremiumUsers} color="text-amber-600" bgColor="bg-amber-50 dark:bg-amber-900/20" />
                <StatCard icon={<FaHeart />} label={t('admin.dashboard.contactRequests')} value={stats?.totalContactRequests} color="text-pink-600" bgColor="bg-pink-50 dark:bg-pink-900/20" />
                <StatCard icon={<FaTrophy />} label={t('admin.dashboard.successStories')} value={stats?.totalSuccessStories} color="text-teal-600" bgColor="bg-teal-50 dark:bg-teal-900/20" trend={`${stats?.successRate}% success rate`} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"><h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">{t('admin.dashboard.userGrowth')}</h3><ResponsiveContainer width="100%" height={280}><AreaChart data={userGrowth}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Legend /><Area type="monotone" dataKey="total" stroke="#059669" fill="#059669" fillOpacity={0.1} name={t('admin.dashboard.totalUsers')} /><Area type="monotone" dataKey="premium" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} name={t('admin.dashboard.premiumUsers')} /></AreaChart></ResponsiveContainer></div>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"><h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">{t('admin.dashboard.genderDist')}</h3><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={genderData} cx="50%" cy="50%" labelLine={false} outerRadius={90} dataKey="value">{genderData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="flex items-center justify-center gap-5 mt-3 text-sm"><div className="flex items-center gap-1.5"><FaMars className="text-blue-500 text-xs" /><span className="text-gray-600 dark:text-gray-300">{stats?.maleCount} {t('admin.dashboard.males')}</span></div><div className="flex items-center gap-1.5"><FaVenus className="text-pink-500 text-xs" /><span className="text-gray-600 dark:text-gray-300">{stats?.femaleCount} {t('admin.dashboard.females')}</span></div></div></div>
            </div>
        </div>
    </>);
};

export default AdminDashboard;
