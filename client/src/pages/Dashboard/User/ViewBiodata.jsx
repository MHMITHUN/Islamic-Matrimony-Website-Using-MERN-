import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Pencil, Crown, MapPin, Briefcase, CalendarDays, Ruler, Scale, Star, Clock, Loader2, Heart, FileText, Moon, BookOpen, BadgeCheck, ShieldCheck } from 'lucide-react';
import { biodataAPI } from '../../../api/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import PageHeader from '../../../components/dashboard/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import VerifiedBadge from '../../../components/shared/VerifiedBadge';

const verificationMethods = [
    { value: 'nid', label: 'NID (National ID)' },
    { value: 'imam_endorsement', label: 'Imam Endorsement' },
    { value: 'community_leader', label: 'Community Leader Reference' },
];

const InfoItem = ({ icon: Icon, label, value, tint = 'bg-primary/10 text-primary', t }) => (
    <div className="flex items-start gap-3 rounded-xl border bg-card/50 p-3.5 hover:border-primary/30 transition-colors">
        <span className={cn('grid place-items-center h-9 w-9 rounded-lg shrink-0', tint)}><Icon className="h-4 w-4" /></span>
        <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="font-semibold text-foreground break-words mt-0.5">{value || (t ? t('dashboard.viewBiodata.na') : 'N/A')}</p>
        </div>
    </div>
);

