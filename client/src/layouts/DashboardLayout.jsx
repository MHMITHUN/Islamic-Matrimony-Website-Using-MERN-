import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Home, Pencil, Eye, Mail, Heart, HeartHandshake, LogOut, Menu, Crown,
    Users, CheckCircle2, PieChart, ListChecks, ArrowLeft, History, Activity,
    Settings, Flag, Bell, Scale, MessageSquare, User as UserIcon, ChevronLeft,
} from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import DarkModeToggle from '../components/DarkModeToggle';
import Logo from '../components/shared/Logo';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { adminAPI } from '../api/api';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout, isAdmin, isPremium } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const { data: pendingRequests = [] } = useQuery({
        queryKey: ['premiumRequests'],
        queryFn: async () => {
            if (!isAdmin) return [];
            const response = await adminAPI.getPremiumRequests();
            return response.data;
        },
        enabled: isAdmin,
        refetchInterval: 30000,
    });

    const handleLogout = async () => {
        try {
            await logout();
            toast.success(t('toast.logoutSuccess'));
            navigate('/');
        } catch (error) {
            toast.error(t('toast.logoutFailed'));
        }
    };

    const userLinks = [
        { path: '/dashboard/overview', icon: Home, label: 'Overview' },
        { path: '/dashboard/edit-biodata', icon: Pencil, label: t('dashboard.sidebar.editBiodata') },
        { path: '/dashboard/view-biodata', icon: Eye, label: t('dashboard.sidebar.viewBiodata') },
        { path: '/dashboard/matches', icon: Scale, label: 'Matches' },
        { path: '/dashboard/messages', icon: MessageSquare, label: 'Messages' },
        { path: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
        { path: '/dashboard/contact-requests', icon: Mail, label: t('dashboard.sidebar.myContactRequests') },
        { path: '/dashboard/favorites', icon: Heart, label: t('dashboard.sidebar.favouritesBiodata') },
        { path: '/dashboard/profile-views', icon: Eye, label: 'Profile Views' },
        { path: '/dashboard/recently-viewed', icon: History, label: 'Recently Viewed' },
        { path: '/dashboard/activity', icon: Activity, label: 'Activity Feed' },
        { path: '/dashboard/got-married', icon: HeartHandshake, label: t('dashboard.sidebar.gotMarried') },
        { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
    ];

    const adminLinks = [
        { path: '/dashboard/admin', icon: PieChart, label: t('dashboard.sidebar.adminDashboard') },
        { path: '/dashboard/admin/manage-users', icon: Users, label: t('dashboard.sidebar.manageUsers') },
        { path: '/dashboard/admin/approved-premium', icon: Crown, label: t('dashboard.sidebar.approvedPremium'), badgeKey: 'premium' },
        { path: '/dashboard/admin/approved-contacts', icon: CheckCircle2, label: t('dashboard.sidebar.approvedContacts') },
        { path: '/dashboard/admin/contact-messages', icon: Mail, label: t('dashboard.sidebar.contactMessages') },
        { path: '/dashboard/admin/success-stories', icon: ListChecks, label: t('dashboard.sidebar.successStories') },
        { path: '/dashboard/admin/reports', icon: Flag, label: 'Reports' },
    ];

    const links = isAdmin ? adminLinks : userLinks;

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Brand */}
            <div className="px-5 py-5 border-b border-white/10">
                <Logo textVariant="light" />
            </div>

            {/* Profile card */}
            <div className="p-3">
                <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-3">
                    <Avatar className="h-10 w-10 ring-2 ring-white/10">
                        {user?.photoURL ? <AvatarImage src={user.photoURL} alt={user.displayName} /> : null}
                        <AvatarFallback className="bg-emerald-400/20 text-emerald-100">
                            <UserIcon className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white text-sm truncate">{user?.displayName || 'User'}</p>
                        <p className="text-xs text-emerald-200/60 truncate">{user?.email}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                            {isPremium && (
                                <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded ring-1 ring-inset ring-amber-500/30">
                                    <Crown className="h-2.5 w-2.5" /> {t('dashboard.sidebar.premium')}
                                </span>
                            )}
                            {isAdmin && (
                                <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-200 rounded ring-1 ring-inset ring-purple-500/30">
                                    Admin
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <ScrollArea className="flex-1 px-3">
                <p className="text-[10px] font-semibold text-emerald-200/40 uppercase tracking-wider mb-2 px-3 pt-2">
                    {isAdmin ? t('dashboard.sidebar.adminMenu') : t('dashboard.sidebar.navigation')}
                </p>
                <ul className="space-y-1 pb-4">
                    {links.map((link) => (
                        <li key={link.path}>
                            <NavLink
                                to={link.path}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) =>
                                    cn(
                                        'group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm',
                                        isActive
                                            ? 'bg-white text-emerald-700 font-semibold shadow-lg shadow-emerald-950/40'
                                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                                    )
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <link.icon className={cn('h-[18px] w-[18px] shrink-0', isActive ? 'text-emerald-600' : 'text-white/60 group-hover:text-white')} />
                                        <span className="flex-1">{link.label}</span>
                                        {isAdmin && link.badgeKey === 'premium' && pendingRequests.length > 0 && (
                                            <span className="grid place-items-center min-w-[20px] h-5 px-1 bg-amber-500 text-white text-[10px] font-bold rounded-full">
                                                {pendingRequests.length}
                                            </span>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </ScrollArea>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 space-y-1.5">
                <NavLink
                    to="/"
                    className="flex items-center gap-3 px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="h-[18px] w-[18px]" /> {t('dashboard.sidebar.backToHome')}
                </NavLink>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 bg-red-500/15 hover:bg-red-500/25 text-red-300 hover:text-red-200 rounded-lg transition-colors text-sm font-medium ring-1 ring-inset ring-red-500/20"
                >
                    <LogOut className="h-[18px] w-[18px]" /> {t('dashboard.sidebar.logout')}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-emerald-800 to-emerald-950 h-screen z-40">
                <SidebarContent />
            </aside>

            {/* Mobile sidebar */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent side="left" className="w-72 p-0 bg-gradient-to-b from-emerald-800 to-emerald-950 border-0">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Navigation</SheetTitle>
                    </SheetHeader>
                    <SidebarContent />
                </SheetContent>
            </Sheet>

            {/* Main */}
            <div className="lg:pl-64">
                <header className="sticky top-0 z-30 glass-nav border-b border-border">
                    <div className="flex items-center justify-between gap-3 px-4 md:px-6 h-16">
                        <div className="flex items-center gap-3 min-w-0">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                            <div className="min-w-0">
                                <h1 className="font-heading text-base md:text-lg font-bold text-foreground truncate">
                                    {isAdmin ? t('dashboard.sidebar.adminDashboardTitle') : t('dashboard.sidebar.myDashboard')}
                                </h1>
                                <p className="text-xs text-muted-foreground hidden sm:block truncate">
                                    {t('dashboard.sidebar.welcome').replace('{name}', user?.displayName?.split(' ')[0] || 'User')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <LanguageToggle />
                            <DarkModeToggle />
                            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                                <NavLink to="/">
                                    <ChevronLeft className="h-4 w-4" /> {t('dashboard.sidebar.backToHome')}
                                </NavLink>
                            </Button>
                        </div>
                    </div>
                </header>

                <main key={pathname} className="p-4 md:p-6 lg:p-8 animate-in fade-in-50 duration-200">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
