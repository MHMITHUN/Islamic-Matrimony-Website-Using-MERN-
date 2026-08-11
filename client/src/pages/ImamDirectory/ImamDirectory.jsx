import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, MapPin, Award, Loader2, Phone } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { providerAPI } from '../../api/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const ImamDirectory = () => {
    const { data: imams = [], isLoading } = useQuery({
        queryKey: ['imamDirectory'],
        queryFn: async () => { const r = await providerAPI.getAll({ serviceType: 'imam' }); return r.data; }
    });

    return (
        <>
            <Helmet><title>Imam Directory - Nikah</title></Helmet>
            <div className="min-h-screen bg-muted/30 pt-20 pb-12">
                <div className="container-custom">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-3">
                            <ShieldCheck className="h-3.5 w-3.5" /> Tazkiya Partners
                        </span>
                        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Verified Imams</h1>
                        <p className="text-muted-foreground">Imams who can attest a member's character and deen — the highest-weighted Tazkiya endorsement.</p>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                    ) : imams.length === 0 ? (
                        <p className="text-center text-muted-foreground py-16">No imams listed yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {imams.map((im) => (
                                <Card key={im._id} className="card-lift">
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Avatar className="h-12 w-12">
                                                {im.photoURL ? <AvatarImage src={im.photoURL} alt={im.name} /> : null}
                                                <AvatarFallback className="bg-emerald-500/10 text-emerald-600"><ShieldCheck className="h-5 w-5" /></AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <h3 className="font-semibold text-foreground truncate">{im.name}</h3>
                                                    {im.verified && <Badge className="bg-emerald-600 text-white text-[10px] gap-0.5"><Award className="h-2.5 w-2.5" />Verified</Badge>}
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">{im.title}{im.organization ? ` · ${im.organization}` : ''}</p>
                                            </div>
                                        </div>
                                        {im.bio && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{im.bio}</p>}
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                            {im.city && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{im.city}</span>}
                                            {im.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{im.phone}</span>}
                                            {im.yearsExperience > 0 && <span>{im.yearsExperience} yrs experience</span>}
                                        </div>
                                        {im.specialties?.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-3">
                                                {im.specialties.map((s, i) => <Badge key={i} variant="outline" className="text-[10px]">{s}</Badge>)}
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

export default ImamDirectory;
