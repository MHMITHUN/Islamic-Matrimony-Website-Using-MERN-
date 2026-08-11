import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { endorsementAPI } from '../../api/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import toast from 'react-hot-toast';

// Category keys — labels resolved via t('fp.endorseCat.<key>') so they translate.
export const ENDORSE_CATEGORIES = [
    { key: 'honest' }, { key: 'prays_regularly' }, { key: 'good_character' },
    { key: 'good_family' }, { key: 'knowledgeable_deen' }
];

// "Endorse this profile" — opens a dialog to vouch for a profile's character/deen.
const EndorseDialog = ({ biodataId }) => {
    const { t } = useLanguage();
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
            toast.success(t('fp.tazkiya.endorseSubmit'));
            setOpen(false); setCats([]); setNote('');
        },
        onError: (e) => toast.error(e.response?.data?.message || 'Failed')
    });

    const toggle = (k) => setCats(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);
    const submit = () => {
        if (cats.length === 0) { toast.error(t('fp.tazkiya.pickOne')); return; }
        mutation.mutate({ endorsedBiodataId: biodataId, categories: cats, note });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10">
                    <ShieldCheck className="h-4 w-4" /> {t('fp.tazkiya.endorseBtn')}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-600" /> {t('fp.tazkiya.endorseTitle')}</DialogTitle></DialogHeader>
                {can?.isSelf ? (
                    <p className="text-sm text-muted-foreground">{t('fp.tazkiya.noSelf')}</p>
                ) : can?.alreadyEndorsed ? (
                    <p className="text-sm text-muted-foreground">{t('fp.tazkiya.alreadyEndorsed')}</p>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>{t('fp.tazkiya.endorsePick')}</Label>
                            <div className="space-y-2">
                                {ENDORSE_CATEGORIES.map(c => (
                                    <div key={c.key} className="flex items-center gap-2">
                                        <Checkbox id={`ec-${c.key}`} checked={cats.includes(c.key)} onCheckedChange={() => toggle(c.key)} />
                                        <Label htmlFor={`ec-${c.key}`} className="cursor-pointer text-sm font-normal">{t('fp.endorseCat.' + c.key)}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="enote">{t('fp.tazkiya.endorseNote')}</Label>
                            <Textarea id="enote" value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder={t('fp.tazkiya.endorseNotePh')} />
                        </div>
                        <p className="text-xs text-muted-foreground">{t('fp.tazkiya.endorseHelp')}</p>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>{t('fp.common.cancel')}</Button>
                    {!can?.isSelf && !can?.alreadyEndorsed && (
                        <Button onClick={submit} disabled={mutation.isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                            {mutation.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} {t('fp.tazkiya.endorseSubmit')}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EndorseDialog;
