import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'nikah-recently-viewed';
const MAX_ITEMS = 20;

export function useRecentlyViewed() {
    const [items, setItems] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        const handleClear = () => {
            setItems([]);
        };
        window.addEventListener('clear-recently-viewed', handleClear);
        return () => window.removeEventListener('clear-recently-viewed', handleClear);
    }, []);

    const addView = useCallback((biodata) => {
        setItems(prev => {
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
    }, []);

    const removeItem = useCallback((biodataId) => {
        setItems(prev => prev.filter(item => item.biodataId !== biodataId));
    }, []);

    const clearAll = useCallback(() => {
        setItems([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return { items, addView, removeItem, clearAll };
}
