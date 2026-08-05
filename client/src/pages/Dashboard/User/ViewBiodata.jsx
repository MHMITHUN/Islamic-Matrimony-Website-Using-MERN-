import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaUser, FaEdit, FaCrown, FaMapMarkerAlt, FaBriefcase, FaCalendar, FaRulerVertical, FaWeight, FaPhone, FaEnvelope, FaStar, FaCheckCircle, FaClock, FaHeart } from 'react-icons/fa';
import { biodataAPI } from '../../../api/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ViewBiodata = () => {
    const { isPremium } = useAuth();
    const { t } = useLanguage();
    const queryClient = useQueryClient();

    const { data: biodata, isLoading, error } = useQuery({
        queryKey: ['myBiodata'],
        queryFn: async () => { const response = await biodataAPI.getMyBiodata(); return response.data; }
    });

    const requestPremiumMutation = useMutation({
        mutationFn: () => biodataAPI.requestPremium(),
        onSuccess: () => { queryClient.invalidateQueries(['myBiodata']); toast.success(t('toast.premiumRequested')); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); }
    });

    const handleRequestPremium = async () => {
        const result = await Swal.fire({
            title: t('dashboard.viewBiodata.premiumRequestTitle'),
            text: t('dashboard.viewBiodata.premiumRequestText'),
            icon: 'question', showCancelButton: true, confirmButtonColor: '#10b981', cancelButtonColor: '#ef4444', confirmButtonText: t('dashboard.viewBiodata.premiumRequestConfirm')
        });
        if (result.isConfirmed) requestPremiumMutation.mutate();
    };

    if (isLoading) return <div className="flex flex-col items-center justify-center py-20"><div className="spinner-lg"></div><p className="mt-4 text-slate-500">{t('dashboard.viewBiodata.loading')}</p></div>;

    if (error || !biodata) return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-700 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6"><FaUser className="text-4xl text-slate-300 dark:text-slate-500" /></div>
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">{t('dashboard.viewBiodata.noBiodata')}</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{t('dashboard.viewBiodata.noBiodataDesc')}</p>
            <Link to="/dashboard/edit-biodata" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors text-sm"><FaEdit className="text-xs" /> {t('dashboard.viewBiodata.createBiodata')}</Link>
        </div>
    );

    const InfoItem = ({ icon, label, value, color = 'bg-emerald-600' }) => (
        <div className="group flex items-start gap-3 p-3.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors">
            <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center text-white flex-shrink-0 text-sm`}>{icon}</div>
            <div className="min-w-0 flex-1"><p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">{label}</p><p className="font-semibold text-slate-800 dark:text-slate-200 break-words mt-0.5">{value || t('dashboard.viewBiodata.na')}</p></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-600 text-sm font-medium mb-2"><FaStar className="text-xs" /><span>{t('dashboard.viewBiodata.badge')}</span></div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">{t('dashboard.viewBiodata.heading')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{t('dashboard.viewBiodata.subtitle')}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link to="/dashboard/edit-biodata" className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"><FaEdit /> {t('dashboard.viewBiodata.editBiodata')}</Link>
                    {!isPremium && biodata.premiumRequestStatus !== 'pending' && <button onClick={handleRequestPremium} disabled={requestPremiumMutation.isLoading} className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors text-sm disabled:opacity-50"><FaCrown className="text-xs" /> {t('dashboard.viewBiodata.requestPremium')}</button>}
                    {biodata.premiumRequestStatus === 'pending' && <span className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-100 text-amber-700 text-sm font-bold rounded-xl"><FaClock /> {t('dashboard.contactRequests.pending')} Approval</span>}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 p-6 md:p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
                </div>
                <div className="p-6 md:p-8">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><FaUser className="text-emerald-500" /> Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        <InfoItem icon={<FaCalendar />} label="Date of Birth" value={new Date(biodata.dateOfBirth).toLocaleDateString()} />
                        <InfoItem icon={<FaUser />} label="Age" value={`${biodata.age} years`} />
                        <InfoItem icon={<FaRulerVertical />} label="Height" value={biodata.height} />
                        <InfoItem icon={<FaWeight />} label="Weight" value={biodata.weight} />
                        <InfoItem icon={<FaBriefcase />} label="Occupation" value={biodata.occupation} />
                        <InfoItem icon={<FaUser />} label="Skin Color" value={biodata.race} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><FaHeart className="text-pink-500" /> Family Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        <InfoItem icon={<FaUser />} label="Father's Name" value={biodata.fathersName} color="bg-pink-600" />
                        <InfoItem icon={<FaUser />} label="Mother's Name" value={biodata.mothersName} color="bg-pink-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><FaMapMarkerAlt className="text-blue-500" /> Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        <InfoItem icon={<FaMapMarkerAlt />} label="Permanent Division" value={biodata.permanentDivision} color="bg-blue-600" />
                        <InfoItem icon={<FaMapMarkerAlt />} label="Present Division" value={biodata.presentDivision} color="bg-blue-600" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewBiodata;
