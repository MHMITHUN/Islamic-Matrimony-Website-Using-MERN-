import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ShieldCheck, Loader2, Send } from 'lucide-react';
import { providerAPI } from '../../api/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import toast from 'react-hot-toast';

const ApplyProviderModal = ({ defaultType = 'imam', triggerText = 'Apply to Join Directory' }) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        serviceType: defaultType,
        title: '',
        organization: '',
        city: 'Dhaka',
        area: '',
        phone: '',
        email: '',
        bio: '',
        fee: '',
        yearsExperience: ''
    });

    const applyMutation = useMutation({
        mutationFn: (data) => providerAPI.apply(data),
        onSuccess: (res) => {
            toast.success(res.data.message || 'Application submitted successfully!');
            setOpen(false);
            setFormData({
                name: '',
                serviceType: defaultType,
                title: '',
                organization: '',
                city: 'Dhaka',
                area: '',
                phone: '',
                email: '',
                bio: '',
                fee: '',
                yearsExperience: ''
            });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to submit application');
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone) {
            toast.error('Name and phone number are required');
            return;
        }
        applyMutation.mutate(formData);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 shadow-glow">
                    <ShieldCheck className="h-4 w-4" /> {triggerText}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-heading font-bold text-foreground">
                        <ShieldCheck className="h-5 w-5 text-primary" /> Register as a Service Provider
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Full Name <span className="text-destructive">*</span></Label>
                            <Input name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Imam Yusuf Ali" required />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Service Type <span className="text-destructive">*</span></Label>
                            <Select value={formData.serviceType} onValueChange={(v) => setFormData(p => ({ ...p, serviceType: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="imam">Imam (Attestation Partner)</SelectItem>
                                    <SelectItem value="kazi">Kazi (Marriage Registrar)</SelectItem>
                                    <SelectItem value="counselor">Counselor (Marital & Pre-marital)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Title / Designation</Label>
                            <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Senior Imam & Khatib" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Mosque / Organization</Label>
                            <Input name="organization" value={formData.organization} onChange={handleChange} placeholder="e.g., Baitul Mukarram National Mosque" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Phone Number <span className="text-destructive">*</span></Label>
                            <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+8801XXXXXXXXX" required />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Email Address</Label>
                            <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="imam@example.com" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                            <Label>City</Label>
                            <Select value={formData.city} onValueChange={(v) => setFormData(p => ({ ...p, city: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {['Dhaka', 'Chattagram', 'Sylhet', 'Khulna', 'Rajshahi', 'Barisal', 'Rangpur', 'Mymensingh'].map(c => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Area / Thana</Label>
                            <Input name="area" value={formData.area} onChange={handleChange} placeholder="e.g., Dhanmondi" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Experience (Years)</Label>
                            <Input type="number" min="0" name="yearsExperience" value={formData.yearsExperience} onChange={handleChange} placeholder="10" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Consultation Fee (BDT - 0 for free)</Label>
                        <Input type="number" min="0" name="fee" value={formData.fee} onChange={handleChange} placeholder="0" />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Short Bio / Background</Label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Briefly describe your qualifications, religious education, or services offered..."
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>

                    <Button type="submit" disabled={applyMutation.isLoading} className="w-full gap-2">
                        {applyMutation.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Submit Application
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ApplyProviderModal;
