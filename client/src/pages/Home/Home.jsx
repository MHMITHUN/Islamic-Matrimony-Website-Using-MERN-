import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaSearch, FaHeart, FaStar, FaUsers, FaMale, FaFemale, FaRing, FaArrowRight, FaQuoteLeft, FaCrown, FaCheckCircle, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';
import { biodataAPI, successStoryAPI, analyticsAPI } from '../../api/api';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedCounter from '../../components/AnimatedCounter';
import FeaturedProfiles from '../../components/FeaturedProfiles';

const HeroSection = () => {
    const { t } = useLanguage();
    const slides = [
        {
            image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600',
            title: t('home.hero.heading1'),
            subtitle: t('home.hero.subtitle1')
        },
        {
            image: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=1600',
            title: t('home.hero.heading2'),
            subtitle: t('home.hero.subtitle2')
        },
        {
            image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600',
            title: t('home.hero.heading3'),
            subtitle: t('home.hero.subtitle3')
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 5000);
        return () => clearInterval(timer);
    }, []);

    const features = t('home.hero.features', ['Verified Profiles', 'Islamic Values', '100% Secure']);

    return (
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
            {slides.map((slide, index) => (
                <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }} />
                    <div className="absolute inset-0 bg-gray-900/85" />
                </div>
            ))}
            <div className="relative container-custom py-16 mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <div className="text-white animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-emerald-300 text-xs font-medium mb-4">
                            <FaCheckCircle className="text-emerald-400" />
                            <span>{t('home.hero.bismillah')}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                            {slides[currentSlide].title}
                        </h1>
                        <p className="text-base md:text-lg mb-6 text-gray-300 max-w-lg">{slides[currentSlide].subtitle}</p>
                        <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6">
                            {Array.isArray(features) ? features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-gray-300 text-sm">
                                    <FaCheckCircle className="text-emerald-400 text-xs" />{feature}
                                </div>
                            )) : ['Verified Profiles', 'Islamic Values', '100% Secure'].map((feature, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-gray-300 text-sm">
                                    <FaCheckCircle className="text-emerald-400 text-xs" />{feature}
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link to="/register" className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 text-sm">
                                {t('home.hero.getStarted')} <FaArrowRight className="text-xs" />
                            </Link>
                            <Link to="/biodatas" className="px-5 py-3 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2 text-sm">
                                <FaSearch className="text-xs" /> {t('home.hero.browseBiodatas')}
                            </Link>
                        </div>
                    </div>
                    <div className="hidden lg:grid grid-cols-2 gap-3">
                        {[
                            { icon: <FaUsers />, value: '50K+', label: t('home.stats.activeMembers'), color: 'bg-emerald-600' },
                            { icon: <FaRing />, value: '1000+', label: t('home.stats.marriages'), color: 'bg-amber-600' },
                            { icon: <FaMale />, value: '25K+', label: t('home.stats.maleProfiles'), color: 'bg-blue-600' },
                            { icon: <FaFemale />, value: '25K+', label: t('home.stats.femaleProfiles'), color: 'bg-pink-600' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/10 rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center text-white mb-2`}>{stat.icon}</div>
                                <p className="text-xl font-bold text-white mb-0.5">{stat.value}</p>
                                <p className="text-gray-400 text-xs">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                    <button key={index} onClick={() => setCurrentSlide(index)} aria-label={`Go to slide ${index + 1}`} className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white w-6' : 'bg-white/30 w-1.5'}`} />
                ))}
            </div>
        </section>
    );
};

