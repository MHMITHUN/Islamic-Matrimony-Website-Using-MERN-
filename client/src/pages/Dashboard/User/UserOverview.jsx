import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Pencil, Search, Heart, Mail, Crown, CheckCircle2, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { biodataAPI, favoritesAPI, contactRequestAPI } from '../../../api/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useProfileCompletion } from '../../../hooks/useProfileCompletion';
import ProfileCompleteness from '../../../components/ProfileCompleteness';
import PageHeader from '../../../components/dashboard/PageHeader';
import StatCard from '../../../components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const UserOverview = () => {
    const { user, isPremium } = useAuth();

    const { data: biodata, isLoading: loadingBiodata } = useQuery({
        queryKey: ['myBiodata'],
        queryFn: async () => { try { const res = await biodataAPI.getMyBiodata(); return res.data; } catch (e) { if (e.response?.status === 404) return null; throw e; } },
    });
    const { data: favorites = [] } = useQuery({ queryKey: ['myFavorites'], queryFn: async () => { const res = await favoritesAPI.getAll(); return res.data; } });
    const { data: requests = [] } = useQuery({ queryKey: ['myContactRequests'], queryFn: async () => { const res = await contactRequestAPI.getMyRequests(); return res.data; } });

    const completion = useProfileCompletion(biodata);
    const approvedRequests = requests.filter(r => r.status === 'approved').length;
    const pendingRequests = requests.filter(r => r.status === 'pending').length;

    const quickActions = [
        { to: '/dashboard/edit-biodata', icon: Pencil, label: biodata ? 'Edit Biodata' : 'Create Biodata', tint: 'bg-emerald-500/10 text-emerald-600' },
        { to: '/biodatas', icon: Search, label: 'Browse Biodatas', tint: 'bg-sky-500/10 text-sky-600' },
        { to: '/dashboard/favorites', icon: Heart, label: 'My Favorites', tint: 'bg-rose-500/10 text-rose-600' },
        { to: '/dashboard/contact-requests', icon: Mail, label: 'Contact Requests', tint: 'bg-purple-500/10 text-purple-600' },
    ];

    const activity = [
        { icon: Pencil, text: 'Biodata created/updated', time: biodata?.updatedAt ? new Date(biodata.updatedAt).toLocaleDateString() : 'N/A', tint: 'text-emerald-600' },
        ...(favorites.length > 0 ? [{ icon: Heart, text: `${favorites.length} profiles favorited`, time: 'Active', tint: 'text-rose-500' }] : []),
        ...(approvedRequests > 0 ? [{ icon: CheckCircle2, text: `${approvedRequests} contact requests approved`, time: 'Active', tint: 'text-sky-600' }] : []),
    ].slice(0, 4);

    return (
        <>
            <Helmet><title>Dashboard - Nikah Matrimony</title></Helmet>
            <div className="space-y-6">
                <PageHeader title={`Welcome back, ${user?.displayName?.split(' ')[0] || 'User'}`} description="Here's an overview of your account." icon={Sparkles} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Profile completion */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-2"><CardTitle className="text-base">Profile Completion</CardTitle></CardHeader>
                        <CardContent>
                            {loadingBiodata ? (
                                <div className="h-24 bg-muted rounded-lg animate-pulse" />
                            ) : biodata ? (
                                <ProfileCompleteness {...completion} />
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-muted-foreground text-sm mb-3">You haven't created a biodata yet</p>
                                    <Button asChild><Link to="/dashboard/edit-biodata"><Pencil className="h-4 w-4" /> Create Biodata</Link></Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Account status */}
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-base">Account Status</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Premium</span>
                                {isPremium
                                    ? <Badge variant="gold" className="gap-1"><Crown className="h-3 w-3" /> Active</Badge>
                                    : <span className="text-xs text-muted-foreground">Standard</span>}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Biodata</span>
                                {biodata
                                    ? <Badge variant="success" className="gap-1"><CheckCircle2 className="h-3 w-3" /> Created</Badge>
                                    : <span className="text-xs text-muted-foreground">Not created</span>}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Biodata ID</span>
                                <span className="text-xs font-mono text-foreground">#{biodata?.biodataId || '---'}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={Heart} label="Favorites" value={favorites.length} tint="bg-rose-500/10 text-rose-600" />
                    <StatCard icon={Mail} label="Contact Requests" value={requests.length} tint="bg-purple-500/10 text-purple-600" />
                    <StatCard icon={CheckCircle2} label="Approved" value={approvedRequests} tint="bg-emerald-500/10 text-emerald-600" />
                    <StatCard icon={Clock} label="Pending" value={pendingRequests} tint="bg-amber-500/10 text-amber-600" />
                </div>

                {/* Quick actions */}
                <div>
                    <h2 className="text-sm font-bold text-foreground mb-3">Quick Actions</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {quickActions.map((action, i) => (
                            <Link key={i} to={action.to} className="group flex items-center gap-3 p-4 rounded-xl border bg-card hover:border-primary/30 hover:shadow-premium transition-all">
                                <span className={`grid place-items-center h-9 w-9 rounded-lg shrink-0 transition-transform group-hover:scale-110 ${action.tint}`}><action.icon className="h-4 w-4" /></span>
                                <span className="text-sm font-medium text-foreground">{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent activity */}
                {biodata && (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-bold text-foreground">Recent Activity</h2>
                            <Link to="/dashboard/activity" className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
                        </div>
                        <Card>
                            <CardContent className="p-0 divide-y divide-border">
                                {activity.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 px-4 py-3">
                                        <span className={`shrink-0 ${item.tint}`}><item.icon className="h-4 w-4" /></span>
                                        <span className="text-sm text-foreground flex-1">{item.text}</span>
                                        <span className="text-[10px] text-muted-foreground">{item.time}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </>
    );
};

export default UserOverview;
