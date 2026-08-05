import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale, X, Eye, Trash2, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const STORAGE_KEY = 'nikah-compare-list';

const Compare = () => {
    const [compareList, setCompareList] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    });

    const removeFromCompare = (biodataId) => {
        const newList = compareList.filter(id => id !== biodataId);
        setCompareList(newList);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    };

    const clearAll = () => {
        setCompareList([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <>
            <Helmet><title>Compare Biodatas - Nikah Matrimony</title></Helmet>
            <div className="min-h-screen bg-muted/30 pt-20 pb-16">
                <div className="container-custom">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-grid place-items-center h-14 w-14 rounded-2xl bg-primary/10 text-primary mx-auto mb-4"><Scale className="h-7 w-7" /></div>
                        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">Compare Biodatas</h1>
                        <p className="text-muted-foreground text-sm max-w-lg mx-auto">Side-by-side comparison of your selected profiles to help you decide.</p>
                    </div>

                    {compareList.length === 0 ? (
                        <Card className="text-center"><CardContent className="pt-12 pb-12 flex flex-col items-center">
                            <div className="grid place-items-center h-16 w-16 rounded-full bg-muted text-muted-foreground mb-4"><Scale className="h-7 w-7" /></div>
                            <h3 className="font-bold text-foreground mb-1">No profiles to compare</h3>
                            <p className="text-muted-foreground text-sm mb-5">Add profiles to compare from the biodata listing page.</p>
                            <Button asChild><Link to="/biodatas">Browse Biodatas <ArrowRight className="h-4 w-4" /></Link></Button>
                        </CardContent></Card>
                    ) : (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-muted-foreground">{compareList.length} profile(s) selected</p>
                                <Button onClick={clearAll} variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                    <Trash2 className="h-4 w-4" /> Clear All
                                </Button>
                            </div>
                            <Card>
                                <CardContent className="p-6">
                                    <p className="text-muted-foreground text-sm mb-1 text-center">
                                        Selected Biodata IDs: {compareList.map(id => `#${id}`).join(', ')}
                                    </p>
                                    <p className="text-xs text-muted-foreground/70 text-center mb-5">Open each profile below to compare in detail.</p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {compareList.map(id => (
                                            <div key={id} className="flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-lg border bg-card">
                                                <Badge variant="soft" className="tabular-nums">#{id}</Badge>
                                                <Link to={`/biodata/${id}`} className="text-xs text-primary hover:underline inline-flex items-center gap-1"><Eye className="h-3 w-3" /> View</Link>
                                                <button onClick={() => removeFromCompare(id)} className="grid place-items-center h-6 w-6 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" aria-label="Remove">
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Compare;
