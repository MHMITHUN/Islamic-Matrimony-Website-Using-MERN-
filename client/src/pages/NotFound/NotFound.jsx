import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaMosque } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';

const NotFound = () => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 pt-20">
            <div className="max-w-lg w-full text-center">
                <FaMosque className="text-6xl text-emerald-600 mx-auto mb-4" />
                <h1 className="text-7xl md:text-8xl font-bold text-emerald-600 mb-3">404</h1>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('notFound.heading')}</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto text-sm">{t('notFound.desc')}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors text-sm"><FaHome className="text-xs" />{t('notFound.goHome')}</Link>
                    <Link to="/biodatas" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors text-sm"><FaSearch className="text-xs" />{t('notFound.browseBiodatas')}</Link>
                </div>
                <div className="mt-10 text-xs text-gray-400">
                    <span className="dark:text-gray-500">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</span>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
