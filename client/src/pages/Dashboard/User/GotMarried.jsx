import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { HeartHandshake, Star, ImageIcon, Calendar, Hash, User, Loader2 } from 'lucide-react';
import { successStoryAPI, biodataAPI } from '../../../api/api';
import { useLanguage } from '../../../contexts/LanguageContext';
import PageHeader from '../../../components/dashboard/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const FieldLabel = ({ icon: Icon, children }) => (
    <Label className="flex items-center gap-2 mb-2"><Icon className="h-4 w-4 text-primary" />{children}</Label>
);

const GotMarried = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ selfBiodataId: '', partnerBiodataId: '', coupleImage: '', marriageDate: '', reviewStar: 5, successStoryText: '' });

    const { data: myBiodata } = useQuery({
        queryKey: ['myBiodata'],
        queryFn: async () => { const response = await biodataAPI.getMyBiodata(); return response.data; },
        onSuccess: (data) => { if (data?.biodataId) setFormData(prev => ({ ...prev, selfBiodataId: data.biodataId })); },
    });

    const submitMutation = useMutation({
        mutationFn: (data) => successStoryAPI.create(data),
        onSuccess: () => { toast.success(t('toast.storySubmitted')); navigate('/dashboard/view-biodata'); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); },
    });

    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.selfBiodataId || !formData.partnerBiodataId || !formData.coupleImage || !formData.marriageDate || !formData.successStoryText) { toast.error(t('toast.fillAllFieldsSimple')); return; }
        submitMutation.mutate({ ...formData, selfBiodataId: parseInt(formData.selfBiodataId), partnerBiodataId: parseInt(formData.partnerBiodataId), reviewStar: parseInt(formData.reviewStar) });
    };



    return (
        <div className="space-y-6">
            <PageHeader title={t('dashboard.gotMarried.heading')} description={t('dashboard.gotMarried.subtitle')} icon={HeartHandshake} />
            <Card className="overflow-hidden">
                <div className="relative p-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white overflow-hidden">
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative flex items-center gap-4">
                        <span className="grid place-items-center h-14 w-14 rounded-2xl bg-white/20 backdrop-blur"><HeartHandshake className="h-7 w-7 text-white" /></span>
                        <div><h2 className="font-heading text-xl font-bold">{t('dashboard.gotMarried.shareStory')}</h2><p className="text-white/80 text-sm">{t('dashboard.gotMarried.inspireOthers')}</p></div>
                    </div>
                </div>
                <CardContent className="p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <FieldLabel icon={Hash}>{t('dashboard.gotMarried.selfBiodataId')} <span className="text-destructive">*</span></FieldLabel>
                                <Input type="number" name="selfBiodataId" value={formData.selfBiodataId} readOnly={!!myBiodata?.biodataId} onChange={handleChange} className={cn(!!myBiodata?.biodataId && 'bg-muted cursor-not-allowed')} placeholder={t('dashboard.gotMarried.selfBiodataPlaceholder')} required />
                            </div>
                            <div>
                                <FieldLabel icon={User}>{t('dashboard.gotMarried.partnerBiodataId')} <span className="text-destructive">*</span></FieldLabel>
                                <Input type="number" name="partnerBiodataId" value={formData.partnerBiodataId} onChange={handleChange} placeholder={t('dashboard.gotMarried.partnerBiodataPlaceholder')} required />
                            </div>
                        </div>
                        <div>
                            <FieldLabel icon={ImageIcon}>{t('dashboard.gotMarried.coupleImage')} <span className="text-destructive">*</span></FieldLabel>
                            <Input type="url" name="coupleImage" value={formData.coupleImage} onChange={handleChange} placeholder={t('dashboard.gotMarried.coupleImagePlaceholder')} required />
                        </div>
                        <div>
                            <FieldLabel icon={Calendar}>{t('dashboard.gotMarried.marriageDate')} <span className="text-destructive">*</span></FieldLabel>
                            <Input type="date" name="marriageDate" value={formData.marriageDate} onChange={handleChange} required />
                        </div>
                        <div>
                            <FieldLabel icon={Star}>{t('dashboard.gotMarried.rating')} <span className="text-destructive">*</span></FieldLabel>
                            <div className="flex items-center gap-1 p-4 rounded-xl border bg-gold/[0.04]">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={star} type="button" onClick={() => setFormData(prev => ({ ...prev, reviewStar: star }))} className="p-1 transition-transform hover:scale-125">
                                        <Star className={cn('h-7 w-7 transition-colors', star <= formData.reviewStar ? 'fill-gold text-gold' : 'text-muted-foreground/30')} />
                                    </button>
                                ))}
                                <span className="ml-auto text-gold font-semibold">{formData.reviewStar}/5</span>
                            </div>
                        </div>
                        <div>
                            <FieldLabel icon={HeartHandshake}>{t('dashboard.gotMarried.storyText')} <span className="text-destructive">*</span></FieldLabel>
                            <Textarea name="successStoryText" value={formData.successStoryText} onChange={handleChange} rows={6} className="resize-none" placeholder={t('dashboard.gotMarried.storyTextPlaceholder')} required />
                        </div>
                        <Button type="submit" disabled={submitMutation.isLoading} size="lg" variant="gradient" className="w-full">
                            {submitMutation.isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> {t('dashboard.gotMarried.submitting')}</> : <><HeartHandshake className="h-4 w-4" /> {t('dashboard.gotMarried.submit')}</>}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default GotMarried;
