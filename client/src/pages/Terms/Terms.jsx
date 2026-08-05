import { Helmet } from 'react-helmet-async';
import { FileText, UserCheck, Banknote, Ban, Gavel, Handshake, ScrollText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
    { icon: UserCheck, title: 'Account Registration', content: ['You must be at least 18 years old to use this service', 'You must provide accurate and truthful information', 'You are responsible for maintaining account security', 'One person may only create one account', 'Accounts are non-transferable'] },
    { icon: Handshake, title: 'User Conduct', content: ['All interactions must adhere to Islamic principles and values', 'Respectful communication is required at all times', 'Harassment, abuse, or inappropriate behavior is strictly prohibited', 'Users must have genuine intentions for marriage', 'Misrepresentation of identity or information is not allowed'] },
    { icon: Banknote, title: 'Premium Services & Payment', content: ['Premium memberships are subscription-based services', 'Payments are processed securely through our payment partners', 'Subscriptions automatically renew unless cancelled', 'Refund requests are considered on a case-by-case basis', 'Prices may change with 30 days notice to existing subscribers'] },
    { icon: Ban, title: 'Prohibited Activities', content: ['Creating fake profiles or providing false information', 'Soliciting money or financial information from other users', 'Sharing inappropriate content or images', 'Using the platform for commercial or promotional purposes', 'Attempting to hack, abuse, or manipulate the platform', 'Violating any applicable laws or regulations'] },
    { icon: Gavel, title: 'Disclaimers & Limitations', content: ['We facilitate connections but do not guarantee marriage outcomes', 'Users are responsible for their own decisions and interactions', 'We are not liable for relationships formed through the platform', 'We verify information to the best of our ability but cannot guarantee accuracy', 'Service availability may be subject to technical limitations'] },
    { icon: ScrollText, title: 'Account Termination', content: ['We reserve the right to suspend or terminate accounts that violate these terms', 'Users may delete their accounts at any time', 'Upon termination, access to premium features will cease', 'We may retain certain information as required by law', 'Repeated violations may result in permanent ban'] },
];

const Terms = () => {
    return (
        <>
            <Helmet>
                <title>Terms of Service - Nikah Islamic Matrimony</title>
                <meta name="description" content="Read our Terms of Service to understand your rights and responsibilities when using Nikah Matrimony platform." />
            </Helmet>
            <div className="min-h-screen pt-16">
                <section className="relative overflow-hidden py-16 md:py-20 bg-gradient-to-br from-emerald-800 to-emerald-950 text-white">
                    <div className="absolute inset-0 bg-dots opacity-[0.08]" />
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-60 w-60 rounded-full bg-emerald-400/20 blur-3xl" />
                    <div className="relative container-custom max-w-4xl text-center">
                        <div className="inline-grid place-items-center h-14 w-14 rounded-2xl bg-gradient-gold shadow-glow mx-auto mb-5"><FileText className="h-7 w-7 text-white" /></div>
                        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">Terms of Service</h1>
                        <p className="text-emerald-100/80 max-w-xl mx-auto text-sm">By using Nikah Matrimony, you agree to these terms and conditions. Please read them carefully before using our services.</p>
                        <p className="text-xs text-emerald-200/60 mt-3">Last Updated: December 6, 2025</p>
                    </div>
                </section>

                <div className="container-custom max-w-4xl py-12">
                    <div className="space-y-4">
                        {sections.map((section, index) => (
                            <Card key={index} className="card-lift hover:border-primary/30">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <span className="grid place-items-center h-10 w-10 rounded-xl bg-primary/10 text-primary shrink-0"><section.icon className="h-5 w-5" /></span>
                                        <div>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Section {String(index + 1).padStart(2, '0')}</span>
                                            <h2 className="font-heading text-lg font-bold text-foreground">{section.title}</h2>
                                        </div>
                                    </div>
                                    <ul className="space-y-2 sm:pl-14">
                                        {section.content.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2.5 text-muted-foreground text-sm">
                                                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-5 text-center">
                        <p className="text-muted-foreground text-sm"><strong className="text-foreground">Acceptance of Terms:</strong> By creating an account and using Nikah Matrimony, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
                    </div>
                    <div className="mt-4 text-center text-muted-foreground text-sm">
                        Questions about our terms? Contact us at{' '}
                        <a href="mailto:legal@nikahmatrimony.com" className="text-primary font-semibold hover:underline">legal@nikahmatrimony.com</a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Terms;
