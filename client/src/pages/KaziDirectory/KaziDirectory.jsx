import { BookOpen } from 'lucide-react';
import ProviderDirectory from '../../components/shared/ProviderDirectory';

const KaziDirectory = () => (
    <ProviderDirectory
        serviceType="kazi"
        title="Kazi Directory"
        subtitle="Licensed officiants who conduct and register the nikah. Book one through your marriage journey."
        Icon={BookOpen}
    />
);

export default KaziDirectory;
