import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, Award, Loader2, Plus, Pencil, Trash2, CheckCircle, XCircle, Phone, MapPin, Eye, Search } from 'lucide-react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ManageProviders = () => {
    const qc = useQueryClient();
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingProvider, setEditingProvider] = useState(null);

    const [form, setForm] = useState({
        name: '', serviceType: 'imam', title: '', organization: '', city: 'Dhaka', area: '', phone: '', email: '', bio: '', fee: '0', yearsExperience: '0'
    });

    const { data: providers = [], isLoading } = useQuery({
        queryKey: ['adminProviders', typeFilter],
        queryFn: async () => {
            const params = typeFilter ? { serviceType: typeFilter, admin: true } : { admin: true };
            const r = await providerAPI.getAll(params);
            return r.data;
        }
    });

    const verifyMut = useMutation({
        mutationFn: (id) => providerAPI.verify(id),
        onSuccess: () => { qc.invalidateQueries(['adminProviders']); toast.success('Provider verified'); }
    });

    const toggleActiveMut = useMutation({
        mutationFn: (id) => providerAPI.toggleActive(id),
        onSuccess: (res) => { qc.invalidateQueries(['adminProviders']); toast.success(res.data.message); }
    });

    const deleteMut = useMutation({
        mutationFn: (id) => providerAPI.delete(id),
        onSuccess: () => { qc.invalidateQueries(['adminProviders']); toast.success('Provider deleted'); }
    });

    const createMut = useMutation({
        mutationFn: (data) => providerAPI.create(data),
        onSuccess: () => {
            qc.invalidateQueries(['adminProviders']);
            toast.success('Provider created successfully');
            setIsCreateOpen(false);
            setForm({ name: '', serviceType: 'imam', title: '', organization: '', city: 'Dhaka', area: '', phone: '', email: '', bio: '', fee: '0', yearsExperience: '0' });
        },
        onError: (e) => toast.error(e.response?.data?.message || 'Failed to create provider')
    });

    const updateMut = useMutation({
        mutationFn: ({ id, data }) => providerAPI.update(id, data),
        onSuccess: () => {
            qc.invalidateQueries(['adminProviders']);
            toast.success('Provider updated successfully');
            setEditingProvider(null);
        },
        onError: (e) => toast.error(e.response?.data?.message || 'Failed to update provider')
    });

    const handleDelete = async (p) => {
        const r = await Swal.fire({
            title: 'Delete Service Provider?',
            text: `Are you sure you want to remove ${p.name} from the directory?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, Delete'
        });
        if (r.isConfirmed) deleteMut.mutate(p._id);
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        if (!editingProvider) return;
        updateMut.mutate({ id: editingProvider._id, data: editingProvider });
    };

    const filteredProviders = providers.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.city && p.city.toLowerCase().includes(search.toLowerCase())) ||
            (p.organization && p.organization.toLowerCase().includes(search.toLowerCase()));

        if (!matchesSearch) return false;

        if (statusFilter === 'verified') return p.verified;
        if (statusFilter === 'pending') return !p.verified;
        if (statusFilter === 'inactive') return !p.active;
        return true;
    });

    return (
        <>
            <Helmet><title>Manage Service Providers - Admin</title></Helmet>
            <div className="space-y-6">
                <PageHeader title="Service Providers" description="Manage Imams, Kazis & Counselors in the directory" icon={ShieldCheck}>
                    <Button onClick={() => setIsCreateOpen(true)} className="gap-2 shadow-glow">
                        <Plus className="h-4 w-4" /> Add Provider
                    </Button>
                </PageHeader>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-card border border-border rounded-xl p-4">
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or city..."
                                className="pl-9"
                            />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-36"><SelectValue placeholder="All Types" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Types</SelectItem>
                                <SelectItem value="imam">Imam</SelectItem>
                                <SelectItem value="kazi">Kazi</SelectItem>
                                <SelectItem value="counselor">Counselor</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-36"><SelectValue placeholder="All Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending Approval</SelectItem>
                                <SelectItem value="verified">Verified</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="text-xs text-muted-foreground font-medium">
                        Showing {filteredProviders.length} of {providers.length} providers
                    </div>
                </div>

                {/* Table */}
                <Card className="overflow-hidden">
                    {isLoading ? (
                        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                    ) : filteredProviders.length === 0 ? (
                        <EmptyState icon={ShieldCheck} title="No providers found" description="Try adjusting your filters or click 'Add Provider' to create one." />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Provider</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="hidden md:table-cell">City / Area</TableHead>
                                    <TableHead className="hidden sm:table-cell">Contact</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProviders.map(p => (
                                    <TableRow key={p._id}>
                                        <TableCell>
                                            <div className="font-semibold text-foreground">{p.name}</div>
                                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">{p.title || p.organization || '—'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {p.serviceType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                                            <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.city || 'Dhaka'} {p.area ? `(${p.area})` : ''}</div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1"><Phone className="h-3 w-3" /> {p.phone || '—'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1 items-start">
                                                {p.verified ? (
                                                    <Badge className="bg-emerald-600 text-white gap-1 text-[10px]"><Award className="h-2.5 w-2.5" /> Verified</Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="text-[10px]">Pending Approval</Badge>
                                                )}
                                                {!p.active && <Badge variant="destructive" className="text-[10px]">Inactive</Badge>}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {!p.verified && (
                                                    <Button size="sm" variant="outline" className="h-8 text-xs text-emerald-600 border-emerald-600/30 hover:bg-emerald-500/10" onClick={() => verifyMut.mutate(p._id)} disabled={verifyMut.isLoading}>
                                                        <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                                                    </Button>
                                                )}
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setEditingProvider({ ...p })}>
                                                    <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                                                </Button>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(p)}>
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Card>

                {/* Add Modal */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Service Provider</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1.5"><Label>Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
                                <div className="space-y-1.5">
                                    <Label>Type *</Label>
                                    <Select value={form.serviceType} onValueChange={v => setForm(f => ({ ...f, serviceType: v }))}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value="imam">Imam</SelectItem><SelectItem value="kazi">Kazi</SelectItem><SelectItem value="counselor">Counselor</SelectItem></SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1.5"><Label>Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Senior Khatib" /></div>
                                <div className="space-y-1.5"><Label>Organization</Label><Input value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} placeholder="Central Mosque" /></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1.5"><Label>City</Label><Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></div>
                                <div className="space-y-1.5"><Label>Phone *</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required /></div>
                            </div>
                            <div className="space-y-1.5"><Label>Bio</Label><textarea className="w-full rounded-md border border-input p-2 text-sm bg-background" rows={2} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} /></div>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button onClick={() => createMut.mutate(form)} disabled={createMut.isLoading || !form.name || !form.phone}>
                                {createMut.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Create
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Modal */}
                {editingProvider && (
                    <Dialog open={!!editingProvider} onOpenChange={(open) => !open && setEditingProvider(null)}>
                        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Edit Service Provider</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSaveEdit} className="space-y-4 pt-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-1.5"><Label>Name</Label><Input value={editingProvider.name} onChange={e => setEditingProvider(p => ({ ...p, name: e.target.value }))} required /></div>
                                    <div className="space-y-1.5">
                                        <Label>Type</Label>
                                        <Select value={editingProvider.serviceType} onValueChange={v => setEditingProvider(p => ({ ...p, serviceType: v }))}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent><SelectItem value="imam">Imam</SelectItem><SelectItem value="kazi">Kazi</SelectItem><SelectItem value="counselor">Counselor</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-1.5"><Label>Title</Label><Input value={editingProvider.title || ''} onChange={e => setEditingProvider(p => ({ ...p, title: e.target.value }))} /></div>
                                    <div className="space-y-1.5"><Label>Organization</Label><Input value={editingProvider.organization || ''} onChange={e => setEditingProvider(p => ({ ...p, organization: e.target.value }))} /></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-1.5"><Label>City</Label><Input value={editingProvider.city || ''} onChange={e => setEditingProvider(p => ({ ...p, city: e.target.value }))} /></div>
                                    <div className="space-y-1.5"><Label>Phone</Label><Input value={editingProvider.phone || ''} onChange={e => setEditingProvider(p => ({ ...p, phone: e.target.value }))} /></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-1.5"><Label>Fee (BDT)</Label><Input type="number" value={editingProvider.fee || 0} onChange={e => setEditingProvider(p => ({ ...p, fee: Number(e.target.value) }))} /></div>
                                    <div className="space-y-1.5"><Label>Experience (Years)</Label><Input type="number" value={editingProvider.yearsExperience || 0} onChange={e => setEditingProvider(p => ({ ...p, yearsExperience: Number(e.target.value) }))} /></div>
                                </div>
                                <div className="space-y-1.5"><Label>Bio</Label><textarea className="w-full rounded-md border border-input p-2 text-sm bg-background" rows={3} value={editingProvider.bio || ''} onChange={e => setEditingProvider(p => ({ ...p, bio: e.target.value }))} /></div>

                                <div className="flex items-center justify-between pt-2 border-t border-border">
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input type="checkbox" checked={editingProvider.verified} onChange={e => setEditingProvider(p => ({ ...p, verified: e.target.checked }))} className="rounded" />
                                            Verified
                                        </label>
                                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input type="checkbox" checked={editingProvider.active} onChange={e => setEditingProvider(p => ({ ...p, active: e.target.checked }))} className="rounded" />
                                            Active
                                        </label>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" type="button" onClick={() => setEditingProvider(null)}>Cancel</Button>
                                    <Button type="submit" disabled={updateMut.isLoading}>
                                        {updateMut.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </>
    );
};

export default ManageProviders;
