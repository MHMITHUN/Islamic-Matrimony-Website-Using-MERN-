import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Leaf, Eye, Search, Loader2, ShieldCheck, Heart, User, Sparkles } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../../api/api';
import { useLanguage } from '../../../contexts/LanguageContext';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

const AdminSukoon = () => {
    const [search, setSearch] = useState('');
    const { t } = useLanguage();

    const { data: sukoonProfiles = [], isLoading } = useQuery({
        queryKey: ['adminSukoonProfiles'],
        queryFn: async () => {
            const res = await adminAPI.getSukoonProfiles();
            return res.data;
        }
    });

    const filtered = sukoonProfiles.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
        p.biodataId?.toString().includes(search) ||
        p.permanentDivision?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Helmet><title>Sukoon Channel Administration - Admin</title></Helmet>
            <div className="space-y-6">
                <PageHeader
                    title={t('fp.sidebar.sukoonChannel')}
                    description={t('fp.sukoon.desc')}
                    icon={Leaf}
                />

                {/* Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="bg-emerald-500/10 border-emerald-500/20">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2.5 rounded-lg bg-emerald-500 text-white"><Leaf className="h-5 w-5" /></div>
                            <div>
                                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{sukoonProfiles.length}</div>
                                <div className="text-xs text-muted-foreground font-medium">Total Sukoon Profiles</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-purple-500/10 border-purple-500/20">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2.5 rounded-lg bg-purple-500 text-white"><Eye className="h-5 w-5" /></div>
                            <div>
                                <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                                    {sukoonProfiles.filter(p => p.sukoonPhotoReveal === 'blurred').length}
                                </div>
                                <div className="text-xs text-muted-foreground font-medium">Blurred Photo Protection</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-sky-500/10 border-sky-500/20">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2.5 rounded-lg bg-sky-500 text-white"><ShieldCheck className="h-5 w-5" /></div>
                            <div>
                                <div className="text-2xl font-bold text-sky-700 dark:text-sky-400">
                                    {sukoonProfiles.filter(p => p.hasChildren).length}
                                </div>
                                <div className="text-xs text-muted-foreground font-medium">With Children</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search Sukoon profiles by ID, name, or email..."
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Profiles Table */}
                <Card className="overflow-hidden">
                    {isLoading ? (
                        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                    ) : filtered.length === 0 ? (
                        <EmptyState icon={Leaf} title={t('fp.sukoon.noProfiles')} description={t('fp.sukoon.desc')} />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Biodata ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Marital Status</TableHead>
                                    <TableHead>Children</TableHead>
                                    <TableHead>Photo Policy</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map(p => (
                                    <TableRow key={p._id}>
                                        <TableCell className="font-semibold text-primary">#{p.biodataId}</TableCell>
                                        <TableCell>
                                            <div className="font-medium text-foreground">{p.name || 'Anonymous'}</div>
                                            <div className="text-xs text-muted-foreground">{p.userEmail}</div>
                                        </TableCell>
                                        <TableCell className="capitalize">{p.biodataType}</TableCell>
                                        <TableCell className="capitalize">
                                            <Badge variant="outline">{p.maritalStatus || 'Remarriage'}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {p.hasChildren ? (
                                                <Badge className="bg-sky-500/10 text-sky-700 dark:text-sky-400">Yes ({p.childrenCount || 1})</Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">No</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="capitalize text-[11px]">
                                                {p.sukoonPhotoReveal || 'blurred'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" variant="ghost" asChild>
                                                <Link to={`/biodata/${p.biodataId}`} target="_blank">
                                                    <Eye className="h-3.5 w-3.5 mr-1" /> View
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Card>
            </div>
        </>
    );
};

export default AdminSukoon;
