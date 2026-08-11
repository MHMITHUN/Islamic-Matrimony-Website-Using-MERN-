import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Loader2, Calendar, Gift } from 'lucide-react';
import { providerAPI, bookingAPI } from '../../api/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

// Inline widget to book a kazi or counselor for a journey and mark the session completed.
const BookingWidget = ({ journeyId, serviceType, existing, onChanged }) => {
    const qc = useQueryClient();
    const { t } = useLanguage();
    const [providerId, setProviderId] = useState('');
    const [date, setDate] = useState('');

    const { data: providers = [] } = useQuery({
        queryKey: ['providers', serviceType],
        queryFn: async () => { const r = await providerAPI.getAll({ serviceType }); return r.data; }
    });

    const createMut = useMutation({
        mutationFn: (data) => bookingAPI.create(data),
        onSuccess: () => { qc.invalidateQueries(['journey', journeyId]); onChanged?.(); toast.success(`${serviceType === 'kazi' ? 'Kazi' : 'Counselor'} booked`); },
        onError: (e) => toast.error(e.response?.data?.message || 'Booking failed')
    });
    const completeMut = useMutation({
        mutationFn: (id) => bookingAPI.complete(id),
        onSuccess: () => { qc.invalidateQueries(['journey', journeyId]); onChanged?.(); toast.success('Session marked completed'); },
        onError: (e) => toast.error(e.response?.data?.message || 'Failed')
    });

    const book = () => {
        if (!providerId) { toast.error(t('fp.common.select')); return; }
        createMut.mutate({ journeyId, serviceType, providerId, requestedDate: date });
    };

    if (existing?.status === 'completed') {
        return (
            <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> {t('fp.journey.bookingWidget.completed').replace('{who}', serviceType === 'kazi' ? t('fp.nav.kazi') : t('fp.providers.counselorTitle'))}{existing.providerName ? ` — ${existing.providerName}` : ''}.
            </div>
        );
    }
    if (existing) {
        return (
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{t('fp.journey.bookingWidget.bookedWith').replace('{name}', existing.providerName)} <Badge variant="outline" className="ml-1">{existing.status}</Badge></p>
                <Button size="sm" onClick={() => completeMut.mutate(existing._id)} disabled={completeMut.isLoading}>
                    {completeMut.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} {t('fp.journey.bookingWidget.markComplete')}
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div className="space-y-1.5 md:col-span-2">
                    <Label>{serviceType === 'kazi' ? t('fp.journey.bookingWidget.pickKazi') : t('fp.journey.bookingWidget.pickCounselor')}</Label>
                    <Select value={providerId} onValueChange={setProviderId}>
                        <SelectTrigger><SelectValue placeholder={t('fp.common.select')} /></SelectTrigger>
                        <SelectContent>
                            {providers.map(p => <SelectItem key={p._id} value={p._id}>{p.name} · {p.city || 'BD'}{p.fee ? ` · ৳${p.fee}` : ''}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label>{t('fp.journey.bookingWidget.prefDate')}</Label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
            </div>
            <Button onClick={book} disabled={createMut.isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                {createMut.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gift className="h-4 w-4" />} {t('fp.journey.bookingWidget.confirm')}
            </Button>
        </div>
    );
};

export default BookingWidget;
