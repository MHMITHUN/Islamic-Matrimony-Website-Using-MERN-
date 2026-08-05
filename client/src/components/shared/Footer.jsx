import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart, Send, Sparkles } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Logo from './Logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState('');
    const { t } = useLanguage();

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            toast.success(t('toast.subscribeSuccess'));
            setEmail('');
        }
    };

    const socialLinks = [
        { icon: FaFacebookF, href: '#', label: 'Facebook' },
        { icon: FaTwitter, href: '#', label: 'Twitter' },
        { icon: FaInstagram, href: '#', label: 'Instagram' },
        { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
    ];

    const quickLinks = [
        { to: '/', label: t('nav.home') },
        { to: '/biodatas', label: t('footer.browseBiodatas') },
        { to: '/about', label: t('nav.about') },
        { to: '/contact', label: t('nav.contact') },
        { to: '/register', label: t('footer.registerNow') },
    ];

    const services = [
        t('footer.profileCreation'),
        t('footer.partnerSearch'),
        t('footer.premiumMembership'),
        t('footer.verifiedProfiles'),
        t('footer.privacyProtection'),
    ];

    return (
        <footer className="relative bg-gradient-to-b from-background to-muted/40 border-t border-border">
            {/* Newsletter */}
            <div className="container-custom pt-16 pb-12">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-8 md:p-12 shadow-premium-lg">
                    <div className="absolute inset-0 bg-dots opacity-[0.12]" />
                    <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative max-w-2xl mx-auto text-center text-white">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold mb-4 backdrop-blur">
                            <Sparkles className="h-3.5 w-3.5" /> Newsletter
                        </span>
                        <h3 className="font-heading text-2xl md:text-3xl font-bold mb-3">
                            {t('footer.stayUpdated')}{' '}
                            <span className="text-amber-200">{t('footer.nikahMatrimony')}</span>
                        </h3>
                        <p className="text-white/85 mb-6 text-sm md:text-base max-w-lg mx-auto">
                            {t('footer.subscribeDesc')}
                        </p>
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('auth.login.emailPlaceholder')}
                                className="flex-1 h-12 bg-white/95 border-transparent text-foreground placeholder:text-muted-foreground"
                                required
                            />
                            <Button type="submit" size="lg" variant="gold" className="shrink-0">
                                <Send className="h-4 w-4" />
                                {t('footer.subscribe')}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Links */}
            <div className="container-custom pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-4">
                        <Logo className="mb-4" />
                        <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-xs">
                            {t('footer.brandDesc')}
                        </p>
                        <div className="flex gap-2">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="grid place-items-center h-9 w-9 rounded-lg bg-muted text-muted-foreground hover:text-primary-foreground hover:bg-primary hover:-translate-y-0.5 transition-all"
                                >
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-2">
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            {t('footer.quickLinks')}
                        </h3>
                        <ul className="space-y-2.5">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <Link to={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group">
                                        <span className="h-px w-0 bg-primary transition-all group-hover:w-3" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="lg:col-span-3">
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            {t('footer.ourServices')}
                        </h3>
                        <ul className="space-y-2.5">
                            {services.map((service, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                    <span className="h-1 w-1 rounded-full bg-gold" />
                                    {service}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="lg:col-span-3">
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            {t('footer.contactUs')}
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                <span>{t('contact.info.address1', 'House 123, Road 45, Gulshan-2, Dhaka 1212, Bangladesh')}</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 text-primary shrink-0" />
                                <span>+880 1700-000000</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4 text-primary shrink-0" />
                                <span>info@nikahmatrimony.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border pt-6">
                    <p className="text-sm text-muted-foreground text-center md:text-left inline-flex items-center gap-1.5">
                        {t('footer.copyright').replace('{year}', currentYear)}
                        <Heart className="h-3.5 w-3.5 fill-destructive text-destructive" />
                        {t('footer.inBangladesh')}
                    </p>
                    <div className="flex gap-6 text-sm">
                        <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.privacyPolicy')}</Link>
                        <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.termsOfService')}</Link>
                    </div>
                </div>

                {/* Islamic Quote */}
                <div className="mt-6 pt-6 border-t border-border text-center">
                    <p className="text-xs italic text-muted-foreground">
                        {t('footer.quote')}
                        <span className="block mt-1 text-muted-foreground/70 font-medium not-italic">{t('footer.quoteRef')}</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
