import { useEffect, useState, useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';

const AnimatedCounter = ({ value, duration = 2, suffix = '' }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, latest => Math.round(latest));
    const [displayValue, setDisplayValue] = useState(0);
    const nodeRef = useRef(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsInView(true);
                }
            },
            { threshold: 0.3 }
        );

        if (nodeRef.current) {
            observer.observe(nodeRef.current);
        }

        return () => {
            if (nodeRef.current) {
                observer.unobserve(nodeRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isInView && value) {
            const controls = { value: count.get() };
            const animation = {
                value: value,
                transition: {
                    duration,
                    ease: 'easeOut'
                }
            };

            count.set(0);

            const unsubscribe = rounded.on('change', latest => {
                setDisplayValue(latest);
            });

            // Animate
            const interval = setInterval(() => {
                const current = count.get();
                if (current < value) {
                    count.set(Math.min(current + value / (duration * 60), value));
                } else {
                    clearInterval(interval);
                }
            }, 1000 / 60);

            return () => {
                clearInterval(interval);
                unsubscribe();
            };
        }
    }, [isInView, value, duration]);

    return <span ref={nodeRef}>{displayValue.toLocaleString()}{suffix}</span>;
};

export default AnimatedCounter;
