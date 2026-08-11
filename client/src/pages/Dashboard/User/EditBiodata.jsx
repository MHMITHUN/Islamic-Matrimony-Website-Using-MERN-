import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, User as UserIcon, Phone, MapPin, Heart, Star, Loader2, FileText, Moon, ShieldCheck } from 'lucide-react';
import { FaMale, FaFemale } from 'react-icons/fa';
import { biodataAPI } from '../../../api/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import PageHeader from '../../../components/dashboard/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const divisions = ['Dhaka', 'Chattagram', 'Rangpur', 'Barisal', 'Khulna', 'Mymensingh', 'Sylhet'];
const occupations = ['Student', 'Job', 'Business', 'Housewife', 'Teacher', 'Doctor', 'Engineer', 'Other'];
const races = ['Fair', 'Light Brown', 'Brown', 'Dark'];
const heights = ["4'5\"", "4'6\"", "4'7\"", "4'8\"", "4'9\"", "4'10\"", "4'11\"", "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"", "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\""];
const weights = ['40-45 kg', '45-50 kg', '50-55 kg', '55-60 kg', '60-65 kg', '65-70 kg', '70-75 kg', '75-80 kg', '80-85 kg', '85-90 kg', '90+ kg'];

// --- Islamic / Deen options ---
const maritalStatuses = ['Never Married', 'Divorced', 'Widowed', 'Seeking Polygyny'];
const sects = ['Sunni-Hanafi', "Sunni-Shafi'i", 'Sunni-Maliki', 'Sunni-Hanbali', 'Shia', 'Other'];
const commitments = ['Practicing', 'Moderate', 'Cultural'];
const prayerFreqs = ['Five Daily', 'Sometimes', 'Rarely'];
const femaleModesty = ['Hijab', 'Niqab', 'None'];
const maleModesty = ['Beard', 'No Beard'];
const relEducations = ['General', 'Madrasa', 'Hifz', 'Alim', 'Other'];
const mahrPrefs = ['Simple', 'Moderate', 'As per capability', 'To discuss'];
const smokingOpts = ['No', 'Occasionally', 'Yes'];
const dietOpts = ['Halal only', 'Vegetarian', 'Other'];
const childrenLivingOpts = ['Yes', 'No', 'Shared'];
const priorMarriageStatuses = ['Divorced', 'Widowed', 'Seeking Polygyny'];
const waliRelations = ['Father', 'Brother', 'Uncle', 'Grandfather', 'Son', 'Other'];

const Field = ({ label, children, required }) => (
    <div className="space-y-1.5">
        <Label>{label} {required && <span className="text-destructive">*</span>}</Label>
        {children}
    </div>
);

const SectionCard = ({ title, icon: Icon, accent = 'text-primary', children }) => (
    <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Icon className={cn('h-4 w-4', accent)} /> {title}</CardTitle></CardHeader>
        <CardContent>{children}</CardContent>
    </Card>
);

