import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Loader2, Calendar, Gift } from 'lucide-react';
import { providerAPI, bookingAPI } from '../../api/api';
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
        if (!providerId) { toast.error('Select a provider'); return; }
        createMut.mutate({ journeyId, serviceType, providerId, requestedDate: date });
    };

    if (existing?.status === 'completed') {
        return (
            <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> {serviceType === 'kazi' ? 'Kazi' : 'Counseling'} session completed{existing.providerName ? ` — ${existing.providerName}` : ''}.
            </div>
        );
    }
    if (existing) {
        return (
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Booked with <span className="font-semibold text-foreground">{existing.providerName}</span>. <Badge variant="outline" className="ml-1">{existing.status}</Badge></p>
                <Button size="sm" onClick={() => completeMut.mutate(existing._id)} disabled={completeMut.isLoading}>
                    {completeMut.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Mark session completed
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div className="space-y-1.5 md:col-span-2">
                    <Label>Choose a {serviceType === 'kazi' ? 'Kazi (officiant)' : 'counselor'}</Label>
                    <Select value={providerId} onValueChange={setProviderId}>
                        <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                        <SelectContent>
                            {providers.map(p => <SelectItem key={p._id} value={p._id}>{p.name} · {p.city || 'BD'}{p.fee ? ` · ৳${p.fee}` : ''}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label>Preferred date</Label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
            </div>
            <Button onClick={book} disabled={createMut.isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                {createMut.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gift className="h-4 w-4" />} Confirm booking (demo payment)
            </Button>
        </div>
    );
};

export default BookingWidget;
