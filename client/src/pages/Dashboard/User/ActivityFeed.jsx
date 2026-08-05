import { useQuery } from '@tanstack/react-query';
import { Pencil, Heart, Mail, CheckCircle2, Clock, Activity } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { biodataAPI, favoritesAPI, contactRequestAPI } from '../../../api/api';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import { cn } from '@/lib/utils';

const ActivityFeed = () => {
    const { data: biodata } = useQuery({
        queryKey: ['myBiodata'],
        queryFn: async () => { try { const res = await biodataAPI.getMyBiodata(); return res.data; } catch (e) { if (e.response?.status === 404) return null; throw e; } },
    });
    const { data: favorites = [] } = useQuery({ queryKey: ['myFavorites'], queryFn: async () => { const res = await favoritesAPI.getAll(); return res.data; } });
    const { data: requests = [] } = useQuery({ queryKey: ['myContactRequests'], queryFn: async () => { const res = await contactRequestAPI.getMyRequests(); return res.data; } });

    const activities = [];
    if (biodata) {
        activities.push({ id: 'biodata-created', icon: Pencil, tint: 'bg-emerald-500', title: 'Biodata Created', desc: `Biodata #${biodata.biodataId} was created`, time: biodata.createdAt, date: new Date(biodata.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) });
        if (biodata.updatedAt !== biodata.createdAt) {
            activities.push({ id: 'biodata-updated', icon: Pencil, tint: 'bg-sky-500', title: 'Biodata Updated', desc: 'Profile information was updated', time: biodata.updatedAt, date: new Date(biodata.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) });
        }
    }
    favorites.forEach((fav, i) => activities.push({ id: `fav-${i}`, icon: Heart, tint: 'bg-rose-500', title: 'Added to Favorites', desc: `${fav.name || 'Profile'} #${fav.biodataId}`, time: fav.createdAt, date: new Date(fav.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }));
    requests.forEach((req) => activities.push({ id: `req-${req._id}`, icon: req.status === 'approved' ? CheckCircle2 : Clock, tint: req.status === 'approved' ? 'bg-emerald-500' : 'bg-amber-500', title: req.status === 'approved' ? 'Contact Request Approved' : 'Contact Request Sent', desc: `${req.name || 'Profile'} #${req.biodataId}`, time: req.createdAt, date: new Date(req.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }));

    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    const grouped = activities.reduce((acc, act) => { (acc[act.date] = acc[act.date] || []).push(act); return acc; }, {});

    return (
        <>
            <Helmet><title>Activity Feed - Nikah Matrimony</title></Helmet>
            <div className="space-y-6">
                <PageHeader title="Activity Feed" description="Your recent activity timeline." icon={Activity} />

                {activities.length === 0 ? (
                    <EmptyState icon={Activity} title="No activity yet" description="Your activities will appear here." />
                ) : (
                    <div className="space-y-6">
                        {Object.entries(grouped).map(([date, acts]) => (
                            <div key={date}>
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{date}</h3>
                                <div className="relative pl-7 space-y-3 before:absolute before:left-1.5 before:top-1 before:bottom-1 before:w-px before:bg-border">
                                    {acts.map((act) => (
                                        <div key={act.id} className="relative">
                                            <span className={cn('absolute -left-[26px] top-2 grid place-items-center h-5 w-5 rounded-full ring-4 ring-background text-white', act.tint)}>
                                                <act.icon className="h-2.5 w-2.5" />
                                            </span>
                                            <div className="rounded-xl border bg-card p-3.5 ml-1 hover:border-primary/30 transition-colors">
                                                <p className="text-sm font-semibold text-foreground">{act.title}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{act.desc}</p>
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
