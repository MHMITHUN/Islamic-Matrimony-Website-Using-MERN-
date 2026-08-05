import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import AuthAside from '../../components/shared/AuthAside';
import Logo from '../../components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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
            if (error.code === 'auth/invalid-credential') toast.error(t('toast.invalidEmailPassword'));
            else if (error.code === 'auth/user-not-found') toast.error(t('toast.noAccount'));
            else if (error.code === 'auth/wrong-password') toast.error(t('toast.wrongPassword'));
            else toast.error(error.message || t('toast.genericError'));
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
            if (error.code === 'auth/popup-closed-by-user') toast.error(t('toast.loginCancelled'));
            else toast.error(t('toast.genericError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background">
            <AuthAside
                title={t('auth.aside.loginTitle', 'Begin your journey to')}
                highlight={t('auth.aside.loginHighlight', 'a blessed union')}
                subtitle={t('auth.aside.loginSubtitle', 'Sign in to continue your search for a righteous, compatible life partner — the halal way.')}
                points={t('auth.aside.loginPoints', ['Trusted by thousands of Muslim families', 'Verified, secure & private by design', 'Find matches aligned with Islamic values'])}
            />

            <div className="flex flex-col items-center justify-center px-6 py-12 lg:px-12">
                <div className="w-full max-w-md">
                    <div className="lg:hidden mb-8 flex justify-center">
                        <Logo />
                    </div>

                    <div className="mb-8">
                        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{t('auth.login.heading')}</h1>
                        <p className="text-muted-foreground mt-1.5 text-sm">{t('auth.login.subtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email">{t('auth.login.email')}</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="email" type="email" value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('auth.login.emailPlaceholder')}
                                    className="pl-10" required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password">{t('auth.login.password')}</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="password" type={showPassword ? 'text' : 'password'} value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('auth.login.passwordPlaceholder')}
                                    className="pl-10 pr-10" required
                                />
                                <button
                                    type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} size="lg" className="w-full shadow-glow">
                            {loading ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> {t('auth.login.signingIn')}</>
                            ) : (
                                <>{t('auth.login.submit')} <ArrowRight className="h-4 w-4" /></>
                            )}
                        </Button>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                        <Separator className="flex-1" />
                        <span className="text-xs text-muted-foreground">{t('auth.login.divider')}</span>
                        <Separator className="flex-1" />
                    </div>

                    <Button onClick={handleGoogleLogin} disabled={loading} variant="outline" size="lg" className="w-full">
                        <FaGoogle className="text-red-500" />
                        {t('auth.login.google')}
                    </Button>

                    <p className="text-center mt-6 text-sm text-muted-foreground">
                        {t('auth.login.noAccount')}{' '}
                        <Link to="/register" className="text-primary font-semibold hover:underline">{t('auth.login.registerLink')}</Link>
                    </p>

                    <p className="text-center mt-6 text-xs italic text-muted-foreground/70">
                        {t('auth.login.islamicQuote')}
                        <span className="block mt-1 not-italic font-medium">{t('auth.login.quranRef')}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
