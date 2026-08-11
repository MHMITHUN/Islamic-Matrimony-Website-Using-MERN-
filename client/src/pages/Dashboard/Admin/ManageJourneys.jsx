import { useQuery } from '@tanstack/react-query';
import { HeartHandshake, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { journeyAPI } from '../../../api/api';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

const STAGE_LABEL = { connected: 'Connected', supervised_intro: 'Supervised Intro', counseling: 'Counseling', mahr_agreed: 'Mahr Agreed', kazi_booked: 'Kazi Booked', nikah_registered: 'Nikah' };

const ManageJourneys = () => {
    const { data: journeys = [], isLoading } = useQuery({
        queryKey: ['adminJourneys'],
        queryFn: async () => { const r = await journeyAPI.getAdminAll(); return r.data; }
    });

    return (
        <>
            <Helmet><title>Marriage Journeys - Admin</title></Helmet>
            <div className="space-y-6">
                <PageHeader title="Marriage Journeys" description="All end-to-end nikah journeys on the platform" icon={HeartHandshake} />
                <Card className="overflow-hidden">
                    {isLoading ? <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                        : journeys.length === 0 ? <EmptyState icon={HeartHandshake} title="No journeys yet" description="When a contact request is approved, a journey auto-starts and appears here." />
                            : (
                                <Table>
                                    <TableHeader><TableRow><TableHead>Pair</TableHead><TableHead>Stage</TableHead><TableHead className="hidden md:table-cell">Started</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {journeys.map(j => (
                                            <TableRow key={j._id}>
                                                <TableCell className="font-medium tabular-nums">#{j.biodataA} ↔ #{j.biodataB}</TableCell>
                                                <TableCell><Badge variant="outline">{STAGE_LABEL[j.currentStage] || j.currentStage}</Badge></TableCell>
                                                <TableCell className="hidden md:table-cell text-muted-foreground">{new Date(j.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell><Badge variant={j.status === 'completed' ? 'success' : 'soft'} className="capitalize">{j.status}</Badge></TableCell>
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

export default ManageJourneys;
