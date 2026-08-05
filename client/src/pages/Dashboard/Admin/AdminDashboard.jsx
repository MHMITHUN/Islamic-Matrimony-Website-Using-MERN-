import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Crown, Heart, Trophy, Loader2, TrendingUp } from 'lucide-react';
import { FaMars, FaVenus } from 'react-icons/fa';
import { analyticsAPI } from '../../../api/api';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useTheme } from '../../../contexts/ThemeContext';
import PageHeader from '../../../components/dashboard/PageHeader';
import StatCard from '../../../components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const { t } = useLanguage();
    const { isDark } = useTheme();
    const [stats, setStats] = useState(null);
    const [userGrowth, setUserGrowth] = useState([]);
    const [genderState, setGenderState] = useState({ male: 0, female: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchAnalytics(); }, []);

    const fetchAnalytics = async () => {
        try {
            const [statsRes, growthRes, locationRes, ageRes, activityRes] = await Promise.all([
                analyticsAPI.getStats(), analyticsAPI.getUserGrowth(), analyticsAPI.getLocationStats(), analyticsAPI.getAgeDistribution(), analyticsAPI.getRecentActivity(),
            ]);
            setStats(statsRes.data);
            setUserGrowth(growthRes.data);
            setGenderState({ male: statsRes.data?.maleCount || 0, female: statsRes.data?.femaleCount || 0 });
        } catch (error) {
            toast.error(t('toast.analyticsFailed'));
        } finally {
            setLoading(false);
        }
    };

    const axisColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#1e293b' : '#e5e7eb';
    const tooltipStyle = {
        backgroundColor: isDark ? 'hsl(166 28% 7%)' : '#fff',
        border: `1px solid ${gridColor}`,
        borderRadius: 12,
        fontSize: 12,
        color: isDark ? '#f1f5f9' : '#0f172a',
    };

    const genderData = [
        { name: 'Male', value: genderState.male, color: '#3b82f6' },
        { name: 'Female', value: genderState.female, color: '#ec4899' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center"><Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-3" /><p className="text-muted-foreground text-sm font-medium">{t('admin.dashboard.loading')}</p></div>
            </div>
        );
    }

    return (
        <>
            <Helmet><title>{t('admin.dashboard.heading')}</title></Helmet>
            <div className="space-y-6">
                <PageHeader title={t('admin.dashboard.heading')} description={t('admin.dashboard.subtitle')} icon={TrendingUp} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={Users} label={t('admin.dashboard.totalUsers')} value={stats?.totalUsers?.toLocaleString() || 0} tint="bg-emerald-500/10 text-emerald-600" />
                    <StatCard icon={Crown} label={t('admin.dashboard.premiumMembers')} value={stats?.totalPremiumUsers?.toLocaleString() || 0} tint="bg-amber-500/10 text-amber-600" />
                    <StatCard icon={Heart} label={t('admin.dashboard.contactRequests')} value={stats?.totalContactRequests?.toLocaleString() || 0} tint="bg-rose-500/10 text-rose-600" />
                    <StatCard icon={Trophy} label={t('admin.dashboard.successStories')} value={stats?.totalSuccessStories?.toLocaleString() || 0} hint={`${stats?.successRate}% success rate`} tint="bg-teal-500/10 text-teal-600" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <Card className="lg:col-span-2">
                        <CardHeader><CardTitle className="text-base">{t('admin.dashboard.userGrowth')}</CardTitle></CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={userGrowth} margin={{ left: -16, right: 8, top: 4 }}>
                                    <defs>
                                        <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#047857" stopOpacity={0.35} />
                                            <stop offset="95%" stopColor="#047857" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="gPremium" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: axisColor }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 12, fill: axisColor }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Area type="monotone" dataKey="total" stroke="#047857" strokeWidth={2.5} fill="url(#gTotal)" name={t('admin.dashboard.totalUsers')} />
                                    <Area type="monotone" dataKey="premium" stroke="#f59e0b" strokeWidth={2.5} fill="url(#gPremium)" name={t('admin.dashboard.premiumUsers')} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="text-base">{t('admin.dashboard.genderDist')}</CardTitle></CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={genderData} cx="50%" cy="50%" labelLine={false} outerRadius={85} innerRadius={50} paddingAngle={3} dataKey="value">
                                        {genderData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} stroke="none" />))}
                                    </Pie>
                                    <Tooltip contentStyle={tooltipStyle} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex items-center justify-center gap-5 mt-2 text-sm">
                                <div className="flex items-center gap-1.5"><FaMars className="text-blue-500 text-xs" /><span className="text-muted-foreground">{stats?.maleCount} {t('admin.dashboard.males')}</span></div>
                                <div className="flex items-center gap-1.5"><FaVenus className="text-pink-500 text-xs" /><span className="text-muted-foreground">{stats?.femaleCount} {t('admin.dashboard.females')}</span></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
