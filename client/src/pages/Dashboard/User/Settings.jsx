import { FaMoon, FaSun, FaGlobe, FaUser, FaShieldAlt, FaCog } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const { lang, setLang } = useLanguage();
    const { user, isAdmin, isPremium } = useAuth();

    return (
        <>
            <Helmet><title>Settings - Nikah Matrimony</title></Helmet>
            <div className="space-y-5">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FaCog className="text-emerald-600" /> Settings
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your account preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><FaUser className="text-emerald-600 text-xs" /> Account Info</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Name</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{user?.displayName || 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{user?.email}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Role</span>
                                <span className={`text-xs px-2 py-0.5 rounded font-medium ${isAdmin ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                                    {isAdmin ? 'Admin' : 'User'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Premium Status</span>
                                {isPremium ? (
                                    <span className="text-xs px-2 py-0.5 rounded font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">Premium</span>
                                ) : (
                                    <span className="text-xs text-gray-400">Standard</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><FaCog className="text-emerald-600 text-xs" /> Preferences</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    {theme === 'dark' ? <FaMoon className="text-indigo-500 text-sm" /> : <FaSun className="text-amber-500 text-sm" />}
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Theme</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{theme === 'dark' ? 'Dark mode' : 'Light mode'}</p>
                                    </div>
                                </div>
                                <button onClick={toggleTheme} className={`relative w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-emerald-600' : 'bg-gray-300'}`}>
                                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                                </button>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-3">
                                    <FaGlobe className="text-emerald-600 text-sm" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Language</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{lang === 'bn' ? 'Bangla' : 'English'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1.5">
                                    <button onClick={() => setLang('en')} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${lang === 'en' ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>EN</button>
                                    <button onClick={() => setLang('bn')} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${lang === 'bn' ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>BN</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><FaShieldAlt className="text-emerald-600 text-xs" /> Privacy & Security</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <FaShieldAlt className="text-emerald-600 text-sm" />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Data Protection</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Your data is encrypted and stored securely</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <FaUser className="text-emerald-600 text-sm" />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Profile Privacy</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Contact info is only visible to premium users</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Settings;
