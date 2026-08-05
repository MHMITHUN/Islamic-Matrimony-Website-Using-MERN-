import { CheckCircle2, ShieldCheck, HeartHandshake, Star } from 'lucide-react';
import Logo from './Logo';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * Branded split-panel shown beside auth forms on large screens.
 */
export default function AuthAside({ title, highlight, subtitle, points = [], quote, quoteRef }) {
    const { t } = useLanguage();

    return (
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-950 p-12 text-white">
            {/* decorative */}
            <div className="absolute inset-0 bg-dots opacity-[0.08]" />
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

            <div className="relative">
                <Logo textVariant="light" />
            </div>

            <div className="relative max-w-md">
                <h2 className="font-heading text-3xl xl:text-4xl font-bold leading-tight">
                    {title} <span className="text-amber-300">{highlight}</span>
                </h2>
                <p className="mt-4 text-emerald-100/80 leading-relaxed">{subtitle}</p>

                <ul className="mt-8 space-y-3">
                    {points.map((p, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-emerald-50">
                            <span className="grid place-items-center h-6 w-6 rounded-full bg-white/10 ring-1 ring-inset ring-white/15">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                            </span>
                            {p}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="relative space-y-4">
                <div className="flex items-center gap-6">
                    <div>
                        <p className="text-2xl font-bold font-heading flex items-center gap-1.5"><HeartHandshake className="h-5 w-5 text-amber-300" /> 1K+</p>
                        <p className="text-xs text-emerald-200/70">{t('auth.aside.marriages', 'Marriages')}</p>
                    </div>
                    <div className="h-8 w-px bg-white/15" />
                    <div>
                        <p className="text-2xl font-bold font-heading flex items-center gap-1.5"><ShieldCheck className="h-5 w-5 text-emerald-300" /> 100%</p>
                        <p className="text-xs text-emerald-200/70">{t('auth.aside.verified', 'Verified')}</p>
                    </div>
                    <div className="h-8 w-px bg-white/15" />
                    <div>
                        <p className="text-2xl font-bold font-heading flex items-center gap-1.5"><Star className="h-5 w-5 fill-amber-300 text-amber-300" /> 4.9</p>
                        <p className="text-xs text-emerald-200/70">{t('auth.aside.rating', 'Rating')}</p>
                    </div>
                </div>
                {quote && (
                    <p className="text-xs italic text-emerald-200/60 border-l-2 border-amber-300/40 pl-3">
                        {quote}
                        {quoteRef && <span className="block mt-1 not-italic text-emerald-300/50 font-medium">— {quoteRef}</span>}
                    </p>
                )}
            </div>
        </div>
    );
}
