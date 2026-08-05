import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '@/lib/utils';

const LanguageToggle = ({ className = '' }) => {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      className={cn(
        'inline-flex items-center gap-1 rounded-lg bg-muted/60 px-2 py-1.5 text-xs font-semibold hover:bg-muted transition-colors',
        className
      )}
      aria-label={lang === 'en' ? 'Switch to Bangla' : 'ইংরেজিতে স্যুইচ করুন'}
      title={lang === 'en' ? 'Switch to Bangla' : 'ইংরেজিতে স্যুইচ করুন'}
    >
      <span className={lang === 'en' ? 'text-primary' : 'text-muted-foreground'}>EN</span>
      <span className="text-muted-foreground/40">/</span>
      <span className={lang === 'bn' ? 'text-primary' : 'text-muted-foreground'}>বাংলা</span>
    </button>
  );
};

export default LanguageToggle;
