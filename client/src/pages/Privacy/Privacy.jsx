import { Helmet } from 'react-helmet-async';
import { FaShieldAlt, FaLock, FaUserShield, FaDatabase, FaCookie, FaEnvelope } from 'react-icons/fa';

const Privacy = () => {
    const sections = [
        {
            icon: <FaDatabase />,
            title: 'Information We Collect',
            content: [
                'Personal information you provide when creating your profile (name, email, age, location)',
                'Profile pictures and biographical information',
                'Communication preferences and contact information',
                'Payment information for premium services (processed securely)',
                'Usage data and analytics to improve our services'
            ]
        },
        {
            icon: <FaLock />,
            title: 'How We Use Your Information',
            content: [
                'To create and maintain your profile on our platform',
                'To facilitate matchmaking and connections with other users',
                'To process payments for premium memberships',
                'To send important updates about our services',
                'To improve our platform and user experience',
                'To ensure compliance with Islamic principles in matchmaking'
            ]
        },
        {
            icon: <FaUserShield />,
            title: 'Data Protection',
            content: [
                'We use industry-standard encryption to protect your data',
                'Your personal information is never sold to third parties',
                'We implement strict access controls and security measures',
                'Regular security audits and updates to our systems',
                'Compliance with data protection regulations'
            ]
        },
        {
            icon: <FaCookie />,
            title: 'Cookies and Tracking',
            content: [
                'We use essential cookies to maintain your session',
                'Analytics cookies help us understand user behavior',
                'You can control cookie preferences in your browser',
                'Third-party services may use cookies for payment processing'
            ]
        },
        {
            icon: <FaShieldAlt />,
            title: 'Your Rights',
            content: [
                'Access and download your personal data at any time',
                'Request correction of inaccurate information',
                'Delete your account and associated data',
                'Opt-out of marketing communications',
                'Control your privacy settings and visibility'
            ]
        },
        {
            icon: <FaEnvelope />,
            title: 'Contact Us',
            content: [
                'If you have questions about our privacy practices, contact us at:',
                'Email: privacy@nikahmatrimony.com',
                'Phone: +880 1700-000000',
                'Address: House 123, Road 45, Gulshan-2, Dhaka 1212, Bangladesh'
            ]
        }
    ];

    return (
        <>
            <Helmet>
                <title>Privacy Policy - Nikah Islamic Matrimony</title>
                <meta name="description" content="Learn how Nikah Matrimony protects your privacy and handles your personal information securely." />
            </Helmet>

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 pt-24">
                <div className="container-custom max-w-4xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                            Privacy Policy
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-sm">
                            At Nikah Matrimony, we are committed to protecting your privacy and ensuring your personal information is handled securely and responsibly.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                            Last Updated: December 6, 2025
                        </p>
                    </div>

                    <div className="space-y-4">
                        {sections.map((section, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-emerald-600 text-white text-sm flex-shrink-0">
                                        {section.icon}
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                                        {section.title}
                                    </h2>
                                </div>
                                <ul className="space-y-2 ml-12">
                                    {section.content.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-300 text-sm">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <p className="text-gray-700 dark:text-gray-300 text-center text-sm">
                            <strong>Note:</strong> This privacy policy may be updated periodically. We will notify you of any significant changes via email or through our platform.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Privacy;
