import { BookOpen } from 'lucide-react';
import ProviderDirectory from '../../components/shared/ProviderDirectory';
import { useLanguage } from '../../contexts/LanguageContext';

const KaziDirectory = () => {
    const { t } = useLanguage();
    return (
        <ProviderDirectory
            serviceType="kazi"
            title={t('fp.providers.kaziTitle')}
            subtitle={t('fp.providers.kaziSub')}
            Icon={BookOpen}
        />
    );
};

export default KaziDirectory;
