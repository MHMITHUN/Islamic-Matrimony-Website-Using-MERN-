import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, User, ImageIcon, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import AuthAside from '../../components/shared/AuthAside';
import Logo from '../../components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', photoURL: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const validatePassword = (password) => {
        if (password.length < 6) return t('toast.passwordMinLength');
        if (!/[A-Z]/.test(password)) return t('toast.passwordUppercase');
        if (!/[a-z]/.test(password)) return t('toast.passwordLowercase');
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, photoURL } = formData;
        if (!name || !email || !password) { toast.error(t('toast.fillAllFields')); return; }
        const passwordError = validatePassword(password);
        if (passwordError) { toast.error(passwordError); return; }
        setLoading(true);
        try {
            await register(email, password, name, photoURL);
            toast.success(t('toast.registerSuccess'));
            navigate('/');
        } catch (error) {
            console.error('Register error:', error);
            if (error.code === 'auth/email-already-in-use') toast.error(t('toast.accountExists'));
            else if (error.code === 'auth/weak-password') toast.error(t('toast.weakPassword'));
            else if (error.code === 'auth/invalid-email') toast.error(t('toast.invalidEmail'));
            else toast.error(error.message || t('toast.genericError'));
        } finally {
            setLoading(false);
        }
    };

    const passwordChecks = [
        { label: t('auth.register.passwordChecks.0'), valid: formData.password.length >= 6 },
        { label: t('auth.register.passwordChecks.1'), valid: /[A-Z]/.test(formData.password) },
        { label: t('auth.register.passwordChecks.2'), valid: /[a-z]/.test(formData.password) },
    ];

    const strength = passwordChecks.filter(c => c.valid).length;
    const strengthPct = (strength / 3) * 100;

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background">
            <AuthAside
                title="Create your account,"
                highlight="find your match"
                subtitle="Join a trusted Muslim matrimonial community built on faith, sincerity, and serious intentions for marriage."
                points={['Free to register & create your biodata', 'Your privacy is always protected', 'Connect with verified, serious profiles']}
            />

            <div className="flex flex-col items-center justify-center px-6 py-12 lg:px-12">
                <div className="w-full max-w-md">
                    <div className="lg:hidden mb-8 flex justify-center"><Logo /></div>

                    <div className="mb-8">
                        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{t('auth.register.heading')}</h1>
                        <p className="text-muted-foreground mt-1.5 text-sm">{t('auth.register.subtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">{t('auth.register.fullName')} <span className="text-destructive">*</span></Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <Input id="name" name="name" value={formData.name} onChange={handleChange}
                                    placeholder={t('auth.register.fullNamePlaceholder')} className="pl-10" required />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email">{t('auth.register.email')} <span className="text-destructive">*</span></Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                                    placeholder={t('auth.register.emailPlaceholder')} className="pl-10" required />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password">{t('auth.register.password')} <span className="text-destructive">*</span></Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <Input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange}
                                    placeholder={t('auth.register.passwordPlaceholder')} className="pl-10 pr-10" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {formData.password && (
                                <div className="space-y-2 pt-1">
                                    <Progress value={strengthPct} className="h-1.5"
                                        indicatorClassName={cn(strength === 1 && 'bg-rose-500', strength === 2 && 'bg-amber-500', strength === 3 && 'bg-emerald-500')} />
                                    <div className="grid grid-cols-3 gap-2">
                                        {passwordChecks.map((check, index) => (
                                            <div key={index} className={cn('flex items-center gap-1 text-[11px]', check.valid ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground')}>
                                                {check.valid ? <CheckCircle2 className="h-3 w-3 shrink-0" /> : <XCircle className="h-3 w-3 shrink-0 opacity-50" />}
                                                <span className="truncate">{check.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="photoURL">{t('auth.register.photoUrl')} <span className="text-muted-foreground font-normal">{t('auth.register.photoUrlOptional')}</span></Label>
                            <div className="relative">
                                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <Input id="photoURL" name="photoURL" type="url" value={formData.photoURL} onChange={handleChange}
                                    placeholder={t('auth.register.photoUrlPlaceholder')} className="pl-10" />
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} size="lg" className="w-full shadow-glow">
                            {loading ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> {t('auth.register.creating')}</>
                            ) : (
                                <>{t('auth.register.submit')} <ArrowRight className="h-4 w-4" /></>
                            )}
                        </Button>
                    </form>

                    <p className="text-center mt-6 text-sm text-muted-foreground">
                        {t('auth.register.haveAccount')}{' '}
                        <Link to="/login" className="text-primary font-semibold hover:underline">{t('auth.register.loginLink')}</Link>
                    </p>

                    <p className="text-center mt-6 text-xs italic text-muted-foreground/70">
                        {t('auth.register.islamicQuote')}
                        <span className="block mt-1 not-italic font-medium">{t('auth.register.hadithRef')}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