const EditBiodata = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({ biodataType: '', name: '', profileImage: '', dateOfBirth: '', height: '', weight: '', age: '', occupation: '', race: '', fathersName: '', mothersName: '', permanentDivision: '', presentDivision: '', expectedPartnerAge: '', expectedPartnerHeight: '', expectedPartnerWeight: '', mobileNumber: '', maritalStatus: '', sect: '', religiousCommitment: '', prayerFrequency: '', modesty: '', revert: false, religiousEducation: '', mahrPreference: '', alcoholFree: true, smoking: '', diet: 'Halal only', hasChildren: false, childrenCount: 0, childrenLivingWith: '', waliEnabled: false, waliName: '', waliRelation: '', waliContact: '', waliEmail: '' });

    const { data: existingBiodata, isLoading } = useQuery({
        queryKey: ['myBiodata'],
        queryFn: async () => { try { const response = await biodataAPI.getMyBiodata(); return response.data; } catch (error) { if (error.response?.status === 404) return null; throw error; } },
    });

    useEffect(() => {
        if (existingBiodata) {
            setFormData({
                biodataType: existingBiodata.biodataType || '', name: existingBiodata.name || '', profileImage: existingBiodata.profileImage || '',
                dateOfBirth: existingBiodata.dateOfBirth ? existingBiodata.dateOfBirth.split('T')[0] : '', height: existingBiodata.height || '', weight: existingBiodata.weight || '',
                age: existingBiodata.age || '', occupation: existingBiodata.occupation || '', race: existingBiodata.race || '',
                fathersName: existingBiodata.fathersName || '', mothersName: existingBiodata.mothersName || '',
                permanentDivision: existingBiodata.permanentDivision || '', presentDivision: existingBiodata.presentDivision || '',
                expectedPartnerAge: existingBiodata.expectedPartnerAge || '', expectedPartnerHeight: existingBiodata.expectedPartnerHeight || '',
                expectedPartnerWeight: existingBiodata.expectedPartnerWeight || '', mobileNumber: existingBiodata.mobileNumber || '',
                maritalStatus: existingBiodata.maritalStatus || '', sect: existingBiodata.sect || '',
                religiousCommitment: existingBiodata.religiousCommitment || '', prayerFrequency: existingBiodata.prayerFrequency || '',
                modesty: existingBiodata.modesty || '', revert: existingBiodata.revert || false,
                religiousEducation: existingBiodata.religiousEducation || '', mahrPreference: existingBiodata.mahrPreference || '',
                alcoholFree: existingBiodata.alcoholFree !== undefined ? existingBiodata.alcoholFree : true,
                smoking: existingBiodata.smoking || '', diet: existingBiodata.diet || 'Halal only',
                hasChildren: existingBiodata.hasChildren || false, childrenCount: existingBiodata.childrenCount || 0,
                childrenLivingWith: existingBiodata.childrenLivingWith || '',
                waliEnabled: existingBiodata.waliEnabled || false, waliName: existingBiodata.waliName || '',
                waliRelation: existingBiodata.waliRelation || '', waliContact: existingBiodata.waliContact || '',
                waliEmail: existingBiodata.waliEmail || '',
            });
        }
    }, [existingBiodata]);

    const saveMutation = useMutation({
        mutationFn: (data) => biodataAPI.createOrUpdate(data),
        onSuccess: () => { queryClient.invalidateQueries(['myBiodata']); toast.success(existingBiodata ? t('toast.biodataUpdated') : t('toast.biodataCreated')); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.biodataFailed')); },
    });

    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
    const handleSelect = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));
    const handleCheckbox = (name, checked) => setFormData(prev => ({ ...prev, [name]: checked }));

    useEffect(() => {
        if (formData.dateOfBirth) { const today = new Date(); const birthDate = new Date(formData.dateOfBirth); let age = today.getFullYear() - birthDate.getFullYear(); const m = today.getMonth() - birthDate.getMonth(); if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--; setFormData(prev => ({ ...prev, age: age.toString() })); }
    }, [formData.dateOfBirth]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const requiredFields = ['biodataType', 'name', 'dateOfBirth', 'height', 'weight', 'occupation', 'race', 'fathersName', 'mothersName', 'permanentDivision', 'presentDivision', 'expectedPartnerAge', 'expectedPartnerHeight', 'expectedPartnerWeight', 'mobileNumber'];
        for (const field of requiredFields) { if (!formData[field]) { toast.error(t('toast.fillAllFields')); return; } }
        saveMutation.mutate(formData);
    };

    if (isLoading) return <div className="flex flex-col items-center justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /><p className="mt-3 text-muted-foreground text-sm">{t('dashboard.editBiodata.loading')}</p></div>;

    const isEdit = !!existingBiodata;

    return (
        <div className="space-y-6">
            <PageHeader title={isEdit ? t('dashboard.editBiodata.heading') : t('dashboard.editBiodata.createHeading')} description={t('dashboard.editBiodata.subtitle')} icon={FileText} />

            <form onSubmit={handleSubmit} className="space-y-5">
                <SectionCard title={t('dashboard.editBiodata.basicInfo')} icon={UserIcon}>
                    <div className="space-y-4">
                        <Field label={t('dashboard.editBiodata.biodataType')} required>
                            <div className="grid grid-cols-2 gap-3">
                                {[['Male', FaMale, 'bg-sky-500/10 text-sky-600', t('dashboard.editBiodata.male')], ['Female', FaFemale, 'bg-rose-500/10 text-rose-600', t('dashboard.editBiodata.female')]].map(([val, Icon, tint, label]) => (
                                    <button key={val} type="button" onClick={() => handleSelect('biodataType', val)}
                                        className={cn('flex items-center gap-2.5 p-3 rounded-lg border transition-all',
                                            formData.biodataType === val ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border hover:bg-accent')}>
                                        <span className={cn('grid place-items-center h-8 w-8 rounded-lg', tint)}><Icon /></span>
                                        <span className="text-sm font-medium text-foreground">{label}</span>
                                    </button>
                                ))}
                            </div>
                        </Field>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label={t('dashboard.editBiodata.fullName')} required><Input name="name" value={formData.name} onChange={handleChange} placeholder={t('dashboard.editBiodata.namePlaceholder')} required /></Field>
                            <Field label={t('dashboard.editBiodata.profileImage')}><Input type="url" name="profileImage" value={formData.profileImage} onChange={handleChange} placeholder={t('dashboard.editBiodata.imagePlaceholder')} /></Field>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Field label={t('dashboard.editBiodata.dateOfBirth')} required><Input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required /></Field>
                            <Field label={t('dashboard.editBiodata.height')} required>
                                <Select value={formData.height} onValueChange={(v) => handleSelect('height', v)}><SelectTrigger><SelectValue placeholder={t('dashboard.editBiodata.selectHeight')} /></SelectTrigger><SelectContent>{heights.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent></Select>
                            </Field>
                            <Field label={t('dashboard.editBiodata.weight')} required>
                                <Select value={formData.weight} onValueChange={(v) => handleSelect('weight', v)}><SelectTrigger><SelectValue placeholder={t('dashboard.editBiodata.selectWeight')} /></SelectTrigger><SelectContent>{weights.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent></Select>
                            </Field>
                        </div>
                        <Field label={t('dashboard.editBiodata.ageAuto')}><Input type="text" value={formData.age} readOnly className="bg-muted cursor-not-allowed" /></Field>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label={t('dashboard.editBiodata.occupation')} required>
                                <Select value={formData.occupation} onValueChange={(v) => handleSelect('occupation', v)}><SelectTrigger><SelectValue placeholder={t('dashboard.editBiodata.selectOccupation')} /></SelectTrigger><SelectContent>{occupations.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
                            </Field>
                            <Field label={t('dashboard.editBiodata.skinColor')} required>
                                <Select value={formData.race} onValueChange={(v) => handleSelect('race', v)}><SelectTrigger><SelectValue placeholder={t('dashboard.editBiodata.selectRace')} /></SelectTrigger><SelectContent>{races.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select>
                            </Field>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard title={t('dashboard.editBiodata.familyInfo')} icon={Heart} accent="text-rose-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label={t('dashboard.editBiodata.fathersName')} required><Input name="fathersName" value={formData.fathersName} onChange={handleChange} placeholder={t('dashboard.editBiodata.fatherPlaceholder')} required /></Field>
                        <Field label={t('dashboard.editBiodata.mothersName')} required><Input name="mothersName" value={formData.mothersName} onChange={handleChange} placeholder={t('dashboard.editBiodata.motherPlaceholder')} required /></Field>
                    </div>
                </SectionCard>

                <SectionCard title={t('dashboard.editBiodata.location')} icon={MapPin} accent="text-sky-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label={t('dashboard.editBiodata.permanentDivision')} required>
                            <Select value={formData.permanentDivision} onValueChange={(v) => handleSelect('permanentDivision', v)}><SelectTrigger><SelectValue placeholder={t('dashboard.editBiodata.selectDivision')} /></SelectTrigger><SelectContent>{divisions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
                        </Field>
                        <Field label={t('dashboard.editBiodata.presentDivision')} required>
                            <Select value={formData.presentDivision} onValueChange={(v) => handleSelect('presentDivision', v)}><SelectTrigger><SelectValue placeholder={t('dashboard.editBiodata.selectDivision')} /></SelectTrigger><SelectContent>{divisions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
                        </Field>
                    </div>
                </SectionCard>

                <SectionCard title={t('dashboard.editBiodata.deenProfile')} icon={Moon} accent="text-emerald-500">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label={t('dashboard.editBiodata.maritalStatus')}>
                                <Select value={formData.maritalStatus} onValueChange={(v) => handleSelect('maritalStatus', v)}><SelectTrigger><SelectValue placeholder={t('dashboard.editBiodata.selectMaritalStatus')} /></SelectTrigger><SelectContent>{maritalStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
                            </Field>
                            <Field label={t('dashboard.editBiodata.sect')}>
                                <Select value={formData.sect} onValueChange={(v) => handleSelect('sect', v)}><SelectTrigger><SelectValue placeholder={t('dashboard.editBiodata.selectSect')} /></SelectTrigger><SelectContent>{sects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
                            </Field>
                            <Field label={t('dashboard.editBiodata.religiousCommitment')}>
                                <Select value={formData.religiousCommitment} onValueChange={(v) => handleSelect('religiousCommitment', v)}><SelectTrigger><SelectValue placeholder={t('dashboard.editBiodata.selectCommitment')} /></SelectTrigger><SelectContent>{commitments.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
                            </Field>
                            <Field label={t('dashboard.editBiodata.prayerFrequency')}>
                                <Select value={formData.prayerFrequency} onValueChange={(v) => handleSelect('prayerFrequency', v)}><SelectTrigger><SelectValue placeholder={t('dashboard.editBiodata.selectPrayer')} /></SelectTrigger><SelectContent>{prayerFreqs.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
                            </Field>
                            <Field label={t('dashboard.editBiodata.modesty')}>
                                <Select value={formData.modesty} onValueChange={(v) => handleSelect('modesty', v)} disabled={!formData.biodataType}><SelectTrigger><SelectValue placeholder={formData.biodataType ? t('dashboard.editBiodata.selectModesty') : t('dashboard.editBiodata.selectTypeFirst')} /></SelectTrigger><SelectContent>{(formData.biodataType === 'Female' ? femaleModesty : formData.biodataType === 'Male' ? maleModesty : []).map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select>
                            </Field>
                            <Field label={t('dashboard.editBiodata.religiousEducation')}>
                                <Select value={formData.religiousEducation} onValueChange={(v) => handleSelect('religiousEducation', v)}><SelectTrigger><SelectValue placeholder={t('dashboard.editBiodata.selectRelEducation')} /></SelectTrigger><SelectContent>{relEducations.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select>
                            </Field>
                            <Field label={t('dashboard.editBiodata.mahrPreference')}>
                                <Select value={formData.mahrPreference} onValueChange={(v) => handleSelect('mahrPreference', v)}><SelectTrigger><SelectValue placeholder={t('dashboard.editBiodata.selectMahr')} /></SelectTrigger><SelectContent>{mahrPrefs.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select>
                            </Field>
                            <Field label={t('dashboard.editBiodata.smoking')}>
                                <Select value={formData.smoking} onValueChange={(v) => handleSelect('smoking', v)}><SelectTrigger><SelectValue placeholder={t('dashboard.editBiodata.selectSmoking')} /></SelectTrigger><SelectContent>{smokingOpts.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
                            </Field>
                            <Field label={t('dashboard.editBiodata.diet')}>
                                <Select value={formData.diet} onValueChange={(v) => handleSelect('diet', v)}><SelectTrigger><SelectValue placeholder={t('dashboard.editBiodata.selectDiet')} /></SelectTrigger><SelectContent>{dietOpts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
                            </Field>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 pt-1">
                            <div className="flex items-center gap-2">
                                <Checkbox id="revert" checked={formData.revert} onCheckedChange={(c) => handleCheckbox('revert', c)} />
                                <Label htmlFor="revert" className="cursor-pointer text-sm">{t('dashboard.editBiodata.revert')}</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="alcoholFree" checked={formData.alcoholFree} onCheckedChange={(c) => handleCheckbox('alcoholFree', c)} />
                                <Label htmlFor="alcoholFree" className="cursor-pointer text-sm">{t('dashboard.editBiodata.alcoholFree')}</Label>
                            </div>
                        </div>

                        {priorMarriageStatuses.includes(formData.maritalStatus) && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end rounded-xl border border-border p-4 bg-emerald-500/[0.04]">
                                <div className="flex items-center gap-2 h-10">
                                    <Checkbox id="hasChildren" checked={formData.hasChildren} onCheckedChange={(c) => handleCheckbox('hasChildren', c)} />
                                    <Label htmlFor="hasChildren" className="cursor-pointer text-sm">{t('dashboard.editBiodata.hasChildren')}</Label>
                                </div>
                                {formData.hasChildren && <>
                                    <Field label={t('dashboard.editBiodata.childrenCount')}><Input type="number" name="childrenCount" min="0" value={formData.childrenCount} onChange={handleChange} /></Field>
                                    <Field label={t('dashboard.editBiodata.childrenLivingWith')}>
                                        <Select value={formData.childrenLivingWith} onValueChange={(v) => handleSelect('childrenLivingWith', v)}><SelectTrigger><SelectValue placeholder={t('dashboard.editBiodata.selectChildrenLivingWith')} /></SelectTrigger><SelectContent>{childrenLivingOpts.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
                                    </Field>
                                </>}
                            </div>
                        )}
                    </div>
                </SectionCard>

                <SectionCard title={t('dashboard.editBiodata.expectedPartner')} icon={Star} accent="text-gold">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Field label={t('dashboard.editBiodata.expectedAge')} required><Input name="expectedPartnerAge" value={formData.expectedPartnerAge} onChange={handleChange} placeholder={t('dashboard.editBiodata.expectedAgePlaceholder')} required /></Field>
                        <Field label={t('dashboard.editBiodata.expectedHeight')} required>
                            <Select value={formData.expectedPartnerHeight} onValueChange={(v) => handleSelect('expectedPartnerHeight', v)}><SelectTrigger><SelectValue placeholder={t('dashboard.editBiodata.selectHeight')} /></SelectTrigger><SelectContent>{heights.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent></Select>
                        </Field>
                        <Field label={t('dashboard.editBiodata.expectedWeight')} required>
                            <Select value={formData.expectedPartnerWeight} onValueChange={(v) => handleSelect('expectedPartnerWeight', v)}><SelectTrigger><SelectValue placeholder={t('dashboard.editBiodata.selectWeight')} /></SelectTrigger><SelectContent>{weights.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent></Select>
                        </Field>
                    </div>
                </SectionCard>

                <SectionCard title={t('dashboard.editBiodata.contactInfo')} icon={Phone} accent="text-purple-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label={t('dashboard.editBiodata.contactEmail')}><Input type="email" value={user?.email || ''} readOnly className="bg-muted cursor-not-allowed" /></Field>
                        <Field label={t('dashboard.editBiodata.mobileNumber')} required><Input name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder={t('dashboard.editBiodata.mobilePlaceholder')} required /></Field>
                    </div>
                </SectionCard>

                <SectionCard title="Wali (Guardian)" icon={ShieldCheck} accent="text-emerald-500">
                    <div className="space-y-4">
                        <div className="flex items-start gap-2">
                            <Checkbox id="waliEnabled" checked={formData.waliEnabled} onCheckedChange={(c) => handleCheckbox('waliEnabled', c)} />
                            <Label htmlFor="waliEnabled" className="cursor-pointer text-sm">Require my wali's approval before my contact info is shared (recommended)</Label>
                        </div>
                        {formData.waliEnabled && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Wali's Name"><Input name="waliName" value={formData.waliName} onChange={handleChange} placeholder="e.g., Abdul Karim" /></Field>
                                <Field label="Wali's Relationship">
                                    <Select value={formData.waliRelation} onValueChange={(v) => handleSelect('waliRelation', v)}><SelectTrigger><SelectValue placeholder="Select relationship" /></SelectTrigger><SelectContent>{waliRelations.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select>
                                </Field>
                                <Field label="Wali's Contact (phone)"><Input name="waliContact" value={formData.waliContact} onChange={handleChange} placeholder="+8801XXXXXXXXX" /></Field>
                                <Field label="Wali's Email"><Input type="email" name="waliEmail" value={formData.waliEmail} onChange={handleChange} placeholder="wali@example.com" /></Field>
                            </div>
                        )}
                    </div>
                </SectionCard>

                <div className="space-y-2">
                    <Button type="submit" disabled={saveMutation.isLoading} size="lg" className="w-full shadow-glow">
                        {saveMutation.isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> {t('dashboard.editBiodata.saving')}</> : <><Save className="h-4 w-4" /> {t('dashboard.editBiodata.save')}</>}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">{t('dashboard.editBiodata.required')}</p>
                </div>
            </form>
        </div>
    );
};

export default EditBiodata;
