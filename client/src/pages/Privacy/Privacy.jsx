import { Helmet } from 'react-helmet-async';
import { Database, Lock, ShieldCheck, Cookie, Mail, FileLock2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
    { icon: Database, title: 'Information We Collect', content: ['Personal information you provide when creating your profile (name, email, age, location)', 'Profile pictures and biographical information', 'Communication preferences and contact information', 'Payment information for premium services (processed securely)', 'Usage data and analytics to improve our services'] },
    { icon: Lock, title: 'How We Use Your Information', content: ['To create and maintain your profile on our platform', 'To facilitate matchmaking and connections with other users', 'To process payments for premium memberships', 'To send important updates about our services', 'To improve our platform and user experience', 'To ensure compliance with Islamic principles in matchmaking'] },
    { icon: ShieldCheck, title: 'Data Protection', content: ['We use industry-standard encryption to protect your data', 'Your personal information is never sold to third parties', 'We implement strict access controls and security measures', 'Regular security audits and updates to our systems', 'Compliance with data protection regulations'] },
    { icon: Cookie, title: 'Cookies and Tracking', content: ['We use essential cookies to maintain your session', 'Analytics cookies help us understand user behavior', 'You can control cookie preferences in your browser', 'Third-party services may use cookies for payment processing'] },
    { icon: FileLock2, title: 'Your Rights', content: ['Access and download your personal data at any time', 'Request correction of inaccurate information', 'Delete your account and associated data', 'Opt-out of marketing communications', 'Control your privacy settings and visibility'] },
    { icon: Mail, title: 'Contact Us', content: ['If you have questions about our privacy practices, contact us at:', 'Email: privacy@nikahmatrimony.com', 'Phone: +880 1700-000000', 'Address: House 123, Road 45, Gulshan-2, Dhaka 1212, Bangladesh'] },
];

const Privacy = () => {
    return (
        <>
            <Helmet>
                <title>Privacy Policy - Nikah Islamic Matrimony</title>
                <meta name="description" content="Learn how Nikah Matrimony protects your privacy and handles your personal information securely." />
            </Helmet>
            <div className="min-h-screen pt-16">
                {/* Hero */}
                <section className="relative overflow-hidden py-16 md:py-20 bg-gradient-to-br from-emerald-800 to-emerald-950 text-white">
                    <div className="absolute inset-0 bg-dots opacity-[0.08]" />
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-60 w-60 rounded-full bg-emerald-400/20 blur-3xl" />
                    <div className="relative container-custom max-w-4xl text-center">
                        <div className="inline-grid place-items-center h-14 w-14 rounded-2xl bg-gradient-gold shadow-glow mx-auto mb-5"><ShieldCheck className="h-7 w-7 text-white" /></div>
                        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">Privacy Policy</h1>
                        <p className="text-emerald-100/80 max-w-xl mx-auto text-sm">At Nikah Matrimony, we are committed to protecting your privacy and ensuring your personal information is handled securely and responsibly.</p>
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
                        <p className="text-muted-foreground text-sm"><strong className="text-foreground">Note:</strong> This privacy policy may be updated periodically. We will notify you of any significant changes via email or through our platform.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Privacy;
