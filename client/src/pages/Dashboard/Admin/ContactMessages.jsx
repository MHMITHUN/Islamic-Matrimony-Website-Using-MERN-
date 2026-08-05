import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaEnvelope, FaTrash, FaSearch, FaClock, FaUser, FaCommentAlt } from 'react-icons/fa';
import { contactMessageAPI } from '../../../api/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useState } from 'react';

const ContactMessages = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient();

    const { data: messages = [], isLoading } = useQuery({
        queryKey: ['contactMessages'],
        queryFn: async () => {
            const response = await contactMessageAPI.getAll();
            return response.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => contactMessageAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['contactMessages']);
            toast.success('Message deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete message');
        }
    });

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Message?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            deleteMutation.mutate(id);
        }
    };

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-600 text-sm font-medium mb-2">
                        <FaEnvelope className="text-xs" />
                        <span>Inbox</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">Contact Messages</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage messages from the contact form</p>
                </div>

                {/* Search */}
                <div className="relative group">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search messages..."
                        className="w-full sm:w-72 pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl outline-none transition-all duration-300 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/10 placeholder:text-slate-400 dark:text-slate-200"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="spinner-lg"></div>
                    <p className="mt-4 text-slate-500">Loading messages...</p>
                </div>
            ) : filteredMessages.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-700 p-12 text-center">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaEnvelope className="text-4xl text-slate-300 dark:text-slate-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">No Messages Found</h2>
                    <p className="text-slate-500 dark:text-slate-400">Your inbox is empty.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredMessages.map((msg, index) => (
                        <div
                            key={msg._id}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700 p-6 transition-all duration-300 animate-fade-in-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Sender Info */}
                                <div className="md:w-1/4 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                                            {msg.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 dark:text-white">{msg.name}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{msg.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 pl-13">
                                        <FaClock />
                                        <span>{formatDate(msg.createdAt)}</span>
                                    </div>
                                </div>

                                {/* Message Content */}
                                <div className="flex-1 space-y-2">
                                    <h4 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                        {msg.subject}
                                    </h4>
                                    <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap break-words">
                                        {msg.message}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-start justify-end">
                                    <button
                                        onClick={() => handleDelete(msg._id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Delete Message"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContactMessages;
