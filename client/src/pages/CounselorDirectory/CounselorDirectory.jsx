import { HeartHandshake } from 'lucide-react';
import ProviderDirectory from '../../components/shared/ProviderDirectory';

const CounselorDirectory = () => (
    <ProviderDirectory
        serviceType="counselor"
        title="Premarital Counselors"
        subtitle="Islamic counselors who prepare couples for marriage. Book a session through your marriage journey."
        Icon={HeartHandshake}
    />
);

export default CounselorDirectory;
