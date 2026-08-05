import { Outlet } from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import ScrollToTop from '../components/ScrollToTop';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { TooltipProvider } from '@/components/ui/tooltip';

const MainLayout = () => {
    return (
        <div className="relative min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
            <TooltipProvider delayDuration={200}>
                <ScrollToTop />
                <ScrollToTopButton />
                <Navbar />
                <main className="flex-grow">
                    <Outlet />
                </main>
                <Footer />
            </TooltipProvider>
        </div>
    );
};

export default MainLayout;
