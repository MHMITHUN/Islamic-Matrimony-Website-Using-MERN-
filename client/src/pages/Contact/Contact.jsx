import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Loader2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { contactMessageAPI } from '../../api/api';
import SectionHeading from '../../components/shared/SectionHeading';
import Reveal from '../../components/shared/Reveal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const Contact = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await contactMessageAPI.send(formData);
            toast.success(t('toast.messageSent'));
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            toast.error(t('toast.messageFailed'));
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        { icon: MapPin, title: t('contact.info.visit'), lines: [t('contact.info.address1'), t('contact.info.address2'), t('contact.info.address3')], tint: 'bg-sky-500/10 text-sky-600' },
        { icon: Phone, title: t('contact.info.call'), lines: ['+880 1700-000000', '+880 1800-000000'], tint: 'bg-emerald-500/10 text-emerald-600' },
        { icon: Mail, title: t('contact.info.email'), lines: ['info@nikahmatrimony.com', 'support@nikahmatrimony.com'], tint: 'bg-rose-500/10 text-rose-600' },
        { icon: Clock, title: t('contact.info.hours'), lines: [t('contact.info.satThu'), t('contact.info.time')], tint: 'bg-amber-500/10 text-amber-600' },
    ];

    const faqs = [
        { question: t('contact.faq.q1'), answer: t('contact.faq.a1') },
        { question: t('contact.faq.q2'), answer: t('contact.faq.a2') },
        { question: t('contact.faq.q3'), answer: t('contact.faq.a3') },
    ];

    return (
        <div className="min-h-screen pt-16">
            {/* Hero */}
            <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-950 text-white">
                <div className="absolute inset-0 bg-dots opacity-[0.08]" />
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
                <div className="relative container-custom text-center">
                    <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold">{t('contact.hero.heading1')} <span className="text-amber-300">{t('contact.hero.highlight')}</span></h1>
                    <p className="mt-4 text-base md:text-lg text-emerald-100/80 max-w-2xl mx-auto">{t('contact.hero.desc')}</p>
                </div>
            </section>

            {/* Info cards */}
            <section className="py-12">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {contactInfo.map((info, index) => (
                            <Reveal key={index} delay={index * 0.08}>
                                <Card className="card-lift hover:border-primary/30 text-center h-full">
                                    <CardContent className="p-6">
                                        <div className={cn('grid place-items-center h-12 w-12 rounded-xl mx-auto mb-3', info.tint)}><info.icon className="h-5 w-5" /></div>
                                        <h3 className="font-heading font-bold text-foreground mb-2">{info.title}</h3>
                                        {info.lines.map((line, i) => <p key={i} className="text-muted-foreground text-sm">{line}</p>)}
                                    </CardContent>
                                </Card>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form + Map */}
            <section className="py-12 bg-muted/30">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Reveal>
                            <Card className="h-full">
                                <CardContent className="p-6 md:p-8">
                                    <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">{t('contact.form.heading')}</h2>
                                    <p className="text-muted-foreground mt-1 mb-6 text-sm">{t('contact.form.subtitle')}</p>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5"><Label htmlFor="name">{t('contact.form.name')}</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder={t('contact.form.namePlaceholder')} required /></div>
                                            <div className="space-y-1.5"><Label htmlFor="email">{t('contact.form.email')}</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder={t('contact.form.emailPlaceholder')} required /></div>
                                        </div>
                                        <div className="space-y-1.5"><Label htmlFor="subject">{t('contact.form.subject')}</Label><Input id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder={t('contact.form.subjectPlaceholder')} required /></div>
                                        <div className="space-y-1.5"><Label htmlFor="message">{t('contact.form.message')}</Label><Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder={t('contact.form.messagePlaceholder')} rows={4} className="resize-none" required /></div>
                                        <Button type="submit" disabled={loading} size="lg" className="w-full">
                                            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> {t('contact.form.sending')}</> : <><Send className="h-4 w-4" /> {t('contact.form.send')}</>}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <Card className="overflow-hidden h-full min-h-[400px]">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.0!2d90.4125!3d23.7925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ3JzMzLjAiTiA5MMKwMjQnNDUuMCJF!5e0!3m2!1sen!2sbd!4v1234567890"
                                    width="100%" height="100%" style={{ border: 0, minHeight: '400px' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Location map"
                                />
                            </Card>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16">
                <div className="container-custom">
                    <SectionHeading title={t('contact.faq.heading')} subtitle={t('contact.faq.subtitle')} />
                    <div className="max-w-2xl mx-auto mt-8">
                        <Accordion type="single" collapsible className="rounded-xl border bg-card px-4">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
