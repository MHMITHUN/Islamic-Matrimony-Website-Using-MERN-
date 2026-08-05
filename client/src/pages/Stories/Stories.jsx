import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaHeart, FaStar, FaQuoteLeft, FaTimes, FaCalendar, FaFilter } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { successStoryAPI } from '../../api/api';

const Stories = () => {
    const [selectedStory, setSelectedStory] = useState(null);
    const [minRating, setMinRating] = useState(0);

    const { data: stories = [], isLoading } = useQuery({
        queryKey: ['successStories'],
        queryFn: async () => { const res = await successStoryAPI.getAll(); return res.data; }
    });

    const filtered = stories.filter(s => minRating === 0 || s.reviewStar >= minRating);
    const renderStars = (rating) => [...Array(5)].map((_, i) => <FaStar key={i} className={i < rating ? 'text-amber-400' : 'text-gray-200 dark:text-gray-600'} />);

    return (
        <>
            <Helmet><title>Success Stories - Nikah Matrimony</title></Helmet>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
                <div className="container-custom">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            Success Stories
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-sm">
                            Real couples who found their life partners through our platform
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-8">
                        <FaFilter className="text-gray-400 text-xs" />
                        <span className="text-xs text-gray-500">Filter by rating:</span>
                        {[0, 3, 4, 5].map(r => (
                            <button key={r} onClick={() => setMinRating(r)} className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${minRating === r ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-emerald-500'}`}>
                                {r === 0 ? 'All' : `${r}+ ★`}
                            </button>
                        ))}
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-12"><div className="spinner-lg"></div></div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <FaHeart className="text-3xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                            <h3 className="text-base font-bold text-gray-700 dark:text-gray-200 mb-1">No stories found</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">No success stories match your filter</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtered.map((story) => (
                                <div key={story._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors cursor-pointer" onClick={() => setSelectedStory(story)}>
                                    <div className="relative h-48 overflow-hidden">
                                        <img src={story.coupleImage || 'https://via.placeholder.com/400x300?text=Couple'} alt="Couple" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-3 left-3 flex gap-0.5">{renderStars(story.reviewStar)}</div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                                            <FaCalendar className="text-[10px]" />
                                            {new Date(story.marriageDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm italic line-clamp-3">"{story.successStoryText}"</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {selectedStory && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedStory(null)}>
                            <div className="absolute inset-0 bg-black/50"></div>
                            <div className="relative bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                                <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between z-10">
                                    <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2"><FaHeart className="text-pink-500 text-sm" /> Success Story</h2>
                                    <button onClick={() => setSelectedStory(null)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><FaTimes className="text-gray-500 text-sm" /></button>
                                </div>
                                <div className="p-5">
                                    <img src={selectedStory.coupleImage || 'https://via.placeholder.com/400x300?text=Couple'} alt="Couple" className="w-full h-48 object-cover rounded-lg mb-4" />
                                    <div className="flex items-center gap-2 mb-3">{renderStars(selectedStory.reviewStar)}</div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5"><FaCalendar className="text-[10px]" /> Married {new Date(selectedStory.marriageDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                        <FaQuoteLeft className="text-lg text-gray-200 dark:text-gray-700 mb-2" />
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic text-sm">{selectedStory.successStoryText}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Stories;
