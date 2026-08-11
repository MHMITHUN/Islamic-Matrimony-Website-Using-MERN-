import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ShieldCheck, Loader2, Send } from 'lucide-react';
import { providerAPI } from '../../api/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import toast from 'react-hot-toast';

const ApplyProviderModal = ({ defaultType = 'imam', triggerText }) => {
    const { t } = useLanguage();
    const trigger = triggerText ?? t('fp.apply.trigger');
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '', serviceType: defaultType, title: '', organization: '',
        city: 'Dhaka', area: '', phone: '', email: '', bio: '', fee: '', yearsExperience: ''
    });

    const applyMutation = useMutation({
        mutationFn: (data) => providerAPI.apply(data),
        onSuccess: (res) => {
            toast.success(res.data.message || t('fp.apply.okMsg'));
            setOpen(false);
            setFormData({ name: '', serviceType: defaultType, title: '', organization: '', city: 'Dhaka', area: '', phone: '', email: '', bio: '', fee: '', yearsExperience: '' });
        },
        onError: (err) => { toast.error(err.response?.data?.message || t('fp.apply.errMsg')); }
    });

    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone) { toast.error(t('fp.apply.reqMsg')); return; }
        applyMutation.mutate(formData);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 shadow-glow">
                    <ShieldCheck className="h-4 w-4" /> {trigger}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-heading font-bold text-foreground">
                        <ShieldCheck className="h-5 w-5 text-primary" /> {t('fp.apply.title')}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>{t('fp.apply.fullName')} <span className="text-destructive">*</span></Label>
                            <Input name="name" value={formData.name} onChange={handleChange} placeholder={t('fp.apply.fullName')} required />
                        </div>
                        <div className="space-y-1.5">
                            <Label>{t('fp.apply.serviceType')} <span className="text-destructive">*</span></Label>
                            <Select value={formData.serviceType} onValueChange={(v) => setFormData(p => ({ ...p, serviceType: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="imam">{t('fp.apply.optImam')}</SelectItem>
                                    <SelectItem value="kazi">{t('fp.apply.optKazi')}</SelectItem>
                                    <SelectItem value="counselor">{t('fp.apply.optCounselor')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>{t('fp.apply.designation')}</Label>
                            <Input name="title" value={formData.title} onChange={handleChange} placeholder={t('fp.apply.designation')} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>{t('fp.apply.mosqueOrg')}</Label>
                            <Input name="organization" value={formData.organization} onChange={handleChange} placeholder={t('fp.apply.mosqueOrg')} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>{t('fp.apply.phone')} <span className="text-destructive">*</span></Label>
                            <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+8801XXXXXXXXX" required />
                        </div>
                        <div className="space-y-1.5">
                            <Label>{t('fp.apply.email')}</Label>
                            <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="imam@example.com" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                            <Label>{t('fp.apply.city')}</Label>
                            <Select value={formData.city} onValueChange={(v) => setFormData(p => ({ ...p, city: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {['Dhaka', 'Chattagram', 'Sylhet', 'Khulna', 'Rajshahi', 'Barisal', 'Rangpur', 'Mymensingh'].map(c => (
                                        <SelectItem key={c} value={c}>{t('enum.division.' + c.toLowerCase(), c)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>{t('fp.apply.area')}</Label>
                            <Input name="area" value={formData.area} onChange={handleChange} placeholder={t('fp.apply.area')} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>{t('fp.apply.experience')}</Label>
                            <Input type="number" min="0" name="yearsExperience" value={formData.yearsExperience} onChange={handleChange} placeholder="10" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>{t('fp.apply.fee')}</Label>
                        <Input type="number" min="0" name="fee" value={formData.fee} onChange={handleChange} placeholder="0" />
                    </div>

                    <div className="space-y-1.5">
                        <Label>{t('fp.apply.bio')}</Label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3}
                            placeholder={t('fp.apply.bio')}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>

                    <Button type="submit" disabled={applyMutation.isLoading} className="w-full gap-2">
                        {applyMutation.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} {t('fp.apply.submit')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ApplyProviderModal;
