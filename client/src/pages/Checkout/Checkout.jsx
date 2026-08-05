import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { CreditCard, Lock, CheckCircle2, ShieldCheck, ArrowLeft, Star, Loader2, Mail, Hash } from 'lucide-react';
import { paymentAPI, contactRequestAPI } from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { biodataId } = useParams();
    const { user } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [cardNumber, setCardNumber] = useState('');
    const [processing, setProcessing] = useState(false);

    const createRequest = useMutation({
        mutationFn: async (paymentId) => { return contactRequestAPI.create({ biodataId: parseInt(biodataId), paymentId }); },
        onSuccess: () => { toast.success(t('toast.contactRequested')); navigate('/dashboard/contact-requests'); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) { toast.error(t('toast.validCard')); return; }
        setProcessing(true);
        try {
            const paymentResponse = await paymentAPI.createPaymentIntent(500);
            const { paymentId } = paymentResponse.data;
            await paymentAPI.confirmPayment(paymentId);
            await createRequest.mutateAsync(paymentId);
        } catch (error) {
            toast.error(t('toast.paymentFailed'));
        } finally { setProcessing(false); }
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) parts.push(match.substring(i, i + 4));
        return parts.length ? parts.join(' ') : value;
    };

    return (
        <div className="min-h-screen bg-muted/30 py-12 pt-28">
            <div className="container-custom max-w-xl">
                <Button asChild variant="ghost" size="sm" className="mb-5 -ml-2 text-muted-foreground hover:text-foreground">
                    <Link to={`/biodata/${biodataId}`}><ArrowLeft className="h-4 w-4" /> {t('checkout.backToProfile')}</Link>
                </Button>

                <Card className="overflow-hidden">
                    {/* Header */}
                    <div className="relative bg-gradient-brand p-8 text-center overflow-hidden">
                        <div className="absolute inset-0 bg-dots opacity-[0.1]" />
                        <div className="relative">
                            <div className="grid place-items-center h-14 w-14 rounded-2xl bg-white/15 mx-auto mb-3"><CreditCard className="h-6 w-6 text-white" /></div>
                            <h1 className="font-heading text-xl font-bold text-white mb-1">{t('checkout.heading')}</h1>
                            <p className="text-emerald-100 text-sm">{t('checkout.subtitle')}</p>
                        </div>
                    </div>

                    <CardContent className="p-6 md:p-8 space-y-6">
                        {/* Order summary */}
                        <div className="rounded-xl border bg-muted/30 p-5">
                            <h3 className="font-bold text-foreground text-sm mb-3 flex items-center gap-1.5"><Star className="h-4 w-4 fill-gold text-gold" /> {t('checkout.orderSummary')}</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{t('checkout.contactRequest')}</span><span className="font-semibold text-foreground">500 BDT</span></div>
                                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{t('checkout.biodataId')}</span><span className="font-semibold text-primary">#{biodataId}</span></div>
                                <Separator className="my-2" />
                                <div className="flex items-center justify-between font-bold"><span className="text-foreground">{t('checkout.total')}</span><span className="text-primary text-lg">500 BDT</span></div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label>{t('checkout.biodataId')}</Label>
                                <Input type="text" value={`#${biodataId}`} readOnly className="bg-muted cursor-not-allowed" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>{t('checkout.yourEmail')}</Label>
                                <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" /><Input type="email" value={user?.email || ''} readOnly className="pl-10 bg-muted cursor-not-allowed" /></div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="card">{t('checkout.cardNumber')}</Label>
                                <div className="relative">
                                    <Input id="card" type="text" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19} className="pl-4 pr-10" required />
                                    <CreditCard className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-emerald-500" /> {t('checkout.demoMode')}</p>
                            </div>
                            <Button type="submit" disabled={processing} size="lg" className="w-full">
                                {processing ? <><Loader2 className="h-4 w-4 animate-spin" /> {t('checkout.processing')}</> : <><Lock className="h-4 w-4" /> {t('checkout.payButton')}</>}
                            </Button>
                        </form>

                        {/* Secure note */}
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                            <div className="flex items-start gap-3">
                                <div className="grid place-items-center h-8 w-8 rounded-lg bg-emerald-500 text-white shrink-0"><CheckCircle2 className="h-4 w-4" /></div>
                                <div>
                                    <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 text-sm mb-0.5">{t('checkout.securePayment')}</h4>
                                    <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80">{t('checkout.secureDesc')}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Checkout;
