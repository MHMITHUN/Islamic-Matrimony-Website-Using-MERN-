import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { FaCreditCard, FaLock, FaCheckCircle, FaShieldAlt, FaArrowLeft, FaStar } from 'react-icons/fa';
import { paymentAPI, contactRequestAPI } from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { biodataId } = useParams();
    const { user } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [cardNumber, setCardNumber] = useState('');
    const [processing, setProcessing] = useState(false);

    const createRequest = useMutation({
        mutationFn: async (paymentId) => { return contactRequestAPI.create({ biodataId: parseInt(biodataId), paymentId }); },
        onSuccess: () => { toast.success(t('toast.contactRequested')); navigate('/dashboard/contact-requests'); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) { toast.error(t('toast.validCard')); return; }
        setProcessing(true);
        try {
            const paymentResponse = await paymentAPI.createPaymentIntent(500);
            const { paymentId } = paymentResponse.data;
            await paymentAPI.confirmPayment(paymentId);
            await createRequest.mutateAsync(paymentId);
        } catch (error) {
            toast.error(t('toast.paymentFailed'));
        } finally { setProcessing(false); }
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) parts.push(match.substring(i, i + 4));
        return parts.length ? parts.join(' ') : value;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 pt-28">
            <div className="container-custom max-w-xl">
                <Link to={`/biodata/${biodataId}`} className="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium text-sm mb-5 transition-colors"><FaArrowLeft className="text-xs" /> {t('checkout.backToProfile')}</Link>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-emerald-700 p-8 text-center">
                        <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center mx-auto mb-3"><FaCreditCard className="text-2xl text-white" /></div>
                        <h1 className="text-xl font-bold text-white mb-1">{t('checkout.heading')}</h1>
                        <p className="text-emerald-200 text-sm">{t('checkout.subtitle')}</p>
                    </div>
                    <div className="p-6 md:p-8">
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-5 mb-6 border border-gray-200 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-1.5"><FaStar className="text-amber-500 text-xs" />{t('checkout.orderSummary')}</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm"><span className="text-gray-600 dark:text-gray-300">{t('checkout.contactRequest')}</span><span className="font-semibold text-gray-900 dark:text-white">500.00</span></div>
                                <div className="flex items-center justify-between text-sm"><span className="text-gray-600 dark:text-gray-300">{t('checkout.biodataId')}</span><span className="font-semibold text-emerald-600">#{biodataId}</span></div>
                                <hr className="border-gray-200 dark:border-gray-700" />
                                <div className="flex items-center justify-between font-bold"><span className="text-gray-900 dark:text-white">{t('checkout.total')}</span><span className="text-emerald-600">500.00</span></div>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('checkout.biodataId')}</label><input type="text" value={`#${biodataId}`} readOnly className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 text-sm cursor-not-allowed" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('checkout.yourEmail')}</label><input type="email" value={user?.email || ''} readOnly className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 text-sm cursor-not-allowed" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('checkout.cardNumber')}</label>
                                <div className="relative"><input type="text" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19} className="w-full pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-400 dark:text-white text-sm" required /><FaCreditCard className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" /></div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-center gap-1"><FaShieldAlt className="text-emerald-600 text-[10px]" />{t('checkout.demoMode')}</p>
                            </div>
                            <button type="submit" disabled={processing} className="w-full py-2.5 px-4 rounded-lg transition-colors bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                {processing ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>{t('checkout.processing')}</>) : (<><FaLock className="text-xs" /> {t('checkout.payButton')}</>)}
                            </button>
                        </form>
                        <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0"><FaCheckCircle className="text-white text-sm" /></div>
                                <div><h4 className="font-semibold text-emerald-800 dark:text-emerald-400 text-sm mb-0.5">{t('checkout.securePayment')}</h4><p className="text-xs text-emerald-700 dark:text-emerald-300">{t('checkout.secureDesc')}</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
