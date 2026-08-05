import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, Send, Inbox, Trash2, User as UserIcon, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { messageAPI } from '../../../api/api';
import { useAuth } from '../../../contexts/AuthContext';
import PageHeader from '../../../components/dashboard/PageHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffH = (now - d) / 3600000;
    if (diffH < 24) return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const Messages = () => {
    const [tab, setTab] = useState('inbox');
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [newSubject, setNewSubject] = useState('');
    const [showCompose, setShowCompose] = useState(false);
    const [composeEmail, setComposeEmail] = useState('');
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: inboxData = { messages: [], unreadCount: 0 } } = useQuery({ queryKey: ['inbox'], queryFn: async () => { const res = await messageAPI.getInbox(); return res.data; }, refetchInterval: 30000 });
    const { data: sentMessages = [] } = useQuery({ queryKey: ['sentMessages'], queryFn: async () => { const res = await messageAPI.getSent(); return res.data; } });
    const { data: conversation = [] } = useQuery({ queryKey: ['conversation', selectedConversation], queryFn: async () => { const res = await messageAPI.getConversation(selectedConversation); return res.data; }, enabled: !!selectedConversation, refetchInterval: 10000 });

    const sendMutation = useMutation({
        mutationFn: (data) => messageAPI.send(data),
        onSuccess: () => { queryClient.invalidateQueries(['inbox']); queryClient.invalidateQueries(['sentMessages']); queryClient.invalidateQueries(['conversation']); setNewMessage(''); setNewSubject(''); toast.success('Message sent'); },
        onError: (error) => toast.error(error.response?.data?.message || 'Failed to send'),
    });
    const deleteMutation = useMutation({
        mutationFn: (id) => messageAPI.delete(id),
        onSuccess: () => { queryClient.invalidateQueries(['inbox']); queryClient.invalidateQueries(['sentMessages']); toast.success('Message deleted'); },
    });

    const handleSend = () => {
        if (!newMessage.trim()) return;
        sendMutation.mutate({ receiverEmail: selectedConversation || composeEmail, subject: newSubject, content: newMessage });
    };
    const handleCompose = () => {
        if (!composeEmail || !newMessage.trim()) return;
        sendMutation.mutate({ receiverEmail: composeEmail, subject: newSubject, content: newMessage });
        setShowCompose(false); setComposeEmail(''); setNewMessage(''); setNewSubject('');
    };

    const messages = tab === 'inbox' ? inboxData.messages : sentMessages;

    return (
        <>
            <Helmet><title>Messages - Nikah Matrimony</title></Helmet>
            <div className="space-y-6">
                <PageHeader title="Messages" description="Your conversations." icon={Mail}>
                    {inboxData.unreadCount > 0 && <Badge variant="destructive">{inboxData.unreadCount} unread</Badge>}
                    <Button onClick={() => setShowCompose(true)}><Send className="h-4 w-4" /> Compose</Button>
                </PageHeader>

                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Conversation list */}
                    <div className="w-full lg:w-80 shrink-0">
                        <Tabs value={tab} onValueChange={setTab}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="inbox" className="gap-1.5"><Inbox className="h-3.5 w-3.5" /> Inbox {inboxData.unreadCount > 0 && `(${inboxData.unreadCount})`}</TabsTrigger>
                                <TabsTrigger value="sent" className="gap-1.5"><Send className="h-3.5 w-3.5" /> Sent</TabsTrigger>
                            </TabsList>
                            <TabsContent value="inbox" className="mt-3">
                                <Card className="max-h-[60vh] overflow-y-auto divide-y divide-border">
                                    {inboxData.messages.length === 0 ? (
                                        <div className="p-6 text-center text-xs text-muted-foreground">No messages</div>
                                    ) : inboxData.messages.map((msg) => (
                                        <button key={msg._id} onClick={() => setSelectedConversation(msg.senderEmail)} className={cn('w-full text-left p-3 hover:bg-accent/50 transition-colors', selectedConversation === msg.senderEmail && 'bg-primary/[0.06]')}>
                                            <div className="flex items-center gap-2.5">
                                                <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary text-xs">{msg.senderName?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback></Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className={cn('text-xs truncate', !msg.isRead ? 'font-bold text-foreground' : 'font-medium text-muted-foreground')}>{msg.senderName}</p>
                                                        <span className="text-[10px] text-muted-foreground shrink-0">{formatTime(msg.createdAt)}</span>
                                                    </div>
                                                    <p className="text-[10px] text-muted-foreground truncate">{msg.subject || msg.content.substring(0, 40)}</p>
                                                </div>
                                                {!msg.isRead && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                                            </div>
                                        </button>
                                    ))}
                                </Card>
                            </TabsContent>
                            <TabsContent value="sent" className="mt-3">
                                <Card className="max-h-[60vh] overflow-y-auto divide-y divide-border">
                                    {sentMessages.length === 0 ? (
                                        <div className="p-6 text-center text-xs text-muted-foreground">No sent messages</div>
                                    ) : sentMessages.map((msg) => (
                                        <button key={msg._id} onClick={() => setSelectedConversation(msg.receiverEmail)} className={cn('w-full text-left p-3 hover:bg-accent/50 transition-colors', selectedConversation === msg.receiverEmail && 'bg-primary/[0.06]')}>
                                            <div className="flex items-center gap-2.5">
                                                <Avatar className="h-8 w-8"><AvatarFallback className="bg-muted text-muted-foreground text-xs">{msg.receiverName?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback></Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-foreground truncate">To: {msg.receiverName}</p>
                                                    <p className="text-[10px] text-muted-foreground truncate">{msg.subject || msg.content.substring(0, 40)}</p>
                                                </div>
                                                <span className="text-[10px] text-muted-foreground shrink-0">{formatTime(msg.createdAt)}</span>
                                            </div>
                                        </button>
                                    ))}
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Conversation panel */}
                    <Card className="hidden lg:flex flex-1 flex-col overflow-hidden">
                        {selectedConversation ? (
                            <>
                                <div className="p-3 border-b border-border">
                                    <p className="text-sm font-semibold text-foreground truncate">{selectedConversation}</p>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[50vh]">
                                    {conversation.map((msg) => {
                                        const mine = msg.senderEmail === user?.email;
                                        return (
                                            <div key={msg._id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                                                <div className={cn('max-w-[70%] rounded-2xl p-3', mine ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted text-foreground rounded-bl-sm')}>
                                                    {msg.subject && <p className="text-xs font-semibold mb-1 opacity-80">{msg.subject}</p>}
                                                    <p className="text-sm">{msg.content}</p>
                                                    <p className="text-[10px] mt-1 opacity-60">{formatTime(msg.createdAt)}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="p-3 border-t border-border">
                                    <div className="flex gap-2">
                                        <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." />
                                        <Button onClick={handleSend} disabled={!newMessage.trim() || sendMutation.isLoading} size="icon"><Send className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 grid place-items-center">
                                <div className="text-center">
                                    <Mail className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">Select a conversation or compose a new message</p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Compose dialog */}
                <Dialog open={showCompose} onOpenChange={setShowCompose}>
                    <DialogContent className="max-w-md">
                        <DialogHeader><DialogTitle>New Message</DialogTitle></DialogHeader>
                        <div className="space-y-3">
                            <div className="space-y-1.5"><Label>Receiver email</Label><Input type="email" value={composeEmail} onChange={(e) => setComposeEmail(e.target.value)} placeholder="receiver@example.com" /></div>
                            <div className="space-y-1.5"><Label>Subject (optional)</Label><Input value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="Subject" /></div>
                            <div className="space-y-1.5"><Label>Message</Label><Textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} rows={4} className="resize-none" placeholder="Your message..." /></div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowCompose(false)}>Cancel</Button>
                            <Button onClick={handleCompose} disabled={!composeEmail || !newMessage.trim()}>Send</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
};

export default Messages;
