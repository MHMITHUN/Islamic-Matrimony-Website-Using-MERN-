import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, Trash2, Search, Clock, Loader2 } from 'lucide-react';
import { contactMessageAPI } from '../../../api/api';
import PageHeader from '../../../components/dashboard/PageHeader';
import EmptyState from '../../../components/dashboard/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ContactMessages = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient();

    const { data: messages = [], isLoading } = useQuery({
        queryKey: ['contactMessages'],
        queryFn: async () => { const response = await contactMessageAPI.getAll(); return response.data; },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => contactMessageAPI.delete(id),
        onSuccess: () => { queryClient.invalidateQueries(['contactMessages']); toast.success('Message deleted successfully'); },
        onError: () => { toast.error('Failed to delete message'); },
    });

    const handleDelete = async (id) => {
        const result = await Swal.fire({ title: 'Delete Message?', text: "You won't be able to revert this!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b', confirmButtonText: 'Yes, delete it!' });
        if (result.isConfirmed) deleteMutation.mutate(id);
    };

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <div className="space-y-6">
            <PageHeader title="Contact Messages" description="View and manage messages from the contact form." icon={Mail}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search messages..." className="pl-9 w-full sm:w-72" />
                </div>
            </PageHeader>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /><p className="mt-3 text-muted-foreground text-sm">Loading messages...</p></div>
            ) : filteredMessages.length === 0 ? (
                <EmptyState icon={Mail} title="No Messages Found" description="Your inbox is empty." />
            ) : (
                <div className="grid gap-4">
                    {filteredMessages.map((msg) => (
                        <Card key={msg._id} className="card-lift hover:border-primary/30">
                            <CardContent className="p-5">
                                <div className="flex flex-col md:flex-row gap-5">
                                    <div className="md:w-1/4 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10"><AvatarFallback className="bg-gradient-brand text-white">{msg.name.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-foreground truncate">{msg.name}</h3>
                                                <p className="text-sm text-muted-foreground truncate">{msg.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{formatDate(msg.createdAt)}</div>
                                    </div>

                                    <div className="flex-1 space-y-2 min-w-0">
                                        <h4 className="font-bold text-foreground flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" />{msg.subject}</h4>
                                        <p className="text-muted-foreground bg-muted/50 p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.message}</p>
                                    </div>

                                    <div className="flex items-start justify-end">
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(msg._id)} title="Delete Message">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContactMessages;
