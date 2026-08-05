import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { recentlyViewedAPI } from '../api/api';

const STORAGE_KEY = 'nikah-recently-viewed';
const MAX_ITEMS = 20;

export function useRecentlyViewed() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Local state for guests
    const [localItems, setLocalItems] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    // Save local state to local storage when guest
    useEffect(() => {
        if (!user) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(localItems));
        }
    }, [localItems, user]);

    // Listen to clear event (e.g. from logout)
    useEffect(() => {
        const handleClear = () => {
            setLocalItems([]);
        };
        window.addEventListener('clear-recently-viewed', handleClear);
        return () => window.removeEventListener('clear-recently-viewed', handleClear);
    }, []);

    // React Query state for authenticated users
    const { data: dbItems = [] } = useQuery({
        queryKey: ['recentlyViewed'],
        queryFn: async () => {
            const res = await recentlyViewedAPI.getAll();
            return res.data;
        },
        enabled: !!user
    });

    const items = user ? dbItems : localItems;

    // Mutations for authenticated users
    const addMutation = useMutation({
        mutationFn: (biodataId) => recentlyViewedAPI.add(biodataId),
        onSuccess: () => queryClient.invalidateQueries(['recentlyViewed'])
    });

    const removeMutation = useMutation({
        mutationFn: (biodataId) => recentlyViewedAPI.remove(biodataId),
        onSuccess: () => queryClient.invalidateQueries(['recentlyViewed'])
    });

    const clearMutation = useMutation({
        mutationFn: () => recentlyViewedAPI.clearAll(),
        onSuccess: () => queryClient.invalidateQueries(['recentlyViewed'])
    });

    const addView = useCallback((biodata) => {
        if (user) {
            addMutation.mutate(biodata.biodataId);
        } else {
            setLocalItems(prev => {
                const filtered = prev.filter(item => item.biodataId !== biodata.biodataId);
                return [
                    {
                        biodataId: biodata.biodataId,
                        name: biodata.name,
                        profileImage: biodata.profileImage,
                        biodataType: biodata.biodataType,
                        occupation: biodata.occupation,
                        age: biodata.age,
                        permanentDivision: biodata.permanentDivision,
                        viewedAt: new Date().toISOString()
                    },
                    ...filtered
                ].slice(0, MAX_ITEMS);
            });
        }
    }, [user, addMutation]);

    const removeItem = useCallback((biodataId) => {
        if (user) {
            removeMutation.mutate(biodataId);
        } else {
            setLocalItems(prev => prev.filter(item => item.biodataId !== biodataId));
        }
    }, [user, removeMutation]);

    const clearAll = useCallback(() => {
        if (user) {
            clearMutation.mutate();
        } else {
            setLocalItems([]);
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [user, clearMutation]);

    return { items, addView, removeItem, clearAll };
}
