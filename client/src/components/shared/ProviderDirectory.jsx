import { useQuery } from '@tanstack/react-query';
import { MapPin, Phone, Loader2, Award } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { providerAPI } from '../../api/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// Reusable public directory for a given ServiceProvider type (kazi / counselor).
const ProviderDirectory = ({ serviceType, title, subtitle, Icon }) => {
    const { data: providers = [], isLoading } = useQuery({
        queryKey: ['providers', serviceType],
        queryFn: async () => { const r = await providerAPI.getAll({ serviceType }); return r.data; }
    });

    return (
        <>
            <Helmet><title>{title} - Nikah</title></Helmet>
            <div className="min-h-screen bg-muted/30 pt-20 pb-12">
                <div className="container-custom">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-3">
                            <Icon className="h-3.5 w-3.5" /> {title}
                        </span>
                        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">{title}</h1>
                        <p className="text-muted-foreground">{subtitle}</p>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                    ) : providers.length === 0 ? (
                        <p className="text-center text-muted-foreground py-16">No {title.toLowerCase()} listed yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {providers.map((p) => (
                                <Card key={p._id} className="card-lift">
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Avatar className="h-12 w-12">
                                                {p.photoURL ? <AvatarImage src={p.photoURL} alt={p.name} /> : null}
                                                <AvatarFallback className="bg-emerald-500/10 text-emerald-600"><Icon className="h-5 w-5" /></AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <h3 className="font-semibold text-foreground truncate">{p.name}</h3>
                                                    {p.verified && <Badge className="bg-emerald-600 text-white text-[10px] gap-0.5"><Award className="h-2.5 w-2.5" />Verified</Badge>}
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">{p.title}{p.organization ? ` · ${p.organization}` : ''}</p>
                                            </div>
                                        </div>
                                        {p.bio && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{p.bio}</p>}
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                            {p.city && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{p.city}</span>}
                                            {p.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{p.phone}</span>}
                                            {p.fee > 0 && <span>৳{p.fee}</span>}
                                        </div>
                                        {p.specialties?.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-3">
                                                {p.specialties.map((s, i) => <Badge key={i} variant="outline" className="text-[10px]">{s}</Badge>)}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProviderDirectory;
