import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Gift, Loader2, CheckCircle2 } from 'lucide-react';
import { mahrAPI } from '../../api/api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

const AMOUNT_TYPES = [
    { value: 'fixed', label: 'Fixed amount' },
    { value: 'mahr_e_mithl', label: 'Mahr-e-mithl (customary)' },
    { value: 'deferred', label: 'Deferred (mu\'ajjal)' },
    { value: 'to_discuss', label: 'To discuss' }
];

const MahrWidget = ({ journeyId, agreement }) => {
    const qc = useQueryClient();
    const [amount, setAmount] = useState('');
    const [amountType, setAmountType] = useState('to_discuss');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (agreement) {
            setAmount(agreement.amount || '');
            setAmountType(agreement.amountType || 'to_discuss');
            setDescription(agreement.description || '');
        }
    }, [agreement]);

    const saveMut = useMutation({
        mutationFn: (data) => mahrAPI.save(data),
        onSuccess: () => { qc.invalidateQueries(['journey', journeyId]); toast.success('Mahr terms saved'); },
        onError: (e) => toast.error(e.response?.data?.message || 'Failed')
    });
    const confirmMut = useMutation({
        mutationFn: (id) => mahrAPI.confirm(id),
        onSuccess: () => { qc.invalidateQueries(['journey', journeyId]); toast.success('Your confirmation recorded'); },
        onError: (e) => toast.error(e.response?.data?.message || 'Failed')
    });

    const agreed = agreement?.status === 'agreed';
    const myConfirm = false; // The backend doesn't tell us which side we are; the confirm button reflects "I confirm"

    return (
        <div className="space-y-3">
            <p className="text-sm text-muted-foreground">The mahr is the wife\'s Qur\'anic right (4:4). Agree the terms respectfully before the nikah.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                    <Label>Amount (BDT)</Label>
                    <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 100000" disabled={agreed} />
                </div>
                <div className="space-y-1.5">
                    <Label>Type</Label>
                    <Select value={amountType} onValueChange={setAmountType} disabled={agreed}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{AMOUNT_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label>Status</Label>
                    <div className="h-9 flex items-center"><Badge variant="outline" className="capitalize">{agreement?.status || 'draft'}</Badge></div>
                </div>
            </div>
            <div className="space-y-1.5">
                <Label>Notes / description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} disabled={agreed} />
            </div>
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => saveMut.mutate({ journeyId, amount, amountType, description })} disabled={agreed || saveMut.isLoading}>
                    {saveMut.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gift className="h-4 w-4" />} Save terms
                </Button>
                {!agreed && agreement?._id && (
                    <Button onClick={() => confirmMut.mutate(agreement._id)} disabled={confirmMut.isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                        {confirmMut.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} I confirm these terms
                    </Button>
                )}
                {agreed && <Badge className="bg-emerald-600 text-white gap-1"><CheckCircle2 className="h-3 w-3" /> Both confirmed</Badge>}
            </div>
        </div>
    );
};

export default MahrWidget;
