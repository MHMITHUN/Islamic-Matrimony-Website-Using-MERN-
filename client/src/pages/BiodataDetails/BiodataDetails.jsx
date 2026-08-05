import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Heart, Phone, Mail, MapPin, Briefcase, User, CalendarDays, Ruler, Scale,
    Star, Lock, Crown, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, Loader2,
} from 'lucide-react';
import { FaMale, FaFemale } from 'react-icons/fa';
import { biodataAPI, favoritesAPI } from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed';
import { profileViewAPI } from '../../api/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const BiodataDetails = () => {
    const { id } = useParams();
    const { user, isPremium } = useAuth();
    const { t } = useLanguage();
    const queryClient = useQueryClient();
    const [isFavorited, setIsFavorited] = useState(false);
    const { addView } = useRecentlyViewed();

    const translateEnum = (type, value) => {
        if (!value) return t('biodata.details.notSpecified');
        const map = {
            occupation: { 'Student': 'student', 'Job': 'job', 'Business': 'business', 'Housewife': 'housewife', 'Teacher': 'teacher', 'Doctor': 'doctor', 'Engineer': 'engineer', 'Other': 'other' },
            race: { 'Fair': 'fair', 'Light Brown': 'lightBrown', 'Brown': 'brown', 'Dark': 'dark' },
            division: { 'Dhaka': 'dhaka', 'Chattagram': 'chattagram', 'Rangpur': 'rangpur', 'Barisal': 'barisal', 'Khulna': 'khulna', 'Mymensingh': 'mymensingh', 'Sylhet': 'sylhet' },
            biodataType: { 'Male': 'biodata.filters.male', 'Female': 'biodata.filters.female' },
        };
        if (type === 'biodataType') {
            const key = map.biodataType[value];
            return key ? t(key) : value;
        }
        const key = map[type]?.[value];
        return key ? t(`enum.${type}.${key}`) : value;
    };

    const { data: biodata, isLoading, error } = useQuery({
        queryKey: ['biodata', id],
        queryFn: async () => { const response = await biodataAPI.getById(id); return response.data; },
    });

    const { data: similarBiodatas = [] } = useQuery({
        queryKey: ['similarBiodatas', id],
        queryFn: async () => { const response = await biodataAPI.getSimilar(id); return response.data; },
        enabled: !!biodata,
    });

    useQuery({
        queryKey: ['isFavorited', id],
        queryFn: async () => { const response = await favoritesAPI.check(id); setIsFavorited(response.data.isFavorited); return response.data; },
        enabled: !!user,
    });

    useEffect(() => {
        if (biodata) {
            // Add to local Recently Viewed for the current user's browser
            addView(biodata);

            // Record Profile View in backend for the viewed user's dashboard
            if (user && biodata.userEmail !== user.email) {
                profileViewAPI.record(biodata.biodataId).catch((err) => console.log('Error recording view:', err));
            }
        }
    }, [biodata, user, addView]);

    const addToFavorites = useMutation({
        mutationFn: () => favoritesAPI.add(parseInt(id)),
        onSuccess: () => { setIsFavorited(true); queryClient.invalidateQueries(['favorites']); toast.success(t('toast.addToFavorites')); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); },
    });

    if (isLoading) {
        return (
            <div className="min-h-[70vh] grid place-items-center bg-background pt-16">
                <div className="text-center"><Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" /><p className="mt-3 text-muted-foreground text-sm">{t('biodata.details.loading')}</p></div>
            </div>
        );
    }

    if (error || !biodata) {
        return (
            <div className="min-h-[70vh] grid place-items-center bg-background pt-16 px-4">
                <Card className="max-w-md text-center"><CardContent className="pt-10 flex flex-col items-center">
                    <div className="grid place-items-center h-16 w-16 rounded-full bg-muted text-muted-foreground mb-4"><User className="h-7 w-7" /></div>
                    <h2 className="text-xl font-bold text-foreground mb-2">{t('biodata.details.notFound')}</h2>
                    <p className="text-muted-foreground text-sm mb-5">{t('biodata.details.notFoundDesc')}</p>
                    <Button asChild><Link to="/biodatas"><ArrowLeft className="h-4 w-4" /> {t('biodata.details.browseBiodatas')}</Link></Button>
                </CardContent></Card>
            </div>
        );
    }

    const canViewContact = biodata.canViewContact || isPremium;
    const isOwnBiodata = biodata.userEmail === user?.email;
    const isMale = biodata.biodataType === 'Male';

    const InfoItem = ({ icon: Icon, label, value }) => (
        <div className="flex items-start gap-3 rounded-xl border border-border bg-card/50 p-3.5 hover:border-primary/30 hover:bg-primary/[0.03] transition-colors">
            <span className="grid place-items-center h-9 w-9 rounded-lg bg-primary/10 text-primary shrink-0"><Icon className="h-4 w-4" /></span>
            <div className="min-w-0">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
                <p className="font-semibold text-foreground text-sm mt-0.5 truncate">{value || t('biodata.details.notSpecified')}</p>
            </div>
        </div>
    );

    const Section = ({ title, icon: Icon, children, accent = 'text-primary' }) => (
        <Card>
            <CardContent className="p-5 md:p-6">
                <h2 className="flex items-center gap-2.5 text-base font-bold font-heading text-foreground mb-4">
                    <Icon className={cn('h-5 w-5', accent)} /> {title}
                </h2>
                {children}
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-muted/30 pt-20 pb-12">
            <div className="container-custom">
                <Button asChild variant="ghost" size="sm" className="mb-5 -ml-2 text-muted-foreground hover:text-foreground">
                    <Link to="/biodatas"><ArrowLeft className="h-4 w-4" /> {t('biodata.details.backToBiodatas')}</Link>
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-5">
                        {/* Hero */}
                        <Card className="overflow-hidden">
                            <div className="relative h-32 bg-gradient-brand">
                                <div className="absolute inset-0 bg-dots opacity-[0.12]" />
                            </div>
                            <CardContent className="relative px-6 pb-6">
                                <div className="flex flex-col md:flex-row gap-5">
                                    <div className="relative -mt-14 md:-mt-12 shrink-0">
                                        <Avatar className="h-32 w-32 md:h-36 md:w-36 rounded-2xl border-4 border-background shadow-premium-lg">
                                            {biodata.profileImage ? <AvatarImage src={biodata.profileImage} alt="Profile" /> : null}
                                            <AvatarFallback className="rounded-2xl bg-primary/10 text-primary"><User className="h-10 w-10" /></AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="flex-1 text-center md:text-left pt-2 md:pt-4">
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                                            <Badge variant="outline" className={cn('gap-1', isMale ? 'border-sky-500/30 bg-sky-500/10 text-sky-600' : 'border-rose-500/30 bg-rose-500/10 text-rose-600')}>
                                                {isMale ? <FaMale /> : <FaFemale />} {translateEnum('biodataType', biodata.biodataType)}
                                            </Badge>
                                            {biodata.isPremium && (
                                                <Badge className="gap-1 bg-gradient-gold border-transparent text-white shadow-sm">
                                                    <Crown className="h-3.5 w-3.5" /> {t('biodata.details.premium')}
                                                </Badge>
                                            )}
                                            <Badge variant="secondary" className="text-xs font-semibold tabular-nums">
                                                ID: {biodata.biodataId}
                                            </Badge>
                                        </div>
                                        <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-1.5">{biodata.name}</h1>
                                        <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-1.5 text-sm"><Briefcase className="h-3.5 w-3.5 text-primary" /> {translateEnum('occupation', biodata.occupation)}</p>
                                        <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-1.5 text-sm mt-0.5"><MapPin className="h-3.5 w-3.5 text-primary" /> {translateEnum('division', biodata.permanentDivision)}</p>
                                        <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-4">
                                            {!isOwnBiodata && (
                                                <Button onClick={() => addToFavorites.mutate()} disabled={isFavorited || addToFavorites.isLoading} variant={isFavorited ? 'secondary' : 'default'} className={cn(isFavorited && 'text-rose-600')}>
                                                    <Heart className={cn('h-4 w-4', isFavorited && 'fill-current')} /> {isFavorited ? t('biodata.details.favorited') : t('biodata.details.addToFavorites')}
                                                </Button>
                                            )}
                                            {!canViewContact && !isOwnBiodata && (
                                                <Button asChild variant="gold">
                                                    <Link to={`/checkout/${biodata.biodataId}`}><Lock className="h-4 w-4" /> {t('biodata.details.requestContact')}</Link>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Section title={t('biodata.details.basicInfo')} icon={User}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <InfoItem icon={CalendarDays} label={t('biodata.details.dateOfBirth')} value={new Date(biodata.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
                                <InfoItem icon={User} label={t('biodata.details.age')} value={`${biodata.age} ${t('biodata.details.years')}`} />
                                <InfoItem icon={Ruler} label={t('biodata.details.height')} value={biodata.height} />
                                <InfoItem icon={Scale} label={t('biodata.details.weight')} value={biodata.weight} />
                                <InfoItem icon={Briefcase} label={t('biodata.details.occupation')} value={translateEnum('occupation', biodata.occupation)} />
                                <InfoItem icon={Star} label={t('biodata.details.race')} value={translateEnum('race', biodata.race)} />
                            </div>
                        </Section>

                        <Section title={t('biodata.details.familyInfo')} icon={Heart} accent="text-rose-500">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <InfoItem icon={User} label={t('biodata.details.fathersName')} value={biodata.fathersName} />
                                <InfoItem icon={User} label={t('biodata.details.mothersName')} value={biodata.mothersName} />
                            </div>
                        </Section>

                        <Section title={t('biodata.details.location')} icon={MapPin} accent="text-sky-500">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <InfoItem icon={MapPin} label={t('biodata.details.permanentDivision')} value={translateEnum('division', biodata.permanentDivision)} />
                                <InfoItem icon={MapPin} label={t('biodata.details.presentDivision')} value={translateEnum('division', biodata.presentDivision)} />
                            </div>
                        </Section>

                        <Section title={t('biodata.details.expectedPartner')} icon={Sparkles} accent="text-gold">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <InfoItem icon={User} label={t('biodata.details.expectedAge')} value={biodata.expectedPartnerAge} />
                                <InfoItem icon={Ruler} label={t('biodata.details.expectedHeight')} value={biodata.expectedPartnerHeight} />
                                <InfoItem icon={Scale} label={t('biodata.details.expectedWeight')} value={biodata.expectedPartnerWeight} />
                            </div>
                        </Section>

                        <Section title={t('biodata.details.contactInfo')} icon={Phone} accent="text-purple-500">
                            {canViewContact ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <InfoItem icon={Mail} label={t('biodata.details.email')} value={biodata.userEmail} />
                                    <InfoItem icon={Phone} label={t('biodata.details.mobile')} value={biodata.mobileNumber} />
                                </div>
                            ) : (
                                <div className="text-center py-8 rounded-xl border border-dashed border-border bg-muted/30">
                                    <div className="grid place-items-center h-12 w-12 rounded-full bg-muted text-muted-foreground mx-auto mb-3"><Lock className="h-5 w-5" /></div>
                                    <h3 className="text-base font-bold text-foreground mb-1">{t('biodata.details.contactHidden')}</h3>
                                    <p className="text-muted-foreground text-sm mb-4 max-w-sm mx-auto">{t('biodata.details.contactHiddenDesc')}</p>
                                    <Button asChild><Link to={`/checkout/${biodata.biodataId}`}><CheckCircle2 className="h-4 w-4" /> {t('biodata.details.requestContactPrice')}</Link></Button>
                                </div>
                            )}
                        </Section>
                    </div>

                    {/* Sidebar: similar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardContent className="p-5">
                                <h2 className="flex items-center gap-2 text-base font-bold font-heading text-foreground mb-4">
                                    <span className="grid place-items-center h-7 w-7 rounded-lg bg-primary/10 text-primary"><Heart className="h-4 w-4" /></span>
                                    {t('biodata.details.similarProfiles')}
                                </h2>
                                {similarBiodatas.length === 0 ? (
                                    <div className="text-center py-6">
                                        <div className="grid place-items-center h-12 w-12 rounded-full bg-muted text-muted-foreground mx-auto mb-3"><User className="h-5 w-5" /></div>
                                        <p className="text-muted-foreground text-sm">{t('biodata.details.noSimilar')}</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {similarBiodatas.map((similar) => (
                                            <Link key={similar._id} to={`/biodata/${similar.biodataId}`} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/[0.03] transition-colors">
                                                <Avatar className="h-11 w-11 rounded-lg">
                                                    {similar.profileImage ? <AvatarImage src={similar.profileImage} alt="Profile" /> : null}
                                                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs"><User className="h-4 w-4" /></AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] text-muted-foreground tabular-nums">ID: {similar.biodataId}</p>
                                                    <p className="font-semibold text-foreground text-sm truncate">{translateEnum('occupation', similar.occupation)}</p>
                                                    <p className="text-xs text-muted-foreground">{translateEnum('division', similar.permanentDivision)} • {similar.age} yrs</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-5 pt-5 border-t border-border">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <ShieldCheck className="h-4 w-4 text-emerald-500" /> All profiles are verified
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BiodataDetails;
