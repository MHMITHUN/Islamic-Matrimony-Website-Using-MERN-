import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, HandHelping, Scale, Gift, ShieldCheck, HeartHandshake, ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../contexts/LanguageContext';
import { getArticleBySlug } from '../../data/guidanceArticles';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ICONS = { HeartHandshake, Scale, HandHelping, Gift, ShieldCheck, BookOpen };

const GuidanceArticle = () => {
    const { slug } = useParams();
    const { lang } = useLanguage();
    const isBn = lang === 'bn';
    const article = getArticleBySlug(slug);

    if (!article) {
        return (
            <div className="min-h-[70vh] grid place-items-center bg-muted/30 pt-20 px-4">
                <Card className="max-w-md text-center"><CardContent className="pt-10 flex flex-col items-center">
                    <div className="grid place-items-center h-16 w-16 rounded-full bg-muted text-muted-foreground mb-4"><BookOpen className="h-7 w-7" /></div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Article not found</h2>
                    <Button asChild><Link to="/guidance"><ArrowLeft className="h-4 w-4" /> All Guidance</Link></Button>
                </CardContent></Card>
            </div>
        );
    }

    const Icon = ICONS[article.icon] || BookOpen;
    const paragraphs = isBn ? article.contentBn : article.contentEn;

    return (
        <>
            <Helmet><title>{(isBn ? article.titleBn : article.titleEn)} - Nikah Guidance</title></Helmet>
            <div className="min-h-screen bg-muted/30 pt-20 pb-12">
                <div className="container-custom max-w-3xl">
                    <Button asChild variant="ghost" size="sm" className="mb-5 -ml-2 text-muted-foreground hover:text-foreground">
                        <Link to="/guidance"><ArrowLeft className="h-4 w-4" /> {isBn ? 'সব গাইডেন্স' : 'All Guidance'}</Link>
                    </Button>

                    <Card className="overflow-hidden">
                        <div className="h-2 bg-gradient-brand" />
                        <CardContent className="p-6 md:p-10">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="grid place-items-center h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><Icon className="h-6 w-6" /></span>
                                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{isBn ? article.titleBn : article.titleEn}</h1>
                            </div>

                            <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">
                                {paragraphs.map((p, i) => (
                                    <p key={i} className="text-foreground/90 leading-relaxed">{p}</p>
                                ))}
                            </div>

                            {article.references?.length > 0 && (
                                <div className="mt-8 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4">
                                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> {isBn ? 'তথ্যসূত্র' : 'References'}</p>
                                    <ul className="space-y-1">
                                        {article.references.map((ref, i) => (
                                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><ExternalLink className="h-3 w-3 mt-1 shrink-0 text-emerald-500/60" /> {ref}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default GuidanceArticle;
