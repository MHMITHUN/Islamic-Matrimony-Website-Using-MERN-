import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaFilter, FaSearch, FaMale, FaFemale, FaMapMarkerAlt, FaBriefcase, FaTimes, FaChevronLeft, FaChevronRight, FaCrown, FaStar } from 'react-icons/fa';
import { biodataAPI } from '../../api/api';
import { useLanguage } from '../../contexts/LanguageContext';

const Biodatas = () => {
    const { t } = useLanguage();
    const [filters, setFilters] = useState({ biodataType: '', division: '', minAge: '', maxAge: '' });
    const [page, setPage] = useState(1);
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const limit = 20;

    const divisions = ['Dhaka', 'Chattagram', 'Rangpur', 'Barisal', 'Khulna', 'Mymensingh', 'Sylhet'];

    const translateEnum = (type, value) => {
        if (!value) return value;
        const map = {
            occupation: { 'Student': 'student', 'Job': 'job', 'Business': 'business', 'Housewife': 'housewife', 'Teacher': 'teacher', 'Doctor': 'doctor', 'Engineer': 'engineer', 'Other': 'other' },
            division: { 'Dhaka': 'dhaka', 'Chattagram': 'chattagram', 'Rangpur': 'rangpur', 'Barisal': 'barisal', 'Khulna': 'khulna', 'Mymensingh': 'mymensingh', 'Sylhet': 'sylhet' },
            biodataType: { 'Male': 'biodata.filters.male', 'Female': 'biodata.filters.female' }
        };
        if (type === 'biodataType') {
            const key = map.biodataType[value];
            return key ? t(key) : value;
        }
        const key = map[type]?.[value];
        return key ? t(`enum.${type}.${key}`) : value;
    };

    const { data, isLoading, isFetching, error } = useQuery({
        queryKey: ['biodatas', filters, page],
        queryFn: async () => {
            const params = { page, limit, ...(filters.biodataType && { biodataType: filters.biodataType }), ...(filters.division && { division: filters.division }), ...(filters.minAge && { minAge: filters.minAge }), ...(filters.maxAge && { maxAge: filters.maxAge }) };
            const response = await biodataAPI.getAll(params);
            return response.data;
        },
        keepPreviousData: true
    });

    const biodatas = data?.biodatas || [];
    const pagination = data?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 };

    const handleFilterChange = (e) => { const { name, value } = e.target; setFilters(prev => ({ ...prev, [name]: value })); setPage(1); };
    const clearFilters = () => { setFilters({ biodataType: '', division: '', minAge: '', maxAge: '' }); setPage(1); };

    const FilterSection = () => (
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('biodata.filters.biodataType')}</label>
                <div className="space-y-1.5">
                    {[{ value: '', label: t('biodata.filters.all'), icon: null }, { value: 'Male', label: t('biodata.filters.male'), icon: <FaMale className="text-blue-500" /> }, { value: 'Female', label: t('biodata.filters.female'), icon: <FaFemale className="text-pink-500" /> }].map((option) => (
                        <label key={option.value} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${filters.biodataType === option.value ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-700' : 'border border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                            <input type="radio" name="biodataType" value={option.value} checked={filters.biodataType === option.value} onChange={handleFilterChange} className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500" />
                            <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 font-medium">{option.icon}{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('biodata.filters.ageRange')}</label>
                <div className="flex items-center gap-2">
                    <input type="number" name="minAge" value={filters.minAge} onChange={handleFilterChange} placeholder={t('biodata.filters.min')} min="18" max="80" className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 dark:text-gray-200 rounded-lg text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors" />
                    <span className="text-gray-400 text-sm">{t('biodata.filters.to')}</span>
                    <input type="number" name="maxAge" value={filters.maxAge} onChange={handleFilterChange} placeholder={t('biodata.filters.max')} min="18" max="80" className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 dark:text-gray-200 rounded-lg text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('biodata.filters.division')}</label>
                <select name="division" value={filters.division} onChange={handleFilterChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors cursor-pointer">
                    <option value="">{t('biodata.filters.allDivisions')}</option>
                    {divisions.map(div => (<option key={div} value={div}>{translateEnum('division', div)}</option>))}
                </select>
            </div>
            <button onClick={clearFilters} className="w-full py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"><FaTimes className="text-xs" /> {t('biodata.filters.clearAll')}</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 pt-24">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{t('biodata.filters.heading')}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{pagination.totalItems > 0 ? t('biodata.filters.showing').replace('{count}', pagination.totalItems) : t('biodata.filters.searchFor')}</p>
                    </div>
                    <button onClick={() => setShowMobileFilter(true)} className="md:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-200 text-sm hover:border-emerald-500 transition-colors"><FaFilter className="text-xs" /> {t('biodata.filters.filters')}</button>
                </div>
                <div className="flex gap-8">
                    <aside className="hidden md:block w-72 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 sticky top-24">
                            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
                                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center"><FaFilter className="text-white text-xs" /></div>
                                <div><h2 className="text-sm font-bold text-gray-900 dark:text-white">{t('biodata.filters.filters')}</h2><p className="text-xs text-gray-500 dark:text-gray-400">{t('biodata.filters.refine')}</p></div>
                            </div>
                            <FilterSection />
                        </div>
                    </aside>
                    {showMobileFilter && (
                        <div className="fixed inset-0 z-50 md:hidden">
                            <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilter(false)} />
                            <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white dark:bg-gray-800 p-5 overflow-y-auto shadow-xl animate-slide-in-right">
                                <div className="flex items-center justify-between mb-5"><h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2"><FaFilter className="text-emerald-600 text-sm" /> {t('biodata.filters.filters')}</h2><button onClick={() => setShowMobileFilter(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><FaTimes className="text-gray-500" /></button></div>
                                <FilterSection />
                            </div>
                        </div>
                    )}
                    <main className="flex-1">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20"><div className="spinner-lg"></div><p className="mt-3 text-gray-500 text-sm">{t('biodata.filters.loading')}</p></div>
                        ) : biodatas.length === 0 ? (
                            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4"><FaSearch className="text-2xl text-gray-400" /></div>
                                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-1">{t('biodata.filters.noResults')}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">{t('biodata.filters.noResultsDesc')}</p>
                                <button onClick={clearFilters} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors text-sm">{t('biodata.filters.clearAll')}</button>
                            </div>
                        ) : (
                            <>
                                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${isFetching ? 'opacity-60' : ''}`}>
                                    {biodatas.map((biodata, index) => (
                                        <div key={biodata._id} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200 animate-fade-in-up" style={{ animationDelay: `${index * 40}ms` }}>
                                            <div className="relative h-48 overflow-hidden">
                                                <img src={biodata.profileImage || 'https://via.placeholder.com/300x300?text=No+Image'} alt={`Biodata ${biodata.biodataId}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between">
                                                    {biodata.isPremium && <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded flex items-center gap-1"><FaCrown className="text-[8px]" /> {t('biodata.card.premium')}</span>}
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${biodata.biodataType === 'Male' ? 'bg-blue-500 text-white' : 'bg-pink-500 text-white'}`}>{translateEnum('biodataType', biodata.biodataType)}</span>
                                                </div>
                                                <div className="absolute bottom-2.5 left-2.5"><span className="text-white/70 text-[10px]">ID: {biodata.biodataId}</span></div>
                                            </div>
                                            <div className="p-3.5">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300"><span className="text-lg font-bold text-emerald-600">{biodata.age}</span><span className="text-xs">{t('biodata.card.years')}</span></div>
                                                    <div className="flex items-center gap-1 text-gray-500 text-xs"><FaMapMarkerAlt className="text-emerald-600 text-[10px]" />{translateEnum('division', biodata.permanentDivision)}</div>
                                                </div>
                                                <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-2.5 flex items-center gap-1.5 text-sm truncate"><FaBriefcase className="text-emerald-600 text-xs flex-shrink-0" /><span className="truncate">{translateEnum('occupation', biodata.occupation)}</span></h3>
                                                <Link to={`/biodata/${biodata.biodataId}`} className="block w-full py-2 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors text-xs">{t('biodata.card.viewProfile')}</Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
                                    <p className="text-xs text-gray-600 dark:text-gray-300">{t('biodata.filters.pagination').replace('{start}', ((page - 1) * limit) + 1).replace('{end}', Math.min(page * limit, pagination.totalItems)).replace('{total}', pagination.totalItems)}</p>
                                    <div className="flex items-center gap-1.5">
                                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><FaChevronLeft className="text-xs" /></button>
                                        {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                                            let pageNum;
                                            if (pagination.totalPages <= 5) pageNum = i + 1;
                                            else if (page <= 3) pageNum = i + 1;
                                            else if (page >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i;
                                            else pageNum = page - 2 + i;
                                            return <button key={i} onClick={() => setPage(pageNum)} className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${page === pageNum ? 'bg-emerald-600 text-white' : 'border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-emerald-500 hover:text-emerald-600'}`}>{pageNum}</button>;
                                        })}
                                        <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><FaChevronRight className="text-xs" /></button>
                                    </div>
                                </div>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Biodatas;
