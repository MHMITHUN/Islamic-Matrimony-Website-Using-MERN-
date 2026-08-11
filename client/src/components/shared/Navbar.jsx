import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, LogOut, User as UserIcon, LayoutDashboard, Crown, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import DarkModeToggle from '../DarkModeToggle';
import LanguageToggle from '../LanguageToggle';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logout, isAdmin, isPremium } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 8);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success(t('toast.logoutSuccess'));
            navigate('/');
        } catch (error) {
            toast.error(t('toast.logoutFailed'));
        }
    };

    const navLinks = [
        { path: '/', label: t('nav.home') },
        { path: '/biodatas', label: t('nav.biodatas') },
        { path: '/stories', label: t('nav.stories') },
        { path: '/guidance', label: t('nav.guidance') },
        { path: '/about', label: t('nav.about') },
        { path: '/contact', label: t('nav.contact') },
    ];

    const dashboardPath = isAdmin ? '/dashboard/admin' : '/dashboard';

    const desktopNav = (
        <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
                <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                        cn(
                            'relative px-3.5 py-2 text-sm font-medium transition-colors duration-200 rounded-lg',
                            isActive
                                ? 'text-primary'
                                : 'text-foreground/70 hover:text-foreground hover:bg-accent/60'
                        )
                    }
                >
                    {({ isActive }) => (
                        <>
                            {link.label}
                            {isActive && (
                                <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-primary to-emerald-400" />
                            )}
                        </>
                    )}
                </NavLink>
            ))}
            {user && (
                <NavLink
                    to={dashboardPath}
                    className={({ isActive }) =>
                        cn(
                            'px-3.5 py-2 text-sm font-medium transition-colors flex items-center gap-1.5 rounded-lg',
                            isActive
                                ? 'text-primary'
                                : 'text-foreground/70 hover:text-foreground hover:bg-accent/60'
                        )
                    }
                >
                    {t('nav.dashboard')}
                    {isPremium && <Crown className="h-3.5 w-3.5 text-gold" />}
                </NavLink>
            )}
        </div>
    );

    const renderAvatar = (size = 'h-9 w-9') => (
        <div className="relative">
            <Avatar className={cn(size, 'ring-2 ring-primary/20 ring-offset-2 ring-offset-background')}>
                {user?.photoURL ? (
                    <AvatarImage src={user.photoURL} alt={user.displayName} />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
            </Avatar>
            {isPremium && (
                <span className="absolute -top-1 -right-1 grid place-items-center h-4 w-4 rounded-full bg-gold ring-2 ring-background">
                    <Crown className="h-2.5 w-2.5 text-white" />
                </span>
            )}
        </div>
    );

    return (
        <nav
            className={cn(
                'fixed w-full top-0 z-50 transition-all duration-300',
                scrolled
                    ? 'glass-nav border-b border-border/60 shadow-premium'
                    : 'bg-transparent'
            )}
        >
            <div className="container-custom">
                <div className="flex items-center justify-between h-16 gap-4">
                    <Logo />

                    {desktopNav}

                    {/* Right side */}
                    <div className="hidden lg:flex items-center gap-1.5">
                        <LanguageToggle />
                        <DarkModeToggle />

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="ml-1 flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-accent/60 transition-colors">
                                        {renderAvatar()}
                                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-60">
                                    <DropdownMenuLabel className="normal-case">
                                        <p className="font-semibold text-sm text-foreground truncate">{user.displayName}</p>
                                        <p className="text-xs text-muted-foreground font-normal truncate">{user.email}</p>
                                        {(isPremium || isAdmin) && (
                                            <div className="flex gap-1.5 mt-2">
                                                {isPremium && (
                                                    <Badge variant="gold" className="gap-1">
                                                        <Crown className="h-3 w-3" /> Premium
                                                    </Badge>
                                                )}
                                                {isAdmin && (
                                                    <Badge variant="secondary">Admin</Badge>
                                                )}
                                            </div>
                                        )}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link to={dashboardPath}>
                                            <LayoutDashboard className="h-4 w-4" />
                                            {t('nav.myDashboard')}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to={dashboardPath}>
                                            <UserIcon className="h-4 w-4" />
                                            {t('dashboard.sidebar.viewBiodata')}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        {t('nav.logout')}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-1.5 ml-1">
                                <Button asChild variant="ghost" size="sm">
                                    <Link to="/login">{t('nav.signIn')}</Link>
                                </Button>
                                <Button asChild size="sm" className="shadow-glow">
                                    <Link to="/register">{t('nav.getStarted')}</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile triggers */}
                    <div className="flex lg:hidden items-center gap-1">
                        <LanguageToggle />
                        <DarkModeToggle />
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <button
                                    className="grid place-items-center h-9 w-9 rounded-lg hover:bg-accent transition-colors text-foreground"
                                    aria-label="Open menu"
                                >
                                    <Menu className="h-5 w-5" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] p-0">
                                <SheetHeader className="px-5 pt-5">
                                    <SheetTitle asChild>
                                        <div><Logo /></div>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col h-[calc(100%-100px)] px-3 py-4 overflow-y-auto">
                                    <nav className="space-y-1">
                                        {navLinks.map((link) => (
                                            <NavLink
                                                key={link.path}
                                                to={link.path}
                                                onClick={() => setIsOpen(false)}
                                                className={({ isActive }) =>
                                                    cn(
                                                        'block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                                        isActive
                                                            ? 'bg-primary/10 text-primary'
                                                            : 'text-foreground/80 hover:bg-accent'
                                                    )
                                                }
                                            >
                                                {link.label}
                                            </NavLink>
                                        ))}
                                        {user && (
                                            <NavLink
                                                to={dashboardPath}
                                                onClick={() => setIsOpen(false)}
                                                className={({ isActive }) =>
                                                    cn(
                                                        'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                                        isActive
                                                            ? 'bg-primary/10 text-primary'
                                                            : 'text-foreground/80 hover:bg-accent'
                                                    )
                                                }
                                            >
                                                <span>{t('nav.dashboard')}</span>
                                                {isPremium && <Crown className="h-3.5 w-3.5 text-gold" />}
                                            </NavLink>
                                        )}
                                    </nav>

                                    <div className="mt-auto pt-4 border-t border-border">
                                        {user ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 px-2">
                                                    {renderAvatar('h-10 w-10')}
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold truncate">{user.displayName}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                    </div>
                                                </div>
                                                <Button asChild variant="outline" className="w-full">
                                                    <Link to={dashboardPath} onClick={() => setIsOpen(false)}>
                                                        <LayoutDashboard className="h-4 w-4" /> {t('nav.myDashboard')}
                                                    </Link>
                                                </Button>
                                                <Button variant="destructive" className="w-full" onClick={() => { handleLogout(); setIsOpen(false); }}>
                                                    <LogOut className="h-4 w-4" /> {t('nav.logout')}
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <Button asChild variant="outline" className="w-full">
                                                    <Link to="/login" onClick={() => setIsOpen(false)}>{t('nav.signIn')}</Link>
                                                </Button>
                                                <Button asChild className="w-full" onClick={() => setIsOpen(false)}>
                                                    <Link to="/register">{t('nav.getStarted')}</Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
