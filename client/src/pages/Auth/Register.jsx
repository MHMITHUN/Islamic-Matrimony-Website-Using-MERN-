import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaImage, FaMosque, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        photoURL: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validatePassword = (password) => {
        if (password.length < 6) return t('toast.passwordMinLength');
        if (!/[A-Z]/.test(password)) return t('toast.passwordUppercase');
        if (!/[a-z]/.test(password)) return t('toast.passwordLowercase');
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, password, photoURL } = formData;

        if (!name || !email || !password) {
            toast.error(t('toast.fillAllFields'));
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            toast.error(passwordError);
            return;
        }

        setLoading(true);
        try {
            await register(email, password, name, photoURL);
            toast.success(t('toast.registerSuccess'));
            navigate('/');
        } catch (error) {
            console.error('Register error:', error);
            if (error.code === 'auth/email-already-in-use') {
                toast.error(t('toast.accountExists'));
            } else if (error.code === 'auth/weak-password') {
                toast.error(t('toast.weakPassword'));
            } else if (error.code === 'auth/invalid-email') {
                toast.error(t('toast.invalidEmail'));
            } else {
                toast.error(error.message || t('toast.genericError'));
            }
        } finally {
            setLoading(false);
        }
    };

    const passwordChecks = [
        { label: t('auth.register.passwordChecks.0'), valid: formData.password.length >= 6 },
        { label: t('auth.register.passwordChecks.1'), valid: /[A-Z]/.test(formData.password) },
        { label: t('auth.register.passwordChecks.2'), valid: /[a-z]/.test(formData.password) },
    ];

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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('auth.register.heading')}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{t('auth.register.subtitle')}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                {t('auth.register.fullName')} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><FaUser className="text-sm" /></span>
                                <input type="text" name="name" value={formData.name} onChange={handleChange}
                                    placeholder={t('auth.register.fullNamePlaceholder')}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-400 dark:text-white text-sm"
                                    required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                {t('auth.register.email')} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><FaEnvelope className="text-sm" /></span>
                                <input type="email" name="email" value={formData.email} onChange={handleChange}
                                    placeholder={t('auth.register.emailPlaceholder')}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-400 dark:text-white text-sm"
                                    required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                {t('auth.register.password')} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><FaLock className="text-sm" /></span>
                                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                                    placeholder={t('auth.register.passwordPlaceholder')}
                                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-400 dark:text-white text-sm"
                                    required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                                </button>
                            </div>
                            {formData.password && (
                                <div className="mt-2 space-y-1">
                                    {passwordChecks.map((check, index) => (
                                        <div key={index} className={`flex items-center gap-1.5 text-xs ${check.valid ? 'text-emerald-600' : 'text-gray-400'}`}>
                                            <FaCheckCircle className={check.valid ? 'text-emerald-500' : 'text-gray-300'} />
                                            {check.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                {t('auth.register.photoUrl')} <span className="text-gray-400 font-normal">{t('auth.register.photoUrlOptional')}</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><FaImage className="text-sm" /></span>
                                <input type="url" name="photoURL" value={formData.photoURL} onChange={handleChange}
                                    placeholder={t('auth.register.photoUrlPlaceholder')}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-400 dark:text-white text-sm" />
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
                                    {t('auth.register.creating')}
                                </span>
                            ) : (
                                t('auth.register.submit')
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-5 text-sm text-gray-500 dark:text-gray-400">
                        {t('auth.register.haveAccount')}{' '}
                        <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                            {t('auth.register.loginLink')}
                        </Link>
                    </p>
                </div>

                <p className="text-center mt-6 text-xs text-gray-400 italic">
                    {t('auth.register.islamicQuote')}
                    <span className="block mt-1 text-gray-500 not-italic font-medium">{t('auth.register.hadithRef')}</span>
                </p>
            </div>
        </div>
    );
};

export default Register;
