import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, ShieldCheck, Crown, User as UserIcon, Loader2, Users } from 'lucide-react';
import { adminAPI } from '../../../api/api';
import { useLanguage } from '../../../contexts/LanguageContext';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ManageUsers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient();
    const { t } = useLanguage();

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['adminUsers', searchTerm],
        queryFn: async () => { const response = await adminAPI.getUsers(searchTerm); return response.data; },
    });

    const makeAdminMutation = useMutation({
        mutationFn: (id) => adminAPI.makeAdmin(id),
        onSuccess: () => { queryClient.invalidateQueries(['adminUsers']); toast.success(t('toast.userMadeAdmin')); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); },
    });
    const makePremiumMutation = useMutation({
        mutationFn: (id) => adminAPI.makePremium(id),
        onSuccess: () => { queryClient.invalidateQueries(['adminUsers']); toast.success(t('toast.userMadePremium')); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); },
    });
    const removePremiumMutation = useMutation({
        mutationFn: (id) => adminAPI.removePremium(id),
        onSuccess: () => { queryClient.invalidateQueries(['adminUsers']); toast.success(t('toast.premiumRemoved')); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); },
    });

    const handleMakeAdmin = async (user) => {
        const r = await Swal.fire({ title: t('admin.manageUsers.makeAdminTitle'), text: t('admin.manageUsers.makeAdminText').replace('{name}', user.name), icon: 'question', showCancelButton: true, confirmButtonColor: '#10b981', cancelButtonColor: '#ef4444', confirmButtonText: t('admin.manageUsers.makeAdminConfirm') });
        if (r.isConfirmed) makeAdminMutation.mutate(user._id);
    };
    const handleMakePremium = async (user) => {
        const r = await Swal.fire({ title: t('admin.manageUsers.makePremiumTitle'), text: t('admin.manageUsers.makePremiumText').replace('{name}', user.name), icon: 'question', showCancelButton: true, confirmButtonColor: '#f59e0b', cancelButtonColor: '#ef4444', confirmButtonText: t('admin.manageUsers.makePremiumConfirm') });
        if (r.isConfirmed) makePremiumMutation.mutate(user._id);
    };
    const handleRemovePremium = async (user) => {
        const r = await Swal.fire({ title: t('admin.manageUsers.removePremiumTitle'), text: t('admin.manageUsers.removePremiumText').replace('{name}', user.name), icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b', confirmButtonText: t('admin.manageUsers.removePremiumConfirm') });
        if (r.isConfirmed) removePremiumMutation.mutate(user._id);
    };

    return (
        <div className="space-y-6">
            <PageHeader title={t('admin.manageUsers.heading')} description={t('admin.manageUsers.subtitle')} icon={Users}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={t('admin.manageUsers.search')} className="pl-9 w-full sm:w-72" />
                </div>
            </PageHeader>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /><p className="mt-3 text-muted-foreground text-sm">{t('admin.manageUsers.loading')}</p></div>
            ) : users.length === 0 ? (
                <EmptyState icon={UserIcon} title={t('admin.manageUsers.noUsers')} description={t('admin.manageUsers.noUsersDesc')} />
            ) : (
                <Card className="overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('admin.manageUsers.user')}</TableHead>
                                <TableHead className="hidden md:table-cell">{t('admin.manageUsers.email')}</TableHead>
                                <TableHead>{t('admin.manageUsers.role')}</TableHead>
                                <TableHead>{t('admin.manageUsers.status')}</TableHead>
                                <TableHead className="text-right">{t('admin.manageUsers.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary/10 text-primary text-xs">{user.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback></Avatar>
                                            <span className="font-semibold text-foreground">{user.name || 'N/A'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground">{user.email}</TableCell>
                                    <TableCell>
                                        {user.role === 'admin'
                                            ? <Badge variant="success" className="gap-1"><ShieldCheck className="h-3 w-3" /> {t('admin.manageUsers.admin')}</Badge>
                                            : <Badge variant="soft" className="gap-1"><UserIcon className="h-3 w-3" /> {t('admin.manageUsers.userRole')}</Badge>}
                                    </TableCell>
                                    <TableCell>
                                        {user.isPremium
                                            ? <Badge variant="gold" className="gap-1"><Crown className="h-3 w-3" /> {t('admin.manageUsers.premium')}</Badge>
                                            : <span className="text-xs text-muted-foreground">{t('admin.manageUsers.standard')}</span>}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                            {user.role !== 'admin' && (
                                                <Button size="sm" variant="ghost" className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10" onClick={() => handleMakeAdmin(user)} disabled={makeAdminMutation.isLoading}>
                                                    <ShieldCheck className="h-3.5 w-3.5" /> <span className="hidden lg:inline">{t('admin.manageUsers.makeAdmin')}</span>
                                                </Button>
                                            )}
                                            {!user.isPremium && (
                                                <Button size="sm" variant="ghost" className="h-8 text-amber-600 hover:text-amber-700 hover:bg-amber-500/10" onClick={() => handleMakePremium(user)} disabled={makePremiumMutation.isLoading}>
                                                    <Crown className="h-3.5 w-3.5" /> <span className="hidden lg:inline">{t('admin.manageUsers.makePremium')}</span>
                                                </Button>
                                            )}
                                            {user.isPremium && (
                                                <Button size="sm" variant="ghost" className="h-8 text-destructive hover:bg-destructive/10" onClick={() => handleRemovePremium(user)} disabled={removePremiumMutation.isLoading}>
                                                    <Crown className="h-3.5 w-3.5" /> <span className="hidden lg:inline">{t('admin.manageUsers.removePremium')}</span>
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    );
};

export default ManageUsers;
