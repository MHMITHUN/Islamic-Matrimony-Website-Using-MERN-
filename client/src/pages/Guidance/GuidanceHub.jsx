import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, HandHelping, Scale, Gift, ShieldCheck, HeartHandshake, Mail, Sparkles } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../contexts/LanguageContext';
import { guidanceArticles } from '../../data/guidanceArticles';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ICONS = { HeartHandshake, Scale, HandHelping, Gift, ShieldCheck, BookOpen };

const GuidanceHub = () => {
    const { t, lang } = useLanguage();
    const isBn = lang === 'bn';

    return (
        <>
            <Helmet><title>Islamic Guidance - Nikah</title></Helmet>
            <div className="min-h-screen bg-muted/30 pt-20 pb-12">
                <div className="container-custom">
                    {/* Hero */}
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <p className="font-arabic text-2xl text-emerald-700 dark:text-emerald-400 mb-2" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-4">
                            <BookOpen className="h-3.5 w-3.5" /> {isBn ? 'ইসলামিক গাইডেন্স' : 'Islamic Guidance'}
                        </span>
                        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
                            {isBn ? 'বিবাহের ইসলামী পথ' : 'The Islamic Path to Marriage'}
                        </h1>
                        <p className="text-muted-foreground">
                            {isBn
                                ? 'কুরআন ও সুন্নাহর আলোকে প্রমাণিত পথনির্দেশ — যাতে আপনার যাত্রা হালাল ও বরকতময় হয়।'
                                : 'Authentic guidance from the Qur\'an and Sunnah — so your journey is halal and blessed.'}
                        </p>
                    </div>

                    {/* Article cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                        {guidanceArticles.map((article) => {
                            const Icon = ICONS[article.icon] || BookOpen;
                            return (
                                <Link key={article.slug} to={`/guidance/${article.slug}`} className="block group">
                                    <Card className="card-lift h-full hover:border-emerald-500/40 transition-colors">
                                        <CardContent className="p-6 flex flex-col h-full">
                                            <span className="grid place-items-center h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
                                                <Icon className="h-5 w-5" />
                                            </span>
                                            <h3 className="font-heading font-bold text-foreground mb-1.5">{isBn ? article.titleBn : article.titleEn}</h3>
                                            <p className="text-sm text-muted-foreground flex-1">{isBn ? article.excerptBn : article.excerptEn}</p>
                                            <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 mt-4 group-hover:gap-2 transition-all">
                                                {isBn ? 'পড়ুন' : 'Read'} <ArrowRight className="h-4 w-4" />
                                            </span>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Ask an Imam CTA */}
                    <Card className="overflow-hidden border-emerald-500/20">
                        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-5 justify-between bg-emerald-500/[0.04]">
                            <div className="flex items-center gap-4">
                                <span className="grid place-items-center h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0"><Sparkles className="h-6 w-6" /></span>
                                <div>
                                    <h3 className="font-heading font-bold text-foreground">{isBn ? 'প্রশ্ন আছে? একজন ইমামকে জিজ্ঞাসা করুন' : 'Have a question? Ask an Imam'}</h3>
                                    <p className="text-sm text-muted-foreground">{isBn ? 'বিবাহ সংক্রান্ত ইসলামী প্রশ্নে দিকনির্দেশনার জন্য আমাদের সাথে যোগাযোগ করুন।' : 'Reach out for guidance on marriage-related Islamic questions.'}</p>
                                </div>
                            </div>
                            <Button asChild variant="outline" className="border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 shrink-0">
                                <Link to="/contact"><Mail className="h-4 w-4" /> {isBn ? 'যোগাযোগ করুন' : 'Contact'}</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default GuidanceHub;