const BiodataCard = ({ biodata, index }) => {
    const { t } = useLanguage();
    return (
        <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 animate-fade-in-up" style={{ animationDelay: `${index * 80}ms` }}>
            <div className="relative h-52 overflow-hidden">
                <img src={biodata.profileImage || 'https://via.placeholder.com/300x300?text=No+Image'} alt={`Biodata ${biodata.biodataId}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-semibold rounded flex items-center gap-1"><FaCrown className="text-[8px]" /> {t('home.card.premium')}</span>
                </div>
                <div className="absolute top-2.5 right-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${biodata.biodataType === 'Male' ? 'bg-blue-500 text-white' : 'bg-pink-500 text-white'}`}>{biodata.biodataType}</span>
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <p className="text-white/70 text-[10px] mb-0.5">ID: {biodata.biodataId}</p>
                    <h3 className="text-white font-semibold text-sm">{biodata.occupation}</h3>
                </div>
            </div>
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                        <span className="text-lg font-bold text-emerald-600">{biodata.age}</span>
                        <span className="text-xs">{t('home.card.yearsOld')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <FaMapMarkerAlt className="text-emerald-600 text-[10px]" />
                        {biodata.permanentDivision}
                    </div>
                </div>
                <Link to={`/biodata/${biodata.biodataId}`} className="block w-full py-2 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors text-sm">{t('home.card.viewProfile')}</Link>
            </div>
        </div>
    );
};

const SectionHeader = ({ badge, badgeColor = 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400', title, highlight, highlightColor = 'text-emerald-600 dark:text-emerald-400', subtitle }) => (
    <div className="text-center mb-8">
        {badge && <div className={`inline-flex items-center gap-1.5 px-3 py-1 ${badgeColor} rounded-full text-xs font-medium mb-2`}>{badge}</div>}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {title}{' '}<span className={highlightColor}>{highlight}</span>
        </h2>
        {subtitle && <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-sm">{subtitle}</p>}
    </div>
);

const PremiumMembersSection = () => {
    const { t } = useLanguage();
    const [sortOrder, setSortOrder] = useState('asc');
    const { data: premiumBiodatas = [], isLoading } = useQuery({
        queryKey: ['premiumBiodatas', sortOrder],
        queryFn: async () => {
            const response = await biodataAPI.getPremium({ sort: sortOrder, limit: 6 });
            return response.data;
        }
    });

    if (!isLoading && premiumBiodatas.length === 0) return null;

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container-custom">
                <SectionHeader
                    badge={<><FaCrown className="text-xs" /> {t('home.premium.badge')}</>}
                    badgeColor="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                    title={t('home.premium.heading')}
                    highlight={t('home.premium.highlight')}
                    subtitle={t('home.premium.subtitle')}
                />
                <div className="flex justify-center mb-6">
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors cursor-pointer">
                        <option value="asc">{t('home.premium.sortAgeAsc')}</option>
                        <option value="desc">{t('home.premium.sortAgeDesc')}</option>
                    </select>
                </div>
                {isLoading ? (
                    <div className="flex justify-center py-10"><div className="spinner-lg"></div></div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {premiumBiodatas.map((biodata, index) => (
                            <BiodataCard key={biodata._id} biodata={biodata} index={index} />
                        ))}
                    </div>
                )}
                <div className="text-center mt-8">
                    <Link to="/biodatas" className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors text-sm">
                        {t('home.premium.viewAll')} <FaArrowRight className="text-xs" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

const FeaturedProfilesSection = () => {
    const { t } = useLanguage();
    const { data: premiumBiodatas = [], isLoading } = useQuery({
        queryKey: ['featuredPremiumBiodatas'],
        queryFn: async () => {
            const response = await biodataAPI.getPremium({ limit: 6 });
            return response.data;
        }
    });

    if (!isLoading && (!premiumBiodatas || premiumBiodatas.length === 0)) return null;

    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="container-custom">
                <SectionHeader
                    badge={<><FaHeart className="text-xs" /> {t('home.featured.badge')}</>}
                    badgeColor="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                    title={t('home.featured.heading1')}
                    highlight={t('home.featured.highlight')}
                    highlightColor="text-amber-600 dark:text-amber-400"
                    subtitle={t('home.featured.subtitle')}
                />
                {isLoading ? (
                    <div className="flex justify-center py-10"><div className="spinner-lg"></div></div>
                ) : (
                    <FeaturedProfiles biodatas={premiumBiodatas} />
                )}
            </div>
        </section>
    );
};

const HowItWorksSection = () => {
    const { t } = useLanguage();
    const steps = t('home.howItWorks.steps', [
        { title: 'Create Your Profile', desc: 'Register and create your biodata with accurate information about yourself.' },
        { title: 'Search Partners', desc: 'Browse through verified profiles and use filters to find your match.' },
        { title: 'Connect', desc: 'Request contact information and start meaningful conversations.' },
        { title: 'Get Married', desc: 'Find your compatible partner and take the step towards Nikah.' }
    ]);

    return (
        <section className="py-16 bg-emerald-700 dark:bg-emerald-900">
            <div className="container-custom">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{t('home.howItWorks.heading')} <span className="text-amber-300">{t('home.howItWorks.highlight')}</span></h2>
                    <p className="text-emerald-200 max-w-lg mx-auto text-sm">{t('home.howItWorks.subtitle')}</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.isArray(steps) ? steps.map((step, index) => {
                        const icons = [<FaUsers />, <FaSearch />, <FaHeart />, <FaRing />];
                        return (
                            <div key={index} className="text-center">
                                <div className="relative inline-block mb-3">
                                    <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center text-white text-xl">
                                        {icons[index]}
                                    </div>
                                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">{index + 1}</div>
                                </div>
                                <h3 className="text-base font-semibold text-white mb-1.5">{step.title}</h3>
                                <p className="text-emerald-200 text-xs leading-relaxed">{step.desc}</p>
                            </div>
                        );
                    }) : null}
                </div>
            </div>
        </section>
    );
};

const SuccessCounterSection = () => {
    const { t } = useLanguage();
    const { data: stats, isLoading } = useQuery({
        queryKey: ['analyticsStats'],
        queryFn: async () => {
            const response = await analyticsAPI.getStats();
            return response.data;
        }
    });

    const counters = [
        { icon: <FaUsers />, value: stats?.totalBiodatas || 0, label: t('home.success.totalBiodatas'), color: 'bg-emerald-600' },
        { icon: <FaMale />, value: stats?.maleCount || 0, label: t('home.success.maleBiodatas'), color: 'bg-blue-600' },
        { icon: <FaFemale />, value: stats?.femaleCount || 0, label: t('home.success.femaleBiodatas'), color: 'bg-pink-600' },
        { icon: <FaRing />, value: stats?.totalSuccessStories || 0, label: t('home.success.marriagesCompleted'), color: 'bg-amber-600', suffix: '+' },
    ];

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container-custom">
                <SectionHeader
                    title={t('home.success.heading1')}
                    highlight={t('home.success.heading2')}
                    subtitle={t('home.success.subtitle')}
                />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {counters.map((counter, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 text-center hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors">
                            <div className={`w-10 h-10 mx-auto mb-3 ${counter.color} rounded-lg flex items-center justify-center text-white text-lg`}>{counter.icon}</div>
                            <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-0.5 tabular-nums">
                                {isLoading ? (<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto w-16"></div>) : (<AnimatedCounter value={counter.value} suffix={counter.suffix || ''} />)}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">{counter.label}</div>
                        </div>
                    ))}
                </div>
                {stats && stats.successRate > 0 && (
                    <div className="mt-6 text-center">
                        <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            <FaStar className="text-amber-500" />
                            <div>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400">{t('home.success.successRate')}</p>
                                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400"><AnimatedCounter value={stats.successRate} suffix="%" duration={1.5} /></p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

const SuccessStoriesSection = () => {
    const { t } = useLanguage();
    const { data: stories = [], isLoading } = useQuery({
        queryKey: ['successStories'],
        queryFn: async () => {
            const response = await successStoryAPI.getAll();
            return response.data;
        }
    });

    const renderStars = (rating) => [...Array(5)].map((_, index) => <FaStar key={index} className={index < rating ? 'text-amber-400' : 'text-gray-200 dark:text-gray-600'} />);

    if (isLoading) {
        return (
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container-custom">
                    <div className="flex justify-center py-8"><div className="spinner-lg"></div></div>
                </div>
            </section>
        );
    }

    if (stories.length === 0) return null;

    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="container-custom">
                <SectionHeader
                    badge={<><FaHeart className="text-xs" /> {t('home.stories.badge')}</>}
                    badgeColor="bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400"
                    title={t('home.stories.heading1')}
                    highlight={t('home.stories.highlight')}
                    highlightColor="text-pink-600 dark:text-pink-400"
                    subtitle={t('home.stories.subtitle')}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {stories.slice(0, 6).map((story) => (
                        <div key={story._id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 relative">
                            <FaQuoteLeft className="absolute top-4 right-4 text-xl text-gray-100 dark:text-gray-700" />
                            <div className="flex items-center gap-3 mb-3">
                                <div className="relative">
                                    <img src={story.coupleImage || 'https://via.placeholder.com/100x100?text=Couple'} alt="Couple" className="w-10 h-10 rounded-lg object-cover" />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center"><FaHeart className="text-white text-[6px]" /></div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-0.5 mb-0.5">{renderStars(story.reviewStar)}</div>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{t('home.stories.married')} {new Date(story.marriageDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm italic leading-relaxed line-clamp-3">"{story.successStoryText}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CTASection = () => {
    const { t } = useLanguage();
    return (
        <section className="py-16 bg-amber-500 dark:bg-amber-600">
            <div className="container-custom text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{t('home.cta.heading1')} <span className="text-gray-900">{t('home.cta.highlight')}</span></h2>
                <p className="text-white/90 max-w-lg mx-auto mb-6 text-sm">{t('home.cta.desc')}</p>
                <div className="flex flex-wrap justify-center gap-3">
                    <Link to="/register" className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 text-sm">{t('home.cta.createProfile')} <FaArrowRight className="text-xs" /></Link>
                    <Link to="/biodatas" className="px-6 py-3 bg-white/20 text-white font-semibold rounded-lg border border-white/30 hover:bg-white/30 transition-colors text-sm">{t('home.cta.browseFirst')}</Link>
                </div>
            </div>
        </section>
    );
};

const Home = () => (
    <div className="pt-16">
        <HeroSection />
        <PremiumMembersSection />
        <FeaturedProfilesSection />
        <HowItWorksSection />
        <SuccessCounterSection />
        <SuccessStoriesSection />
        <CTASection />
    </div>
);

export default Home;
