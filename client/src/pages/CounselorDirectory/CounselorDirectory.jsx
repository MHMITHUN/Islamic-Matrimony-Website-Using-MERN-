import { HeartHandshake } from 'lucide-react';
import ProviderDirectory from '../../components/shared/ProviderDirectory';
import { useLanguage } from '../../contexts/LanguageContext';

const CounselorDirectory = () => {
    const { t } = useLanguage();
    return (
        <ProviderDirectory
            serviceType="counselor"
            title={t('fp.providers.counselorTitle')}
            subtitle={t('fp.providers.counselorSub')}
            Icon={HeartHandshake}
        />
    );
};

export default CounselorDirectory;
