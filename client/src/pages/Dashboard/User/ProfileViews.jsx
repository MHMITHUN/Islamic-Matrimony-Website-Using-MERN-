import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Eye, User as UserIcon, MapPin, Briefcase, TrendingUp, Users, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { profileViewAPI } from '../../../api/api';
import PageHeader from '../../../components/dashboard/PageHeader';
import StatCard from '../../../components/dashboard/StatCard';
import EmptyState from '../../../components/dashboard/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffH = Math.floor((now - d) / 3600000);
    if (diffH < 1) return 'Just now';
    if (diffH < 24) return `${diffH}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const ProfileViews = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['profileViews'],
        queryFn: async () => { const res = await profileViewAPI.getMyViews(); return res.data; },
    });

    const views = data?.views || [];
    const totalViews = data?.totalViews || 0;
    const uniqueViewers = data?.uniqueViewers || 0;

    return (
        <>
            <Helmet><title>Profile Views - Nikah Matrimony</title></Helmet>
            <div className="space-y-6">
                <PageHeader title="Profile Views" description="See who viewed your profile." icon={Eye} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatCard icon={TrendingUp} label="Total Views" value={totalViews} tint="bg-emerald-500/10 text-emerald-600" />
                    <StatCard icon={Users} label="Unique Viewers" value={uniqueViewers} tint="bg-sky-500/10 text-sky-600" />
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
                ) : views.length === 0 ? (
                    <EmptyState icon={Eye} title="No views yet" description="When someone views your profile, it will appear here." />
                ) : (
                    <Card>
                        <CardContent className="p-2 divide-y divide-border">
                            {views.map((view) => (
                                <div key={view._id} className="flex items-center gap-3 p-3">
                                    <Avatar className="h-10 w-10 rounded-lg">
                                        {view.viewer?.profileImage ? <AvatarImage src={view.viewer.profileImage} alt="" /> : null}
                                        <AvatarFallback className="rounded-lg bg-muted text-muted-foreground"><UserIcon className="h-4 w-4" /></AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground truncate">{view.viewer?.name || 'Anonymous'}</p>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            {view.viewer?.occupation && <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" />{view.viewer.occupation}</span>}
                                            {view.viewer?.permanentDivision && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{view.viewer.permanentDivision}</span>}
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-[10px] text-muted-foreground">{formatTime(view.createdAt)}</p>
                                        {view.viewer?.biodataId && (
                                            <Link to={`/biodata/${view.viewer.biodataId}`} className="text-[10px] text-primary hover:underline">View profile</Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
};

export default ProfileViews;
