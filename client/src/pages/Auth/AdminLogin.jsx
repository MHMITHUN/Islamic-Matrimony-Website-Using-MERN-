import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import AuthAside from '../../components/shared/AuthAside';
import Logo from '../../components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { adminLogin } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard/admin';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            await adminLogin(email, password);
            toast.success('Admin login successful');
            navigate(from, { replace: true });
        } catch (error) {
            console.error('Admin login error:', error);
            const msg = error.response?.data?.message || 'Invalid admin credentials';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background">
            <AuthAside
                title="Admin"
                highlight="Control Panel"
                subtitle="Secure access for platform administrators. Manage biodatas, payments, and user activity."
                points={['Restricted to authorized admins only', 'Full dashboard & analytics access', 'Protected by server-side credentials']}
            />

            <div className="flex flex-col items-center justify-center px-6 py-12 lg:px-12">
                <div className="w-full max-w-md">
                    <div className="lg:hidden mb-8 flex justify-center">
                        <Logo />
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Admin Login</h1>
                        </div>
                        <p className="text-muted-foreground mt-1.5 text-sm">
                            Enter your administrator credentials to access the dashboard.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Admin Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="email" type="email" value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    className="pl-10" required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password">Admin Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="password" type={showPassword ? 'text' : 'password'} value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
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
                                <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
                            ) : (
                                <>Access Dashboard <ArrowRight className="h-4 w-4" /></>
                            )}
                        </Button>
                    </form>

                    <p className="text-center mt-6 text-sm text-muted-foreground">
                        Not an admin?{' '}
                        <a href="/login" className="text-primary font-semibold hover:underline">User Login</a>
                    </p>

                    <p className="text-center mt-6 text-xs italic text-muted-foreground/70">
                        Authorized personnel only. All access attempts are logged.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
