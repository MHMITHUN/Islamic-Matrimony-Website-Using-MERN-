import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { endorsementAPI } from '../../api/api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import toast from 'react-hot-toast';

export const ENDORSE_CATEGORIES = [
    { key: 'honest', label: 'Honest & Truthful' },
    { key: 'prays_regularly', label: 'Prays Regularly' },
    { key: 'good_character', label: 'Good Character' },
    { key: 'good_family', label: 'Good Family' },
    { key: 'knowledgeable_deen', label: 'Knowledgeable in Deen' }
];

// "Endorse this profile" — opens a dialog to vouch for a profile's character/deen.
// Hidden if the viewer cannot endorse (self, or already endorsed).
const EndorseDialog = ({ biodataId }) => {
    const [open, setOpen] = useState(false);
    const [cats, setCats] = useState([]);
    const [note, setNote] = useState('');
    const qc = useQueryClient();

    const { data: can } = useQuery({
        queryKey: ['canEndorse', biodataId],
        queryFn: async () => { const r = await endorsementAPI.canEndorse(biodataId); return r.data; },
        enabled: open
    });

    const mutation = useMutation({
        mutationFn: (data) => endorsementAPI.create(data),
        onSuccess: () => {
            qc.invalidateQueries(['canEndorse', biodataId]);
            qc.invalidateQueries(['endorsementsFor', biodataId]);
            toast.success('Endorsement added — thank you for vouching.');
            setOpen(false); setCats([]); setNote('');
        },
        onError: (e) => toast.error(e.response?.data?.message || 'Failed to endorse')
    });

    const toggle = (k) => setCats(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);

    const submit = () => {
        if (cats.length === 0) { toast.error('Pick at least one category'); return; }
        mutation.mutate({ endorsedBiodataId: biodataId, categories: cats, note });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10">
                    <ShieldCheck className="h-4 w-4" /> Endorse (Tazkiya)
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-600" /> Vouch for this profile</DialogTitle></DialogHeader>
                {can?.isSelf ? (
                    <p className="text-sm text-muted-foreground">You cannot endorse your own profile.</p>
                ) : can?.alreadyEndorsed ? (
                    <p className="text-sm text-muted-foreground">You have already endorsed this profile.</p>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>I can vouch for their (pick all that apply):</Label>
                            <div className="space-y-2">
                                {ENDORSE_CATEGORIES.map(c => (
                                    <div key={c.key} className="flex items-center gap-2">
                                        <Checkbox id={`ec-${c.key}`} checked={cats.includes(c.key)} onCheckedChange={() => toggle(c.key)} />
                                        <Label htmlFor={`ec-${c.key}`} className="cursor-pointer text-sm font-normal">{c.label}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="enote">Note (optional)</Label>
                            <Textarea id="enote" value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="A few words about their character…" />
                        </div>
                        <p className="text-xs text-muted-foreground">Tazkiya is an Islamic testimonial. Vouch honestly — your endorsement carries weight based on your own trust.</p>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    {!can?.isSelf && !can?.alreadyEndorsed && (
                        <Button onClick={submit} disabled={mutation.isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                            {mutation.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} Submit Endorsement
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EndorseDialog;
