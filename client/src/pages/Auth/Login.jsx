import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock, FaGoogle, FaMosque, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login, loginWithGoogle } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error(t('toast.fillAllFields'));
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            toast.success(t('toast.loginSuccess'));
            navigate(from, { replace: true });
        } catch (error) {
            console.error('Login error:', error);
            if (error.code === 'auth/invalid-credential') {
                toast.error(t('toast.invalidEmailPassword'));
            } else if (error.code === 'auth/user-not-found') {
                toast.error(t('toast.noAccount'));
            } else if (error.code === 'auth/wrong-password') {
                toast.error(t('toast.wrongPassword'));
            } else {
                toast.error(error.message || t('toast.genericError'));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await loginWithGoogle();
            toast.success(t('toast.loginWelcome'));
            navigate(from, { replace: true });
        } catch (error) {
            console.error('Google login error:', error);
            if (error.code === 'auth/popup-closed-by-user') {
                toast.error(t('toast.loginCancelled'));
            } else {
                toast.error(t('toast.genericError'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 pt-20 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
                        <div className="bg-emerald-600 p-2.5 rounded-lg">
                            <FaMosque className="text-2xl text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nikah</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium -mt-0.5">Islamic Matrimony</p>
                        </div>
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('auth.login.heading')}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{t('auth.login.subtitle')}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                {t('auth.login.email')}
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                    <FaEnvelope className="text-sm" />
                                </span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('auth.login.emailPlaceholder')}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-400 dark:text-white text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                {t('auth.login.password')}
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                    <FaLock className="text-sm" />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('auth.login.passwordPlaceholder')}
                                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-400 dark:text-white text-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 px-4 rounded-lg transition-colors bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    {t('auth.login.signingIn')}
                                </span>
                            ) : (
                                t('auth.login.submit')
                            )}
                        </button>
                    </form>

                    <div className="my-5 flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                        <span className="text-xs text-gray-400">{t('auth.login.divider')}</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
                    >
                        <FaGoogle className="text-red-500" />
                        <span className="font-medium text-gray-700 dark:text-gray-200">{t('auth.login.google')}</span>
                    </button>

                    <p className="text-center mt-5 text-sm text-gray-500 dark:text-gray-400">
                        {t('auth.login.noAccount')}{' '}
                        <Link to="/register" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                            {t('auth.login.registerLink')}
                        </Link>
                    </p>
                </div>

                <p className="text-center mt-6 text-xs text-gray-400 italic">
                    {t('auth.login.islamicQuote')}
                    <span className="block mt-1 text-gray-500 not-italic font-medium">{t('auth.login.quranRef')}</span>
                </p>
            </div>
        </div>
    );
};

export default Login;
