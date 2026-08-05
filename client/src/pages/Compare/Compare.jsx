import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaBalanceScale, FaUser, FaMapMarkerAlt, FaBriefcase, FaRulerVertical, FaWeight, FaCalendar, FaHeart } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

const STORAGE_KEY = 'nikah-compare-list';

const Compare = () => {
    const [compareList, setCompareList] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    });

    const removeFromCompare = (biodataId) => {
        const newList = compareList.filter(id => id !== biodataId);
        setCompareList(newList);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    };

    const clearAll = () => {
        setCompareList([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <>
            <Helmet><title>Compare Biodatas - Nikah Matrimony</title></Helmet>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
                <div className="container-custom">
                    <div className="text-center mb-8">
                        <FaBalanceScale className="text-3xl text-emerald-600 mx-auto mb-3" />
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Compare Biodatas</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Side-by-side comparison of selected profiles</p>
                    </div>

                    {compareList.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <FaBalanceScale className="text-3xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                            <h3 className="text-base font-bold text-gray-700 dark:text-gray-200 mb-1">No profiles to compare</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Add profiles to compare from the biodata listing page</p>
                            <Link to="/biodatas" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors">
                                Browse Biodatas
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400">{compareList.length} profile(s) selected</p>
                                <button onClick={clearAll} className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium">Clear All</button>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                                    Comparison view shows Biodata IDs: {compareList.map(id => `#${id}`).join(', ')}
                                </p>
                                <p className="text-xs text-gray-400">Note: Full comparison requires loading biodata details. Visit each profile to compare.</p>
                                <div className="flex flex-wrap gap-2 justify-center mt-4">
                                    {compareList.map(id => (
                                        <div key={id} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">#{id}</span>
                                            <Link to={`/biodata/${id}`} className="text-xs text-emerald-600 hover:underline">View</Link>
                                            <button onClick={() => removeFromCompare(id)} className="text-gray-400 hover:text-red-500"><FaTimes className="text-[10px]" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Compare;
