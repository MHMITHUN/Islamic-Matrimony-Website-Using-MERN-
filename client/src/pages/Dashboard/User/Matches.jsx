import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FaBalanceScale, FaCheck, FaTimes, FaMapMarkerAlt, FaBriefcase, FaHeart, FaSearch } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { matchAPI } from '../../../api/api';

const Matches = () => {
    const { data: matches = [], isLoading } = useQuery({
        queryKey: ['matches'],
        queryFn: async () => { const res = await matchAPI.getMatches(); return res.data; }
    });

    const getScoreColor = (score) => {
        if (score >= 75) return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
        if (score >= 50) return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
        return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    };

    return (
        <>
            <Helmet><title>Matches - Nikah Matrimony</title></Helmet>
            <div className="space-y-5">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FaBalanceScale className="text-emerald-600" /> Compatibility Matches
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Profiles matched based on your preferences</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12"><div className="spinner-lg"></div></div>
                ) : matches.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <FaSearch className="text-3xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-gray-700 dark:text-gray-200 mb-1">No matches found</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Create your biodata to see compatibility matches</p>
                        <Link to="/dashboard/edit-biodata" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors">
                            Create Biodata
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {matches.map(match => (
                            <div key={match.biodataId} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors">
                                <div className="relative h-44 overflow-hidden">
                                    <img src={match.profileImage || 'https://via.placeholder.com/300x300?text=No+Image'} alt={match.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                    <div className={`absolute top-2.5 right-2.5 px-2 py-1 rounded-lg text-sm font-bold border ${getScoreColor(match.compatibilityScore)}`}>
                                        {match.compatibilityScore}%
                                    </div>
                                    <div className="absolute top-2.5 left-2.5">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${match.biodataType === 'Male' ? 'bg-blue-500 text-white' : 'bg-pink-500 text-white'}`}>
                                            {match.biodataType}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-[10px] text-gray-400 mb-0.5">#{match.biodataId}</p>
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">{match.name}</h3>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                                        <span className="flex items-center gap-1"><FaBriefcase className="text-[10px]" />{match.occupation}</span>
                                        <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-[10px]" />{match.permanentDivision}</span>
                                    </div>

                                    <div className="space-y-1.5 mb-3">
                                        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Match Criteria</p>
                                        {[
                                            { label: 'Age', match: match.matchDetails.ageMatch },
                                            { label: 'Height', match: match.matchDetails.heightMatch },
                                            { label: 'Division', match: match.matchDetails.divisionMatch },
                                            { label: 'Occupation', match: match.matchDetails.occupationMatch },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between text-xs">
                                                <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                                                {item.match ? (
                                                    <span className="flex items-center gap-1 text-emerald-600"><FaCheck className="text-[10px]" /> Match</span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-gray-400"><FaTimes className="text-[10px]" /> No</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <Link to={`/biodata/${match.biodataId}`} className="block w-full py-2 text-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors">
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Matches;
