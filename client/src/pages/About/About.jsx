import { FaMosque, FaHeart, FaShieldAlt, FaUsers, FaCheckCircle, FaStar, FaQuoteLeft } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';

const About = () => {
    const { t } = useLanguage();

    const values = [
        { icon: <FaShieldAlt />, title: t('about.values.privacy.title'), description: t('about.values.privacy.desc'), color: 'bg-blue-600' },
        { icon: <FaCheckCircle />, title: t('about.values.verified.title'), description: t('about.values.verified.desc'), color: 'bg-emerald-600' },
        { icon: <FaHeart />, title: t('about.values.islamic.title'), description: t('about.values.islamic.desc'), color: 'bg-pink-600' },
        { icon: <FaUsers />, title: t('about.values.community.title'), description: t('about.values.community.desc'), color: 'bg-amber-600' }
    ];

    const stats = [
        { value: '50K+', label: t('about.stats.members') },
        { value: '1000+', label: t('about.stats.marriages') },
        { value: '7', label: t('about.stats.divisions') },
    ];

    return (
        <div className="min-h-screen">
            <section className="py-20 md:py-28 bg-emerald-700">
                <div className="container-custom text-center">
                    <div className="w-14 h-14 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4"><FaMosque className="text-2xl text-white" /></div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">{t('about.hero.heading1')} <span className="text-amber-300">{t('about.hero.highlight')}</span> {t('about.hero.heading2')}</h1>
                    <p className="text-base md:text-lg text-emerald-200 max-w-2xl mx-auto">{t('about.hero.desc')}</p>
                </div>
            </section>

            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">{t('about.mission.heading1')} <span className="text-emerald-600 dark:text-emerald-400">{t('about.mission.highlight')}</span></h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed text-sm">{t('about.mission.text1')}</p>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{t('about.mission.text2')}</p>
                        </div>
                        <div className="relative">
                            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600" alt="Islamic Wedding" className="rounded-xl w-full" />
                            <div className="absolute -bottom-3 -left-3 bg-emerald-700 text-white p-3 rounded-xl shadow-lg"><p className="text-2xl font-bold">1000+</p><p className="text-emerald-200 text-xs">{t('about.mission.stat')}</p></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container-custom">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('about.values.heading')}</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-sm">{t('about.values.subtitle')}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {values.map((value, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors">
                                <div className={`w-10 h-10 ${value.color} rounded-lg flex items-center justify-center mx-auto mb-3 text-white text-lg`}>{value.icon}</div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">{value.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 bg-amber-500">
                <div className="container-custom text-center">
                    <FaQuoteLeft className="text-2xl text-white/30 mx-auto mb-3" />
                    <p className="text-xl md:text-2xl font-arabic text-white mb-3 leading-relaxed">{t('about.quote.arabic')}</p>
                    <p className="text-base text-white/90 italic mb-2 max-w-2xl mx-auto">{t('about.quote.text')}</p>
                    <p className="text-sm font-semibold text-white">{t('about.quote.ref')}</p>
                </div>
            </section>

            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container-custom">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('about.stats.heading')}</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-sm">{t('about.stats.subtitle')}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1.5">{stat.value}</div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
