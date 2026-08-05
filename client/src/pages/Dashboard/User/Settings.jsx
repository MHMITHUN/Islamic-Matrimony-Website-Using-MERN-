import { Settings as SettingsIcon, Globe, User as UserIcon, ShieldCheck, Crown, Moon, Sun } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import PageHeader from '../../../components/dashboard/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const { lang, setLang } = useLanguage();
    const { user, isAdmin, isPremium } = useAuth();

    return (
        <>
            <Helmet><title>Settings - Nikah Matrimony</title></Helmet>
            <div className="space-y-6">
                <PageHeader title="Settings" description="Manage your account preferences." icon={SettingsIcon} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Account info */}
                    <Card>
                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><UserIcon className="h-4 w-4 text-primary" /> Account Info</CardTitle></CardHeader>
                        <CardContent className="space-y-1">
                            {[
                                { label: 'Name', value: user?.displayName || 'N/A' },
                                { label: 'Email', value: user?.email },
                            ].map((row, i) => (
                                <div key={i} className="flex items-center justify-between py-2.5">
                                    <span className="text-sm text-muted-foreground">{row.label}</span>
                                    <span className="text-sm font-medium text-foreground truncate ml-4">{row.value}</span>
                                </div>
                            ))}
                            <Separator />
                            <div className="flex items-center justify-between py-2.5">
                                <span className="text-sm text-muted-foreground">Role</span>
                                <Badge variant={isAdmin ? 'secondary' : 'soft'}>{isAdmin ? 'Admin' : 'User'}</Badge>
                            </div>
                            <div className="flex items-center justify-between py-2.5">
                                <span className="text-sm text-muted-foreground">Premium Status</span>
                                {isPremium ? <Badge variant="gold" className="gap-1"><Crown className="h-3 w-3" /> Premium</Badge> : <span className="text-xs text-muted-foreground">Standard</span>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preferences */}
                    <Card>
                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><SettingsIcon className="h-4 w-4 text-primary" /> Preferences</CardTitle></CardHeader>
                        <CardContent className="space-y-1">
                            <div className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-3">
                                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-muted text-foreground">{theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}</span>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Theme</p>
                                        <p className="text-xs text-muted-foreground">{theme === 'dark' ? 'Dark mode' : 'Light mode'}</p>
                                    </div>
                                </div>
                                <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-3">
                                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-muted text-foreground"><Globe className="h-4 w-4" /></span>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Language</p>
                                        <p className="text-xs text-muted-foreground">{lang === 'bn' ? 'Bangla' : 'English'}</p>
                                    </div>
                                </div>
                                <div className="inline-flex rounded-lg bg-muted p-0.5">
                                    {[['en', 'EN'], ['bn', 'বাংলা']].map(([val, label]) => (
                                        <button key={val} onClick={() => setLang(val)}
                                            className={cn('px-3 py-1.5 text-xs font-medium rounded-md transition-colors', lang === val ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Privacy */}
                <Card>
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Privacy & Security</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 p-4 rounded-xl border bg-card/50">
                                <span className="grid place-items-center h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0"><ShieldCheck className="h-4 w-4" /></span>
                                <div><p className="text-sm font-medium text-foreground">Data Protection</p><p className="text-xs text-muted-foreground">Your data is encrypted and stored securely</p></div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-xl border bg-card/50">
                                <span className="grid place-items-center h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0"><UserIcon className="h-4 w-4" /></span>
                                <div><p className="text-sm font-medium text-foreground">Profile Privacy</p><p className="text-xs text-muted-foreground">Contact info is only visible to premium users</p></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default Settings;
