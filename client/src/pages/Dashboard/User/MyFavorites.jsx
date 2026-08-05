import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Heart, Trash2, Eye, MapPin, Briefcase, Loader2, Star } from 'lucide-react';
import { favoritesAPI } from '../../../api/api';
import { useLanguage } from '../../../contexts/LanguageContext';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const MyFavorites = () => {
    const queryClient = useQueryClient();
    const { t } = useLanguage();

    const { data: favorites = [], isLoading } = useQuery({
        queryKey: ['myFavorites'],
        queryFn: async () => { const response = await favoritesAPI.getAll(); return response.data; },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => favoritesAPI.remove(id),
        onSuccess: () => { queryClient.invalidateQueries(['myFavorites']); toast.success(t('toast.removeFromFavorites')); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); },
    });

    const handleDelete = async (id) => {
        const result = await Swal.fire({ title: t('dashboard.favorites.removeTitle'), text: t('dashboard.favorites.removeText'), icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b', confirmButtonText: t('dashboard.favorites.removeConfirm') });
        if (result.isConfirmed) deleteMutation.mutate(id);
    };

    if (isLoading) return <div className="flex flex-col items-center justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /><p className="mt-3 text-muted-foreground text-sm">{t('dashboard.favorites.loading')}</p></div>;

    return (
        <div className="space-y-6">
            <PageHeader title={t('dashboard.favorites.heading')} description={t('dashboard.favorites.subtitle')} icon={Heart}>
                <Badge variant="soft">{favorites.length} saved</Badge>
            </PageHeader>

            {favorites.length === 0 ? (
                <EmptyState
                    icon={Heart}
                    title={t('dashboard.favorites.noFavorites')}
                    description={t('dashboard.favorites.noFavoritesDesc')}
                    action={<Button asChild><Link to="/biodatas">{t('dashboard.favorites.browseBiodatas')}</Link></Button>}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {favorites.map((favorite) => (
                        <Card key={favorite._id} className="overflow-hidden card-lift hover:border-primary/30">
                            <div className="relative p-5 bg-gradient-to-r from-rose-500 to-pink-600 text-white overflow-hidden">
                                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10" />
                                <div className="relative flex items-center gap-3">
                                    <Avatar className="h-12 w-12 ring-2 ring-white/30">
                                        <AvatarFallback className="bg-white/20 text-white text-lg">{favorite.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <h3 className="font-bold truncate">{favorite.name}</h3>
                                        <span className="text-white/70 text-sm tabular-nums">ID: #{favorite.biodataId}</span>
                                    </div>
                                </div>
                                <Heart className="absolute top-3 right-3 h-5 w-5 fill-white/30 text-white/40" />
                            </div>
                            <CardContent className="p-5 space-y-3">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <span className="grid place-items-center h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0"><MapPin className="h-4 w-4" /></span>
                                    <span className="truncate">{favorite.permanentAddress || t('biodata.details.notSpecified')}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <span className="grid place-items-center h-8 w-8 rounded-lg bg-sky-500/10 text-sky-600 shrink-0"><Briefcase className="h-4 w-4" /></span>
                                    <span className="truncate">{favorite.occupation || t('biodata.details.notSpecified')}</span>
                                </div>
                                <div className="flex gap-2 pt-1">
                                    <Button asChild className="flex-1"><Link to={`/biodata/${favorite.biodataId}`}><Eye className="h-4 w-4" /> {t('dashboard.favorites.viewProfile')}</Link></Button>
                                    <Button variant="outline" size="icon" onClick={() => handleDelete(favorite._id)} disabled={deleteMutation.isLoading} className="text-destructive hover:text-destructive hover:bg-destructive/10" title={t('dashboard.favorites.remove')}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyFavorites;
