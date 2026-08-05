import { Link } from 'react-router-dom';
import { Trash2, Eye, Clock, MapPin, Briefcase, History, ArrowRight } from 'lucide-react';
import { FaMale, FaFemale } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { useRecentlyViewed } from '../../../hooks/useRecentlyViewed';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

const RecentlyViewed = () => {
    const { items, removeItem, clearAll } = useRecentlyViewed();

    return (
        <>
            <Helmet><title>Recently Viewed - Nikah Matrimony</title></Helmet>
            <div className="space-y-6">
                <PageHeader title="Recently Viewed" description="Profiles you've recently browsed." icon={History}>
                    {items.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearAll} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" /> Clear All
                        </Button>
                    )}
                </PageHeader>

                {items.length === 0 ? (
                    <EmptyState icon={Eye} title="No recently viewed profiles" description="Start browsing biodatas to see them here."
                        action={<Button asChild><Link to="/biodatas">Browse Biodatas <ArrowRight className="h-4 w-4" /></Link></Button>} />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((item) => (
                            <Card key={item.biodataId} className="overflow-hidden card-lift hover:border-primary/30 group">
                                <div className="relative h-36 overflow-hidden">
                                    {item.profileImage
                                        ? <img src={item.profileImage} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        : <div className="grid place-items-center h-full w-full bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-950 dark:to-slate-900"><History className="h-8 w-8 text-emerald-300/60" /></div>}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                                    <div className="absolute top-2 right-2">
                                        <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold backdrop-blur', item.biodataType === 'Male' ? 'bg-sky-500/85 text-white' : 'bg-rose-500/85 text-white')}>
                                            {item.biodataType === 'Male' ? <FaMale /> : <FaFemale />}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white/80 text-[10px]"><Clock className="h-2.5 w-2.5" /> {formatTime(item.viewedAt)}</div>
                                </div>
                                <CardContent className="p-3.5">
                                    <p className="text-[10px] text-muted-foreground mb-0.5 tabular-nums">#{item.biodataId}</p>
                                    <h3 className="font-semibold text-foreground text-sm mb-1.5">{item.name}</h3>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                                        <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3 text-primary" />{item.occupation}</span>
                                        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3 text-primary" />{item.permanentDivision}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button asChild size="sm" className="flex-1"><Link to={`/biodata/${item.biodataId}`}><Eye className="h-3.5 w-3.5" /> View</Link></Button>
                                        <Button variant="outline" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeItem(item.biodataId)}><Trash2 className="h-3.5 w-3.5" /></Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default RecentlyViewed;
