import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const prevPathRef = useRef(pathname);

    useEffect(() => {
        const prevPath = prevPathRef.current;
        prevPathRef.current = pathname;

        const isCurrentDashboard = pathname.startsWith('/dashboard');
        const isPrevDashboard = prevPath.startsWith('/dashboard');

        if (isCurrentDashboard && isPrevDashboard) {
            // Smoothly scroll to top of dashboard content if user scrolled down
            if (window.scrollY > 50) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
            return;
        }

        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    }, [pathname]);

    return null;
};

export default ScrollToTop;
