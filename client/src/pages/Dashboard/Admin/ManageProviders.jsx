import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, Award, Loader2, Plus } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { providerAPI } from '../../../api/api';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import toast from 'react-hot-toast';

const ManageProviders = () => {
    const qc = useQueryClient();
    const [typeFilter, setTypeFilter] = useState('');
    const [form, setForm] = useState({ name: '', serviceType: 'kazi', city: '', phone: '', fee: '' });

    const { data: providers = [], isLoading } = useQuery({
        queryKey: ['adminProviders', typeFilter],
        queryFn: async () => { const r = await providerAPI.getAll(typeFilter ? { serviceType: typeFilter } : {}); return r.data; }
    });

    const verifyMut = useMutation({
        mutationFn: (id) => providerAPI.verify(id),
        onSuccess: () => { qc.invalidateQueries(['adminProviders']); toast.success('Verified'); }
    });
    const createMut = useMutation({
        mutationFn: (data) => providerAPI.create(data),
        onSuccess: () => { qc.invalidateQueries(['adminProviders']); toast.success('Provider created'); setForm({ name: '', serviceType: 'kazi', city: '', phone: '', fee: '' }); },
        onError: (e) => toast.error(e.response?.data?.message || 'Failed')
    });

    return (
        <>
            <Helmet><title>Manage Providers - Admin</title></Helmet>
            <div className="space-y-6">
                <PageHeader title="Service Providers" description="Imams, Kazis & Counselors directory" icon={ShieldCheck} />

                <Card><CardContent className="p-5">
                    <h3 className="font-heading font-bold text-foreground mb-3 flex items-center gap-2"><Plus className="h-4 w-4" /> Add a provider</h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                        <div className="space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                        <div className="space-y-1.5"><Label>Type</Label><Select value={form.serviceType} onValueChange={(v) => setForm(f => ({ ...f, serviceType: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="imam">Imam</SelectItem><SelectItem value="kazi">Kazi</SelectItem><SelectItem value="counselor">Counselor</SelectItem></SelectContent></Select></div>
                        <div className="space-y-1.5"><Label>City</Label><Input value={form.city} onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))} /></div>
                        <div className="space-y-1.5"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
                        <Button onClick={() => createMut.mutate(form)} disabled={createMut.isLoading || !form.name}>{createMut.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add</Button>
                    </div>
                </CardContent></Card>

                <Card className="overflow-hidden">
                    <div className="p-3 border-b border-border">
                        <Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger className="w-44"><SelectValue placeholder="All types" /></SelectTrigger><SelectContent><SelectItem value="">All types</SelectItem><SelectItem value="imam">Imam</SelectItem><SelectItem value="kazi">Kazi</SelectItem><SelectItem value="counselor">Counselor</SelectItem></SelectContent></Select>
                    </div>
                    {isLoading ? <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                        : providers.length === 0 ? <EmptyState icon={ShieldCheck} title="No providers" description="Add imams, kazis and counselors above." />
                            : (
                                <Table>
                                    <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead className="hidden md:table-cell">City</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {providers.map(p => (
                                            <TableRow key={p._id}>
                                                <TableCell className="font-medium">{p.name}</TableCell>
                                                <TableCell className="capitalize">{p.serviceType}</TableCell>
                                                <TableCell className="hidden md:table-cell text-muted-foreground">{p.city || '—'}</TableCell>
                                                <TableCell>{p.verified ? <Badge className="bg-emerald-600 text-white gap-1"><Award className="h-3 w-3" /> Verified</Badge> : <Badge variant="outline">Unverified</Badge>}</TableCell>
                                                <TableCell className="text-right">{!p.verified && <Button size="sm" variant="outline" onClick={() => verifyMut.mutate(p._id)}>Verify</Button>}</TableCell>
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

export default ManageProviders;
