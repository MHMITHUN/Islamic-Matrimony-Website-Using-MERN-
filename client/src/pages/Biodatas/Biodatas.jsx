import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal, Search, X, ChevronLeft, ChevronRight, Frown } from 'lucide-react';
import { FaMale, FaFemale } from 'react-icons/fa';
import { biodataAPI } from '../../api/api';
import { useLanguage } from '../../contexts/LanguageContext';
import BiodataCard from '../../components/shared/BiodataCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import {
    Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const Biodatas = () => {
    const { t } = useLanguage();
    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        biodataType: searchParams.get('biodataType') || '',
        division: searchParams.get('division') || searchParams.get('permanentDivision') || '',
        minAge: searchParams.get('minAge') || searchParams.get('age') || '',
        maxAge: searchParams.get('maxAge') || '',
    });
    const [page, setPage] = useState(1);
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const limit = 20;

    const divisions = ['Dhaka', 'Chattagram', 'Rangpur', 'Barisal', 'Khulna', 'Mymensingh', 'Sylhet'];

    const translateEnum = (type, value) => {
        if (!value) return value;
        const map = {
            occupation: { 'Student': 'student', 'Job': 'job', 'Business': 'business', 'Housewife': 'housewife', 'Teacher': 'teacher', 'Doctor': 'doctor', 'Engineer': 'engineer', 'Other': 'other' },
            division: { 'Dhaka': 'dhaka', 'Chattagram': 'chattagram', 'Rangpur': 'rangpur', 'Barisal': 'barisal', 'Khulna': 'khulna', 'Mymensingh': 'mymensingh', 'Sylhet': 'sylhet' },
            biodataType: { 'Male': 'biodata.filters.male', 'Female': 'biodata.filters.female' },
        };
        if (type === 'biodataType') {
            const key = map.biodataType[value];
            return key ? t(key) : value;
        }
        const key = map[type]?.[value];
        return key ? t(`enum.${type}.${key}`) : value;
    };

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['biodatas', filters, page],
        queryFn: async () => {
            const params = {
                page, limit,
                ...(filters.biodataType && { biodataType: filters.biodataType }),
                ...(filters.division && { division: filters.division }),
                ...(filters.minAge && { minAge: filters.minAge }),
                ...(filters.maxAge && { maxAge: filters.maxAge }),
            };
            const response = await biodataAPI.getAll(params);
            return response.data;
        },
        placeholderData: (prev) => prev,
    });

    const biodatas = data?.biodatas || [];
    const pagination = data?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 };

    const setFilter = (name, value) => { setFilters(prev => ({ ...prev, [name]: value })); setPage(1); };
    const clearFilters = () => { setFilters({ biodataType: '', division: '', minAge: '', maxAge: '' }); setPage(1); };

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    const genderOptions = [
        { value: '', label: t('biodata.filters.all') },
        { value: 'Male', label: t('biodata.filters.male'), icon: <FaMale className="text-sky-500" /> },
        { value: 'Female', label: t('biodata.filters.female'), icon: <FaFemale className="text-rose-500" /> },
    ];

    const renderFilterContent = () => (
        <div className="space-y-6">
            <div>
                <Label className="text-sm font-semibold mb-2.5 block">{t('biodata.filters.biodataType')}</Label>
                <div className="grid grid-cols-3 gap-1.5">
                    {genderOptions.map((option) => (
                        <button
                            key={option.value || 'all'}
                            type="button"
                            onClick={() => setFilter('biodataType', option.value)}
                            className={cn(
                                'flex flex-col items-center justify-center gap-1 rounded-lg border px-2 py-2.5 text-xs font-medium transition-all',
                                filters.biodataType === option.value
                                    ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary/20'
                                    : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground'
                            )}
                        >
                            {option.icon || <span className="text-sm">✦</span>}
                            <span className="truncate">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <Label className="text-sm font-semibold mb-2.5 block">{t('biodata.filters.ageRange')}</Label>
                <div className="flex items-center gap-2">
                    <Input type="number" name="minAge" value={filters.minAge} onChange={(e) => setFilter('minAge', e.target.value)} placeholder={t('biodata.filters.min')} />
                    <span className="text-muted-foreground text-sm">—</span>
                    <Input type="number" name="maxAge" value={filters.maxAge} onChange={(e) => setFilter('maxAge', e.target.value)} placeholder={t('biodata.filters.max')} />
                </div>
            </div>

            <div>
                <Label className="text-sm font-semibold mb-2.5 block">{t('biodata.filters.division')}</Label>
                <Select value={filters.division} onValueChange={(v) => setFilter('division', v)}>
                    <SelectTrigger><SelectValue placeholder={t('biodata.filters.allDivisions')} /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">{t('biodata.filters.allDivisions')}</SelectItem>
                        {divisions.map(div => <SelectItem key={div} value={div}>{translateEnum('division', div)}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            <Button onClick={clearFilters} variant="outline" className="w-full">
                <X className="h-4 w-4" /> {t('biodata.filters.clearAll')}
            </Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-muted/30 pt-20 pb-12">
            <div className="container-custom">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{t('biodata.filters.heading')}</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {pagination.totalItems > 0 ? t('biodata.filters.showing').replace('{count}', pagination.totalItems) : t('biodata.filters.searchFor')}
                        </p>
                    </div>
                    <Button onClick={() => setShowMobileFilter(true)} variant="outline" className="md:hidden">
                        <SlidersHorizontal className="h-4 w-4" /> {t('biodata.filters.filters')}
                        {activeFilterCount > 0 && <Badge variant="default" className="ml-1">{activeFilterCount}</Badge>}
                    </Button>
                </div>

                <div className="flex gap-8">
                    {/* Desktop sidebar */}
                    <aside className="hidden md:block w-72 flex-shrink-0">
                        <Card className="sticky top-24">
                            <CardContent className="p-5">
                                <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-border">
                                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-primary/10 text-primary"><SlidersHorizontal className="h-4 w-4" /></span>
                                    <div>
                                        <h2 className="text-sm font-bold text-foreground">{t('biodata.filters.filters')}</h2>
                                        <p className="text-xs text-muted-foreground">{t('biodata.filters.refine')}</p>
                                    </div>
                                </div>
                                {renderFilterContent()}
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Mobile filter sheet */}
                    <Sheet open={showMobileFilter} onOpenChange={setShowMobileFilter}>
                        <SheetContent side="left" className="w-[320px] overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-primary" /> {t('biodata.filters.filters')}</SheetTitle>
                            </SheetHeader>
                            <div className="px-4 pb-6">{renderFilterContent()}</div>
                        </SheetContent>
                    </Sheet>

                    {/* Main */}
                    <main className="flex-1 min-w-0">
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="rounded-2xl overflow-hidden border bg-card">
                                        <div className="aspect-[4/5] bg-muted animate-pulse" />
                                        <div className="p-4 space-y-2"><div className="h-4 w-2/3 bg-muted rounded animate-pulse" /><div className="h-3 w-1/2 bg-muted rounded animate-pulse" /></div>
                                    </div>
                                ))}
                            </div>
                        ) : biodatas.length === 0 ? (
                            <Card className="text-center py-16">
                                <CardContent className="pt-16 flex flex-col items-center">
                                    <div className="grid place-items-center h-16 w-16 rounded-full bg-muted text-muted-foreground mb-4"><Frown className="h-7 w-7" /></div>
                                    <h3 className="text-lg font-bold text-foreground mb-1">{t('biodata.filters.noResults')}</h3>
                                    <p className="text-muted-foreground text-sm mb-5">{t('biodata.filters.noResultsDesc')}</p>
                                    <Button onClick={clearFilters}>{t('biodata.filters.clearAll')}</Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 transition-opacity', isFetching && 'opacity-50')}>
                                    {biodatas.map((biodata, index) => (
                                        <BiodataCard
                                            key={biodata._id}
                                            biodata={{
                                                ...biodata,
                                                occupation: translateEnum('occupation', biodata.occupation),
                                                permanentDivision: translateEnum('division', biodata.permanentDivision),
                                            }}
                                            index={index}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border bg-card p-4">
                                    <p className="text-xs text-muted-foreground">
                                        {t('biodata.filters.pagination')
                                            .replace('{start}', ((page - 1) * limit) + 1)
                                            .replace('{end}', Math.min(page * limit, pagination.totalItems))
                                            .replace('{total}', pagination.totalItems)}
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                        <Button variant="outline" size="icon" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                                            let pageNum;
                                            if (pagination.totalPages <= 5) pageNum = i + 1;
                                            else if (page <= 3) pageNum = i + 1;
                                            else if (page >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i;
                                            else pageNum = page - 2 + i;
                                            return (
                                                <Button
                                                    key={i}
                                                    variant={page === pageNum ? 'default' : 'outline'}
                                                    size="icon"
                                                    className="h-9 w-9 text-xs font-semibold"
                                                    onClick={() => setPage(pageNum)}
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        })}
                                        <Button variant="outline" size="icon" onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}>
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Biodatas;
