import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ShieldCheck, Check, X, Loader2, Heart } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { waliAPI } from '../../api/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Public page (no auth) — a wali/guardian uses a single-use magic link to
// approve or decline a contact request on behalf of the profile owner.
const WaliDecision = () => {
    const { token } = useParams();
    const [note, setNote] = useState('');
    const [result, setResult] = useState(null);

    const { data, isLoading, error } = useQuery({
        queryKey: ['waliRequest', token],
        queryFn: async () => { const res = await waliAPI.getDecisionByToken(token); return res.data; },
        retry: false,
    });

    const decisionMutation = useMutation({
        mutationFn: (decision) => waliAPI.submitDecision(token, { decision, waliNote: note }),
        onSuccess: (_data, decision) => setResult(decision),
        onError: () => setResult('error'),
    });

    const decide = (decision) => decisionMutation.mutate(decision);

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-slate-950 grid place-items-center px-4 py-10">
            <Helmet><title>Wali Approval - Nikah</title></Helmet>
            <div className="w-full max-w-lg">
                <div className="text-center mb-6">
                    <p className="font-arabic text-2xl text-emerald-700 dark:text-emerald-400 mb-1" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
                        <ShieldCheck className="h-4 w-4" /> Wali (Guardian) Approval
                    </div>
                </div>

                <Card>
                    <CardContent className="p-6 md:p-8">
                        {isLoading ? (
                            <div className="flex flex-col items-center py-10">
                                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                                <p className="mt-3 text-sm text-muted-foreground">Loading request…</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8">
                                <X className="h-10 w-10 text-rose-500 mx-auto mb-3" />
                                <h2 className="font-bold text-lg text-foreground">Invalid or expired link</h2>
                                <p className="text-sm text-muted-foreground mt-1">This approval link is not valid or has already been used.</p>
                            </div>
                        ) : result ? (
                            <div className="text-center py-8">
                                {result === 'approved' ? (
                                    <>
                                        <Check className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
                                        <h2 className="font-bold text-lg text-foreground">Approved</h2>
                                        <p className="text-sm text-muted-foreground mt-1">You approved the contact request. {data?.biodataOwnerName} has been notified.</p>
                                    </>
                                ) : result === 'rejected' ? (
                                    <>
                                        <X className="h-12 w-12 text-rose-500 mx-auto mb-3" />
                                        <h2 className="font-bold text-lg text-foreground">Declined</h2>
                                        <p className="text-sm text-muted-foreground mt-1">You declined the contact request. {data?.biodataOwnerName} has been notified.</p>
                                    </>
                                ) : (
                                    <>
                                        <X className="h-12 w-12 text-rose-500 mx-auto mb-3" />
                                        <h2 className="font-bold text-lg text-foreground">Something went wrong</h2>
                                        <p className="text-sm text-muted-foreground mt-1">Please try again.</p>
                                    </>
                                )}
                            </div>
                        ) : data?.decidedAt ? (
                            <div className="text-center py-8">
                                <ShieldCheck className="h-10 w-10 text-amber-500 mx-auto mb-3" />
                                <h2 className="font-bold text-lg text-foreground">Already decided</h2>
                                <p className="text-sm text-muted-foreground mt-1">This request was already {data.status}.</p>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Assalamu Alaikum{data?.waliName ? `, ${data.waliName}` : ''}. You are listed as the wali (guardian) of <span className="font-semibold text-foreground">{data?.biodataOwnerName}</span>.
                                </p>

                                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.05] p-4 mb-5">
                                    <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 mb-1">
                                        <Heart className="h-4 w-4" /> Marriage intent
                                    </div>
                                    <p className="text-sm text-foreground">
                                        <span className="font-semibold">{data?.requesterName}</span> (Biodata #{data?.requesterBiodataId}) is requesting {data?.biodataOwnerName}'s contact information with the intention of marriage.
                                    </p>
                                </div>

                                <div className="space-y-1.5 mb-5">
                                    <Label htmlFor="note">Note (optional)</Label>
                                    <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Any message for the family…" rows={3} />
                                </div>

                                <p className="text-xs text-muted-foreground mb-4">Your decision is final for this request. As the wali, your consent protects the dignity of the process.</p>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button onClick={() => decide('approved')} disabled={decisionMutation.isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                                        <Check className="h-4 w-4" /> Approve
                                    </Button>
                                    <Button onClick={() => decide('rejected')} disabled={decisionMutation.isLoading} variant="outline" className="text-rose-600 border-rose-500/40 hover:bg-rose-500/10">
                                        <X className="h-4 w-4" /> Decline
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-muted-foreground mt-4">Nikah — Islamic Matrimony · Guardian-protected matchmaking</p>
            </div>
        </div>
    );
};

export default WaliDecision;
