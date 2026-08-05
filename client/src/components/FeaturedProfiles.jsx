import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaCrown, FaMapMarkerAlt, FaBriefcase, FaHeart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const FeaturedProfiles = ({ biodatas = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const itemsPerView = {
        mobile: 1,
        tablet: 2,
        desktop: 3
    };

    const [perView, setPerView] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setPerView(itemsPerView.mobile);
            else if (window.innerWidth < 1024) setPerView(itemsPerView.tablet);
            else setPerView(itemsPerView.desktop);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentIndex, biodatas.length, perView]);

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % Math.max(1, biodatas.length - perView + 1));
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + Math.max(1, biodatas.length - perView + 1)) % Math.max(1, biodatas.length - perView + 1));
    };

    const visibleBiodatas = biodatas.slice(currentIndex, currentIndex + perView);

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 200 : -200,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            x: direction < 0 ? 200 : -200,
            opacity: 0
        })
    };

    if (!biodatas || biodatas.length === 0) return null;

    return (
        <div className="relative">
            <div className="overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                    >
                        {visibleBiodatas.map((biodata) => (
                            <div
                                key={biodata._id}
                                className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={biodata.profileImage || 'https://via.placeholder.com/400x400?text=No+Image'}
                                        alt={`Featured Profile ${biodata.biodataId}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                    <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                                        <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded flex items-center gap-1">
                                            <FaHeart className="text-[8px]" /> Featured
                                        </span>
                                        {biodata.isPremium && (
                                            <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded flex items-center gap-1">
                                                <FaCrown className="text-[8px]" /> Premium
                                            </span>
                                        )}
                                    </div>

                                    <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold ${biodata.biodataType === 'Male' ? 'bg-blue-500 text-white' : 'bg-pink-500 text-white'
                                        }`}>
                                        {biodata.biodataType}
                                    </span>

                                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                                        <p className="text-white/70 text-[10px] mb-0.5">ID: {biodata.biodataId}</p>
                                        <div className="flex items-center gap-1.5 text-white">
                                            <span className="text-xl font-bold">{biodata.age}</span>
                                            <span className="text-xs">years old</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 mb-2 text-sm">
                                        <FaBriefcase className="text-emerald-600 text-xs" />
                                        <span className="font-medium truncate">{biodata.occupation}</span>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs mb-3">
                                        <FaMapMarkerAlt className="text-emerald-600 text-[10px]" />
                                        <span>{biodata.permanentDivision}</span>
                                    </div>

                                    <Link
                                        to={`/biodata/${biodata.biodataId}`}
                                        className="block w-full py-2 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors text-sm"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            {biodatas.length > perView && (
                <>
                    <button
                        onClick={handlePrev}
                        aria-label="Previous profiles"
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-emerald-600 hover:border-emerald-300 transition-colors z-10"
                    >
                        <FaChevronLeft className="text-sm" />
                    </button>
                    <button
                        onClick={handleNext}
                        aria-label="Next profiles"
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-emerald-600 hover:border-emerald-300 transition-colors z-10"
                    >
                        <FaChevronRight className="text-sm" />
                    </button>
                </>
            )}

            {/* Indicators */}
            {biodatas.length > perView && (
                <div className="flex justify-center gap-1.5 mt-6">
                    {[...Array(Math.max(1, biodatas.length - perView + 1))].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all ${i === currentIndex
                                ? 'w-6 bg-emerald-600'
                                : 'w-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-emerald-400'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FeaturedProfiles;
