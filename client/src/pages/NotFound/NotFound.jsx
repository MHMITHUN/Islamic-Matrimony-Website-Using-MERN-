import { Link } from 'react-router-dom';
import { Home, Search, Compass } from 'lucide-react';
import { FaMosque } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const NotFound = () => {
    const { t } = useLanguage();

    return (
        <div className="relative min-h-screen grid place-items-center overflow-hidden bg-background px-4 pt-16">
            <div className="absolute inset-0 bg-aurora opacity-70" />
            <div className="absolute inset-0 bg-grid opacity-[0.4] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
            <div className="relative max-w-lg w-full text-center">
                <div className="inline-grid place-items-center h-16 w-16 rounded-2xl bg-gradient-brand shadow-glow mx-auto mb-6">
                    <FaMosque className="text-3xl text-white" />
                </div>
                <h1 className="font-heading text-7xl md:text-9xl font-bold text-gradient-brand leading-none">404</h1>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground mt-4 mb-3">
                    <Compass className="h-3.5 w-3.5" /> Page not found
                </div>
                <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-2">{t('notFound.heading')}</h2>
                <p className="text-muted-foreground mb-7 max-w-md mx-auto text-sm">{t('notFound.desc')}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild size="lg"><Link to="/"><Home className="h-4 w-4" />{t('notFound.goHome')}</Link></Button>
                    <Button asChild size="lg" variant="outline"><Link to="/biodatas"><Search className="h-4 w-4" />{t('notFound.browseBiodatas')}</Link></Button>
                </div>
                <div className="mt-12 text-xs text-muted-foreground/70">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</div>
            </div>
        </div>
    );
};

export default NotFound;
