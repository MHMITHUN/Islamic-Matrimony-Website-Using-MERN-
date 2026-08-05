import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaEnvelope, FaPaperPlane, FaInbox, FaTrash, FaEye, FaClock, FaUser } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { messageAPI } from '../../../api/api';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Messages = () => {
    const [tab, setTab] = useState('inbox');
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [newSubject, setNewSubject] = useState('');
    const [showCompose, setShowCompose] = useState(false);
    const [composeEmail, setComposeEmail] = useState('');
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: inboxData = { messages: [], unreadCount: 0 } } = useQuery({
        queryKey: ['inbox'],
        queryFn: async () => { const res = await messageAPI.getInbox(); return res.data; },
        refetchInterval: 30000
    });

    const { data: sentMessages = [] } = useQuery({
        queryKey: ['sentMessages'],
        queryFn: async () => { const res = await messageAPI.getSent(); return res.data; }
    });

    const { data: conversation = [] } = useQuery({
        queryKey: ['conversation', selectedConversation],
        queryFn: async () => { const res = await messageAPI.getConversation(selectedConversation); return res.data; },
        enabled: !!selectedConversation,
        refetchInterval: 10000
    });

    const sendMutation = useMutation({
        mutationFn: (data) => messageAPI.send(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['inbox']);
            queryClient.invalidateQueries(['sentMessages']);
            queryClient.invalidateQueries(['conversation']);
            setNewMessage('');
            setNewSubject('');
            toast.success('Message sent');
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Failed to send')
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => messageAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['inbox']);
            queryClient.invalidateQueries(['sentMessages']);
            toast.success('Message deleted');
        }
    });

    const handleSend = () => {
        if (!newMessage.trim()) return;
        sendMutation.mutate({
            receiverEmail: selectedConversation || composeEmail,
            subject: newSubject,
            content: newMessage
        });
    };

    const handleCompose = () => {
        if (!composeEmail || !newMessage.trim()) return;
        sendMutation.mutate({
            receiverEmail: composeEmail,
            subject: newSubject,
            content: newMessage
        });
        setShowCompose(false);
        setComposeEmail('');
        setNewMessage('');
        setNewSubject('');
    };

    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diffH = (now - d) / 3600000;
        if (diffH < 24) return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const messages = tab === 'inbox' ? inboxData.messages : sentMessages;

    return (
        <>
            <Helmet><title>Messages - Nikah Matrimony</title></Helmet>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <FaEnvelope className="text-emerald-600" /> Messages
                            {inboxData.unreadCount > 0 && (
                                <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">{inboxData.unreadCount}</span>
                            )}
                        </h1>
                    </div>
                    <button onClick={() => setShowCompose(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors">
                        <FaPaperPlane className="text-xs" /> Compose
                    </button>
                </div>

                <div className="flex gap-4">
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <div className="flex gap-1 mb-3">
                            <button onClick={() => setTab('inbox')} className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${tab === 'inbox' ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                                <FaInbox className="inline mr-1" /> Inbox {inboxData.unreadCount > 0 && `(${inboxData.unreadCount})`}
                            </button>
                            <button onClick={() => setTab('sent')} className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${tab === 'sent' ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                                <FaPaperPlane className="inline mr-1" /> Sent
                            </button>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 max-h-[60vh] overflow-y-auto">
                            {messages.length === 0 ? (
                                <div className="p-6 text-center">
                                    <FaEnvelope className="text-2xl text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                                    <p className="text-xs text-gray-500">No messages</p>
                                </div>
                            ) : messages.map(msg => (
                                <button key={msg._id} onClick={() => { setSelectedConversation(tab === 'inbox' ? msg.senderEmail : msg.receiverEmail); setTab('inbox'); }}
                                    className={`w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${selectedConversation === (tab === 'inbox' ? msg.senderEmail : msg.receiverEmail) ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''} ${!msg.isRead && tab === 'inbox' ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FaUser className="text-emerald-600 text-xs" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className={`text-xs truncate ${!msg.isRead && tab === 'inbox' ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                                                    {tab === 'inbox' ? msg.senderName : msg.receiverName}
                                                </p>
                                                <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{formatTime(msg.createdAt)}</span>
                                            </div>
                                            <p className="text-[10px] text-gray-500 truncate">{msg.subject || msg.content.substring(0, 40)}</p>
                                        </div>
                                        {!msg.isRead && tab === 'inbox' && <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-1 flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        {selectedConversation ? (
                            <>
                                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedConversation}</p>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[50vh]">
                                    {conversation.map(msg => (
                                        <div key={msg._id} className={`flex ${msg.senderEmail === user?.email ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] rounded-lg p-3 ${msg.senderEmail === user?.email ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>
                                                {msg.subject && <p className="text-xs font-semibold mb-1 opacity-80">{msg.subject}</p>}
                                                <p className="text-sm">{msg.content}</p>
                                                <p className={`text-[10px] mt-1 ${msg.senderEmail === user?.email ? 'text-emerald-200' : 'text-gray-400'}`}>{formatTime(msg.createdAt)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex gap-2">
                                        <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
                                            placeholder="Type a message..."
                                            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm outline-none focus:border-emerald-500 dark:text-white" />
                                        <button onClick={handleSend} disabled={!newMessage.trim() || sendMutation.isLoading} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50">
                                            <FaPaperPlane className="text-sm" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <FaEnvelope className="text-3xl text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">Select a conversation or compose a new message</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {showCompose && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowCompose(false)}>
                        <div className="absolute inset-0 bg-black/50"></div>
                        <div className="relative bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-5" onClick={e => e.stopPropagation()}>
                            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">New Message</h2>
                            <div className="space-y-3">
                                <input type="email" value={composeEmail} onChange={e => setComposeEmail(e.target.value)} placeholder="Receiver email" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm outline-none focus:border-emerald-500 dark:text-white" />
                                <input type="text" value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="Subject (optional)" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm outline-none focus:border-emerald-500 dark:text-white" />
                                <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Your message..." rows={4} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm outline-none focus:border-emerald-500 dark:text-white resize-none" />
                                <div className="flex gap-2">
                                    <button onClick={() => setShowCompose(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                                    <button onClick={handleCompose} disabled={!composeEmail || !newMessage.trim()} className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50">Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Messages;
