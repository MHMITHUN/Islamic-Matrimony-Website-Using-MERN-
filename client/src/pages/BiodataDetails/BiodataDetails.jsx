import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaHeart, FaPhone, FaEnvelope, FaMapMarkerAlt, FaBriefcase, FaUser, FaCalendar, FaRulerVertical, FaWeight, FaStar, FaLock, FaCrown, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { biodataAPI, favoritesAPI } from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const BiodataDetails = () => {
    const { id } = useParams();
    const { user, isPremium } = useAuth();
    const { t } = useLanguage();
    const queryClient = useQueryClient();
    const [isFavorited, setIsFavorited] = useState(false);

    const translateEnum = (type, value) => {
        if (!value) return t('biodata.details.notSpecified');
        const map = {
            occupation: { 'Student': 'student', 'Job': 'job', 'Business': 'business', 'Housewife': 'housewife', 'Teacher': 'teacher', 'Doctor': 'doctor', 'Engineer': 'engineer', 'Other': 'other' },
            race: { 'Fair': 'fair', 'Light Brown': 'lightBrown', 'Brown': 'brown', 'Dark': 'dark' },
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

    const { data: biodata, isLoading, error } = useQuery({
        queryKey: ['biodata', id],
        queryFn: async () => { const response = await biodataAPI.getById(id); return response.data; }
    });

    const { data: similarBiodatas = [] } = useQuery({
        queryKey: ['similarBiodatas', id],
        queryFn: async () => { const response = await biodataAPI.getSimilar(id); return response.data; },
        enabled: !!biodata
    });

    useQuery({
        queryKey: ['isFavorited', id],
        queryFn: async () => { const response = await favoritesAPI.check(id); setIsFavorited(response.data.isFavorited); return response.data; },
        enabled: !!user
    });

    const addToFavorites = useMutation({
        mutationFn: () => favoritesAPI.add(parseInt(id)),
        onSuccess: () => { setIsFavorited(true); queryClient.invalidateQueries(['favorites']); toast.success(t('toast.addToFavorites')); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); }
    });

    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><div className="text-center"><div className="spinner-lg"></div><p className="mt-3 text-gray-500 text-sm">{t('biodata.details.loading')}</p></div></div>);
    }

    if (error || !biodata) {
        return (<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><div className="text-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-10 max-w-md mx-4"><div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4"><FaUser className="text-2xl text-gray-400" /></div><h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{t('biodata.details.notFound')}</h2><p className="text-gray-500 dark:text-gray-400 text-sm mb-5">{t('biodata.details.notFoundDesc')}</p><Link to="/biodatas" className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors text-sm"><FaArrowLeft className="text-xs" /> {t('biodata.details.browseBiodatas')}</Link></div></div>);
    }

    const canViewContact = biodata.canViewContact || isPremium;
    const isOwnBiodata = biodata.userEmail === user?.email;

    const InfoCard = ({ icon, label, value }) => (
        <div className="flex items-start gap-3 p-3.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 text-sm">{icon}</div>
            <div><p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p><p className="font-semibold text-gray-800 dark:text-gray-200 text-sm mt-0.5">{value || t('biodata.details.notSpecified')}</p></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 pt-24">
            <div className="container-custom">
                <Link to="/biodatas" className="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium text-sm mb-5 transition-colors"><FaArrowLeft className="text-xs" /> {t('biodata.details.backToBiodatas')}</Link>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-5">
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="relative h-40 bg-emerald-700"></div>
                            <div className="relative px-6 pb-6">
                                <div className="flex flex-col md:flex-row gap-5">
                                    <div className="relative -mt-16 md:-mt-12">
                                        <div className="relative">
                                            <img src={biodata.profileImage || 'https://via.placeholder.com/200x200?text=No+Image'} alt="Profile" className="w-32 h-32 md:w-36 md:h-36 object-cover rounded-xl border-4 border-white dark:border-gray-800 shadow-lg mx-auto md:mx-0" />
                                            {biodata.isPremium && <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded flex items-center gap-1"><FaCrown className="text-[8px]" /> {t('biodata.details.premium')}</span>}
                                        </div>
                                    </div>
                                    <div className="flex-1 text-center md:text-left pt-2 md:pt-4">
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                                            <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${biodata.biodataType === 'Male' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400'}`}>{translateEnum('biodataType', biodata.biodataType)}</span>
                                            <span className="text-gray-400 text-xs">ID: #{biodata.biodataId}</span>
                                        </div>
                                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1.5">{biodata.name}</h1>
                                        <p className="text-gray-600 dark:text-gray-300 flex items-center justify-center md:justify-start gap-1.5 text-sm"><FaBriefcase className="text-emerald-600 text-xs" /> {translateEnum('occupation', biodata.occupation)}</p>
                                        <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-1.5 text-sm mt-0.5"><FaMapMarkerAlt className="text-emerald-600 text-xs" /> {translateEnum('division', biodata.permanentDivision)}</p>
                                        <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
                                            {!isOwnBiodata && (
                                                <button onClick={() => addToFavorites.mutate()} disabled={isFavorited || addToFavorites.isLoading} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${isFavorited ? 'bg-red-50 dark:bg-red-900/20 text-red-500 cursor-default' : 'bg-red-500 hover:bg-red-600 text-white'}`}>
                                                    <FaHeart className="text-xs" /> {isFavorited ? t('biodata.details.favorited') : t('biodata.details.addToFavorites')}
                                                </button>
                                            )}
                                            {!canViewContact && !isOwnBiodata && (
                                                <Link to={`/checkout/${biodata.biodataId}`} className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors text-sm"><FaLock className="text-xs" /> {t('biodata.details.requestContact')}</Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Section title={t('biodata.details.basicInfo')} icon={<FaUser />} color="bg-emerald-600">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <InfoCard icon={<FaCalendar />} label={t('biodata.details.dateOfBirth')} value={new Date(biodata.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
                                <InfoCard icon={<FaUser />} label={t('biodata.details.age')} value={`${biodata.age} ${t('biodata.details.years')}`} />
                                <InfoCard icon={<FaRulerVertical />} label={t('biodata.details.height')} value={biodata.height} />
                                <InfoCard icon={<FaWeight />} label={t('biodata.details.weight')} value={biodata.weight} />
                                <InfoCard icon={<FaBriefcase />} label={t('biodata.details.occupation')} value={translateEnum('occupation', biodata.occupation)} />
                                <InfoCard icon={<FaStar />} label={t('biodata.details.race')} value={translateEnum('race', biodata.race)} />
                            </div>
                        </Section>
                        <Section title={t('biodata.details.familyInfo')} icon={<FaHeart />} color="bg-pink-600">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <InfoCard icon={<FaUser />} label={t('biodata.details.fathersName')} value={biodata.fathersName} />
                                <InfoCard icon={<FaUser />} label={t('biodata.details.mothersName')} value={biodata.mothersName} />
                            </div>
                        </Section>
                        <Section title={t('biodata.details.location')} icon={<FaMapMarkerAlt />} color="bg-blue-600">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <InfoCard icon={<FaMapMarkerAlt />} label={t('biodata.details.permanentDivision')} value={translateEnum('division', biodata.permanentDivision)} />
                                <InfoCard icon={<FaMapMarkerAlt />} label={t('biodata.details.presentDivision')} value={translateEnum('division', biodata.presentDivision)} />
                            </div>
                        </Section>
                        <Section title={t('biodata.details.expectedPartner')} icon={<FaStar />} color="bg-amber-600">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <InfoCard icon={<FaUser />} label={t('biodata.details.expectedAge')} value={biodata.expectedPartnerAge} />
                                <InfoCard icon={<FaRulerVertical />} label={t('biodata.details.expectedHeight')} value={biodata.expectedPartnerHeight} />
                                <InfoCard icon={<FaWeight />} label={t('biodata.details.expectedWeight')} value={biodata.expectedPartnerWeight} />
                            </div>
                        </Section>
                        <Section title={t('biodata.details.contactInfo')} icon={<FaPhone />} color="bg-purple-600">
                            {canViewContact ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <InfoCard icon={<FaEnvelope />} label={t('biodata.details.email')} value={biodata.userEmail} />
                                    <InfoCard icon={<FaPhone />} label={t('biodata.details.mobile')} value={biodata.mobileNumber} />
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3"><FaLock className="text-xl text-gray-400" /></div>
                                    <h3 className="text-base font-bold text-gray-700 dark:text-gray-200 mb-1">{t('biodata.details.contactHidden')}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 max-w-sm mx-auto">{t('biodata.details.contactHiddenDesc')}</p>
                                    <Link to={`/checkout/${biodata.biodataId}`} className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors text-sm"><FaCheckCircle className="text-xs" /> {t('biodata.details.requestContactPrice')}</Link>
                                </div>
                            )}
                        </Section>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 sticky top-24">
                            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center"><FaHeart className="text-white text-xs" /></div>{t('biodata.details.similarProfiles')}</h2>
                            {similarBiodatas.length === 0 ? (
                                <div className="text-center py-6"><div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3"><FaUser className="text-lg text-gray-400" /></div><p className="text-gray-500 dark:text-gray-400 text-sm">{t('biodata.details.noSimilar')}</p></div>
                            ) : (
                                <div className="space-y-3">
                                    {similarBiodatas.map((similar) => (
                                        <Link key={similar._id} to={`/biodata/${similar.biodataId}`} className="block p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <img src={similar.profileImage || 'https://via.placeholder.com/60x60'} alt="Profile" className="w-11 h-11 rounded-lg object-cover" />
                                                <div className="flex-1 min-w-0"><p className="text-[10px] text-gray-400">ID: {similar.biodataId}</p><p className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate">{translateEnum('occupation', similar.occupation)}</p><p className="text-xs text-gray-500 dark:text-gray-400">{translateEnum('division', similar.permanentDivision)} &bull; {similar.age} yrs</p></div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Section = ({ title, icon, color, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 md:p-6">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2.5">
            <div className={`w-7 h-7 ${color} rounded-lg flex items-center justify-center text-white text-xs`}>{icon}</div>
            {title}
        </h2>
        {children}
    </div>
);

export default BiodataDetails;
