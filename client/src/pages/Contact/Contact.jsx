import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, FaQuestionCircle, FaChevronDown } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';
import { contactMessageAPI } from '../../api/api';

const Contact = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

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
        { icon: <FaMapMarkerAlt />, title: t('contact.info.visit'), lines: [t('contact.info.address1'), t('contact.info.address2'), t('contact.info.address3')], color: 'bg-blue-600' },
        { icon: <FaPhone />, title: t('contact.info.call'), lines: ['+880 1700-000000', '+880 1800-000000'], color: 'bg-emerald-600' },
        { icon: <FaEnvelope />, title: t('contact.info.email'), lines: ['info@nikahmatrimony.com', 'support@nikahmatrimony.com'], color: 'bg-pink-600' },
        { icon: <FaClock />, title: t('contact.info.hours'), lines: [t('contact.info.satThu'), t('contact.info.time')], color: 'bg-amber-600' }
    ];

    const faqs = [
        { question: t('contact.faq.q1'), answer: t('contact.faq.a1') },
        { question: t('contact.faq.q2'), answer: t('contact.faq.a2') },
        { question: t('contact.faq.q3'), answer: t('contact.faq.a3') }
    ];

    return (
        <div className="min-h-screen">
            <section className="py-20 md:py-28 bg-emerald-700">
                <div className="container-custom text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">{t('contact.hero.heading1')} <span className="text-amber-300">{t('contact.hero.highlight')}</span></h1>
                    <p className="text-base md:text-lg text-emerald-200 max-w-2xl mx-auto">{t('contact.hero.desc')}</p>
                </div>
            </section>

            <section className="py-12 bg-white dark:bg-gray-900">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {contactInfo.map((info, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors">
                                <div className={`w-10 h-10 ${info.color} rounded-lg flex items-center justify-center mx-auto mb-3 text-white`}>{info.icon}</div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">{info.title}</h3>
                                {info.lines.map((line, i) => (<p key={i} className="text-gray-500 dark:text-gray-400 text-sm">{line}</p>))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 bg-gray-50 dark:bg-gray-900">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
                            <div className="mb-6">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{t('contact.form.heading')}</h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{t('contact.form.subtitle')}</p>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('contact.form.name')}</label><input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={t('contact.form.namePlaceholder')} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-400 dark:text-white text-sm" required /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('contact.form.email')}</label><input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={t('contact.form.emailPlaceholder')} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-400 dark:text-white text-sm" required /></div>
                                </div>
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('contact.form.subject')}</label><input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder={t('contact.form.subjectPlaceholder')} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-400 dark:text-white text-sm" required /></div>
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('contact.form.message')}</label><textarea name="message" value={formData.message} onChange={handleChange} placeholder={t('contact.form.messagePlaceholder')} rows="4" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-400 dark:text-white text-sm resize-none" required></textarea></div>
                                <button type="submit" disabled={loading} className="w-full py-2.5 px-4 rounded-lg transition-colors bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {loading ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>{t('contact.form.sending')}</>) : (<><FaPaperPlane className="text-xs" /> {t('contact.form.send')}</>)}
                                </button>
                            </form>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.0!2d90.4125!3d23.7925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ3JzMzLjAiTiA5MMKwMjQnNDUuMCJF!5e0!3m2!1sen!2sbd!4v1234567890" width="100%" height="100%" style={{ border: 0, minHeight: '400px' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 bg-white dark:bg-gray-900">
                <div className="container-custom">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('contact.faq.heading')}</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-sm">{t('contact.faq.subtitle')}</p>
                    </div>
                    <div className="max-w-2xl mx-auto space-y-3">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm pr-4">{faq.question}</h3>
                                    <FaChevronDown className={`text-emerald-600 text-xs flex-shrink-0 transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`overflow-hidden transition-all duration-200 ${openFaq === index ? 'max-h-40' : 'max-h-0'}`}>
                                    <p className="px-4 pb-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