const Section = ({ title, icon: Icon, children, accent = 'text-primary' }) => (
    <div>
        <h3 className="flex items-center gap-2 font-heading font-bold text-foreground mb-3"><Icon className={cn('h-5 w-5', accent)} /> {title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">{children}</div>
    </div>
);

const ViewBiodata = () => {
    const { isPremium } = useAuth();
    const { t } = useLanguage();
    const queryClient = useQueryClient();

    const { data: biodata, isLoading, error } = useQuery({
        queryKey: ['myBiodata'],
        queryFn: async () => { const response = await biodataAPI.getMyBiodata(); return response.data; },
    });

    const requestPremiumMutation = useMutation({
        mutationFn: () => biodataAPI.requestPremium(),
        onSuccess: () => { queryClient.invalidateQueries(['myBiodata']); toast.success(t('toast.premiumRequested')); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); },
    });

    const handleRequestPremium = async () => {
        const result = await Swal.fire({ title: t('dashboard.viewBiodata.premiumRequestTitle'), text: t('dashboard.viewBiodata.premiumRequestText'), icon: 'question', showCancelButton: true, confirmButtonColor: '#10b981', cancelButtonColor: '#ef4444', confirmButtonText: t('dashboard.viewBiodata.premiumRequestConfirm') });
        if (result.isConfirmed) requestPremiumMutation.mutate();
    };

    const [verifyForm, setVerifyForm] = useState({ method: '', referenceName: '', referenceContact: '' });
    const [showVerifyForm, setShowVerifyForm] = useState(false);

    const requestVerificationMutation = useMutation({
        mutationFn: (data) => biodataAPI.requestVerification(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['myBiodata']);
            toast.success('Verification request submitted! Please wait for admin review.');
            setShowVerifyForm(false);
            setVerifyForm({ method: '', referenceName: '', referenceContact: '' });
        },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); },
    });

    const submitVerification = (e) => {
        e.preventDefault();
        if (!verifyForm.method) { toast.error('Please choose a verification method'); return; }
        requestVerificationMutation.mutate(verifyForm);
    };

    if (isLoading) return <div className="flex flex-col items-center justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /><p className="mt-3 text-muted-foreground text-sm">{t('dashboard.viewBiodata.loading')}</p></div>;

    if (error || !biodata) return (
        <Card className="text-center"><CardContent className="pt-12 pb-12 flex flex-col items-center">
            <div className="grid place-items-center h-16 w-16 rounded-2xl bg-muted text-muted-foreground mb-4"><FileText className="h-7 w-7" /></div>
            <h2 className="font-heading text-xl font-bold text-foreground mb-2">{t('dashboard.viewBiodata.noBiodata')}</h2>
            <p className="text-muted-foreground text-sm mb-5">{t('dashboard.viewBiodata.noBiodataDesc')}</p>
            <Button asChild><Link to="/dashboard/edit-biodata"><Pencil className="h-4 w-4" /> {t('dashboard.viewBiodata.createBiodata')}</Link></Button>
        </CardContent></Card>
    );



    return (
        <div className="space-y-6">
            <PageHeader title={t('dashboard.viewBiodata.heading')} description={t('dashboard.viewBiodata.subtitle')} icon={User}>
                <Button asChild variant="outline"><Link to="/dashboard/edit-biodata"><Pencil className="h-4 w-4" /> {t('dashboard.viewBiodata.editBiodata')}</Link></Button>
                {!isPremium && biodata.premiumRequestStatus !== 'pending' && (
                    <Button variant="gold" onClick={handleRequestPremium} disabled={requestPremiumMutation.isLoading}><Crown className="h-4 w-4" /> {t('dashboard.viewBiodata.requestPremium')}</Button>
                )}
                {biodata.premiumRequestStatus === 'pending' && (
                    <Badge variant="gold" className="gap-1 py-2 px-3"><Clock className="h-3.5 w-3.5" /> {t('dashboard.contactRequests.pending')} Approval</Badge>
                )}
            </PageHeader>

            <Card className="overflow-hidden">
                <div className="relative h-28 bg-gradient-brand overflow-hidden">
                    <div className="absolute inset-0 bg-dots opacity-[0.12]" />
                </div>
                <CardContent className="relative p-6 md:p-8 space-y-7">
                    <div className="flex items-center gap-4 -mt-14">
                        <Avatar className="h-20 w-20 rounded-2xl border-4 border-background shadow-premium-lg">
                            {biodata.profileImage ? <AvatarImage src={biodata.profileImage} alt="Profile" /> : null}
                            <AvatarFallback className="rounded-2xl bg-primary/10 text-primary"><User className="h-8 w-8" /></AvatarFallback>
                        </Avatar>
                        <div className="pt-10">
                            <h3 className="font-heading text-lg font-bold text-foreground">My Biodata</h3>
                            <p className="text-sm text-muted-foreground tabular-nums">ID #{biodata.biodataId}</p>
                        </div>
                    </div>

                    <Section title="Personal Information" icon={User}>
                        <InfoItem icon={CalendarDays} label="Date of Birth" value={new Date(biodata.dateOfBirth).toLocaleDateString()} />
                        <InfoItem icon={User} label="Age" value={`${biodata.age} years`} />
                        <InfoItem icon={Ruler} label="Height" value={biodata.height} />
                        <InfoItem icon={Scale} label="Weight" value={biodata.weight} />
                        <InfoItem icon={Briefcase} label="Occupation" value={biodata.occupation} />
                        <InfoItem icon={User} label="Skin Color" value={biodata.race} />
                    </Section>

                    <Section title="Family Information" icon={Heart} accent="text-rose-500">
                        <InfoItem icon={User} label="Father's Name" value={biodata.fathersName} tint="bg-rose-500/10 text-rose-500" />
                        <InfoItem icon={User} label="Mother's Name" value={biodata.mothersName} tint="bg-rose-500/10 text-rose-500" />
                    </Section>

                    <Section title="Location" icon={MapPin} accent="text-sky-500">
                        <InfoItem icon={MapPin} label="Permanent Division" value={biodata.permanentDivision} tint="bg-sky-500/10 text-sky-500" />
                        <InfoItem icon={MapPin} label="Present Division" value={biodata.presentDivision} tint="bg-sky-500/10 text-sky-500" />
                    </Section>

                    <Section title="Deen & Islamic Profile" icon={Moon} accent="text-emerald-500">
                        <InfoItem icon={Heart} label="Marital Status" value={biodata.maritalStatus} tint="bg-emerald-500/10 text-emerald-500" />
                        <InfoItem icon={BookOpen} label="Sect / Madhhab" value={biodata.sect} tint="bg-emerald-500/10 text-emerald-500" />
                        <InfoItem icon={Moon} label="Religious Commitment" value={biodata.religiousCommitment} tint="bg-emerald-500/10 text-emerald-500" />
                        <InfoItem icon={Moon} label="Prayer (Salah)" value={biodata.prayerFrequency} tint="bg-emerald-500/10 text-emerald-500" />
                        <InfoItem icon={Moon} label="Modesty" value={biodata.modesty} tint="bg-emerald-500/10 text-emerald-500" />
                        <InfoItem icon={BookOpen} label="Religious Education" value={biodata.religiousEducation} tint="bg-emerald-500/10 text-emerald-500" />
                        <InfoItem icon={Heart} label="Mahr Preference" value={biodata.mahrPreference} tint="bg-emerald-500/10 text-emerald-500" />
                        <InfoItem icon={Scale} label="Diet" value={biodata.diet} tint="bg-emerald-500/10 text-emerald-500" />
                        <InfoItem icon={Scale} label="Smoking" value={biodata.smoking} tint="bg-emerald-500/10 text-emerald-500" />
                        <InfoItem icon={Moon} label="Alcohol-free" value={biodata.alcoholFree ? 'Yes' : 'No'} tint="bg-emerald-500/10 text-emerald-500" />
                        <InfoItem icon={Moon} label="Revert to Islam" value={biodata.revert ? 'Yes' : 'No'} tint="bg-emerald-500/10 text-emerald-500" />
                        {biodata.hasChildren && (
                            <InfoItem icon={User} label="Children" value={`${biodata.childrenCount || 0} (${biodata.childrenLivingWith || '—'})`} tint="bg-emerald-500/10 text-emerald-500" />
                        )}
                    </Section>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2.5">
                            <span className="grid place-items-center h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600"><ShieldCheck className="h-5 w-5" /></span>
                            <div>
                                <h3 className="font-heading font-bold text-foreground">Profile Verification</h3>
                                <p className="text-xs text-muted-foreground">Verified profiles earn a trust badge — anti-fake-profile protection.</p>
                            </div>
                        </div>
                        {biodata.verification?.status === 'verified' && <VerifiedBadge verification={biodata.verification} />}
                    </div>

                    {biodata.verification?.status === 'verified' && (
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] p-4 text-sm text-emerald-700 dark:text-emerald-400">
                            Your profile is verified via {verificationMethods.find(m => m.value === biodata.verification.method)?.label || biodata.verification.method}. A verified badge now appears on your profile.
                        </div>
                    )}
                    {biodata.verification?.status === 'pending' && (
                        <Badge variant="outline" className="gap-1 border-amber-500/40 bg-amber-500/10 text-amber-600"><Clock className="h-3.5 w-3.5" /> Verification pending admin review</Badge>
                    )}
                    {biodata.verification?.status === 'rejected' && (
                        <Badge variant="outline" className="gap-1 border-rose-500/40 bg-rose-500/10 text-rose-600">Verification rejected — you may re-apply</Badge>
                    )}

                    {biodata.verification?.status !== 'verified' && biodata.verification?.status !== 'pending' && (
                        <>
                            {!showVerifyForm ? (
                                <Button variant="outline" onClick={() => setShowVerifyForm(true)}><BadgeCheck className="h-4 w-4" /> Get Verified</Button>
                            ) : (
                                <form onSubmit={submitVerification} className="space-y-4 rounded-xl border border-border p-4 bg-muted/20">
                                    <div className="space-y-1.5">
                                        <Label>Verification Method</Label>
                                        <Select value={verifyForm.method} onValueChange={(v) => setVerifyForm(prev => ({ ...prev, method: v }))}>
                                            <SelectTrigger><SelectValue placeholder="Select a method" /></SelectTrigger>
                                            <SelectContent>{verificationMethods.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label>Reference Name (NID / Imam / Leader)</Label>
                                            <Input value={verifyForm.referenceName} onChange={(e) => setVerifyForm(prev => ({ ...prev, referenceName: e.target.value }))} placeholder="e.g., Imam of Jamuna Masjid" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>Reference Contact</Label>
                                            <Input value={verifyForm.referenceContact} onChange={(e) => setVerifyForm(prev => ({ ...prev, referenceContact: e.target.value }))} placeholder="Phone / NID number" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="submit" disabled={requestVerificationMutation.isLoading}>{requestVerificationMutation.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />} Submit Request</Button>
                                        <Button type="button" variant="ghost" onClick={() => setShowVerifyForm(false)}>Cancel</Button>
                                    </div>
                                </form>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ViewBiodata;
