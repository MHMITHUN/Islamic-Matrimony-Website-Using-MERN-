import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: '1.5rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            colors: {
                // ===== shadcn design tokens (driven by CSS variables) =====
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                // Brand accent: warm gold
                gold: {
                    DEFAULT: 'hsl(var(--gold))',
                    foreground: 'hsl(var(--gold-foreground))',
                },
                // Chart palette (emerald/gold themed)
                chart: {
                    1: 'hsl(var(--chart-1))',
                    2: 'hsl(var(--chart-2))',
                    3: 'hsl(var(--chart-3))',
                    4: 'hsl(var(--chart-4))',
                    5: 'hsl(var(--chart-5))',
                },
            },
            borderRadius: {
                xl: 'calc(var(--radius) + 4px)',
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
                card: '14px',
            },
            fontFamily: {
                sans: ['Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
                heading: ['Outfit', 'Inter', 'sans-serif'],
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                'collapsible-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-collapsible-content-height)' },
                },
                'collapsible-up': {
                    from: { height: 'var(--radix-collapsible-content-height)' },
                    to: { height: '0' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'spin-slow': {
                    to: { transform: 'rotate(360deg)' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                'pulse-ring': {
                    '0%': { transform: 'scale(0.95)', opacity: '0.7' },
                    '70%': { transform: 'scale(1.3)', opacity: '0' },
                    '100%': { transform: 'scale(1.3)', opacity: '0' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'collapsible-down': 'collapsible-down 0.2s ease-in-out',
                'collapsible-up': 'collapsible-up 0.2s ease-in-out',
                'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                shimmer: 'shimmer 2.5s linear infinite',
                'spin-slow': 'spin-slow 8s linear infinite',
                marquee: 'marquee 30s linear infinite',
                'pulse-ring': 'pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
            },
            boxShadow: {
                premium: '0 1px 2px rgba(16, 80, 60, 0.04), 0 8px 24px -8px rgba(16, 80, 60, 0.12)',
                'premium-lg': '0 4px 12px -2px rgba(16, 80, 60, 0.08), 0 24px 48px -12px rgba(16, 80, 60, 0.18)',
                glow: '0 0 0 1px rgba(4, 120, 87, 0.1), 0 8px 30px -6px rgba(4, 120, 87, 0.35)',
                'glow-gold': '0 0 0 1px rgba(245, 158, 11, 0.15), 0 8px 30px -6px rgba(245, 158, 11, 0.4)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [tailwindcssAnimate],
}
