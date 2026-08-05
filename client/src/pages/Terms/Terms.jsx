import { Helmet } from 'react-helmet-async';
import { FaFileContract, FaUserCheck, FaMoneyBillWave, FaBan, FaGavel, FaHandshake } from 'react-icons/fa';

const Terms = () => {
    const sections = [
        {
            icon: <FaUserCheck />,
            title: 'Account Registration',
            content: [
                'You must be at least 18 years old to use this service',
                'You must provide accurate and truthful information',
                'You are responsible for maintaining account security',
                'One person may only create one account',
                'Accounts are non-transferable'
            ]
        },
        {
            icon: <FaHandshake />,
            title: 'User Conduct',
            content: [
                'All interactions must adhere to Islamic principles and values',
                'Respectful communication is required at all times',
                'Harassment, abuse, or inappropriate behavior is strictly prohibited',
                'Users must have genuine intentions for marriage',
                'Misrepresentation of identity or information is not allowed'
            ]
        },
        {
            icon: <FaMoneyBillWave />,
            title: 'Premium Services & Payment',
            content: [
                'Premium memberships are subscription-based services',
                'Payments are processed securely through our payment partners',
                'Subscriptions automatically renew unless cancelled',
                'Refund requests are considered on a case-by-case basis',
                'Prices may change with 30 days notice to existing subscribers'
            ]
        },
        {
            icon: <FaBan />,
            title: 'Prohibited Activities',
            content: [
                'Creating fake profiles or providing false information',
                'Soliciting money or financial information from other users',
                'Sharing inappropriate content or images',
                'Using the platform for commercial or promotional purposes',
                'Attempting to hack, abuse, or manipulate the platform',
                'Violating any applicable laws or regulations'
            ]
        },
        {
            icon: <FaGavel />,
            title: 'Disclaimers & Limitations',
            content: [
                'We facilitate connections but do not guarantee marriage outcomes',
                'Users are responsible for their own decisions and interactions',
                'We are not liable for relationships formed through the platform',
                'We verify information to the best of our ability but cannot guarantee accuracy',
                'Service availability may be subject to technical limitations'
            ]
        },
        {
            icon: <FaFileContract />,
            title: 'Account Termination',
            content: [
                'We reserve the right to suspend or terminate accounts that violate these terms',
                'Users may delete their accounts at any time',
                'Upon termination, access to premium features will cease',
                'We may retain certain information as required by law',
                'Repeated violations may result in permanent ban'
            ]
        }
    ];

    return (
        <>
            <Helmet>
                <title>Terms of Service - Nikah Islamic Matrimony</title>
                <meta name="description" content="Read our Terms of Service to understand your rights and responsibilities when using Nikah Matrimony platform." />
            </Helmet>

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 pt-24">
                <div className="container-custom max-w-4xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                            Terms of Service
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-sm">
                            By using Nikah Matrimony, you agree to these terms and conditions. Please read them carefully before using our services.
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
                            <strong>Acceptance of Terms:</strong> By creating an account and using Nikah Matrimony, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                        </p>
                    </div>

                    <div className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                        <p>
                            Questions about our terms? Contact us at{' '}
                            <a href="mailto:legal@nikahmatrimony.com" className="text-emerald-600 font-semibold hover:underline">
                                legal@nikahmatrimony.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Terms;
