import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaSave, FaUser, FaPhone, FaMapMarkerAlt, FaBriefcase, FaCalendar, FaHeart, FaStar, FaImage, FaRulerVertical, FaWeight, FaEnvelope } from 'react-icons/fa';
import { biodataAPI } from '../../../api/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const EditBiodata = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const queryClient = useQueryClient();

    const divisions = ['Dhaka', 'Chattagram', 'Rangpur', 'Barisal', 'Khulna', 'Mymensingh', 'Sylhet'];
    const occupations = ['Student', 'Job', 'Business', 'Housewife', 'Teacher', 'Doctor', 'Engineer', 'Other'];
    const races = ['Fair', 'Light Brown', 'Brown', 'Dark'];
    const heights = ['4\'5"', '4\'6"', '4\'7"', '4\'8"', '4\'9"', '4\'10"', '4\'11"', '5\'0"', '5\'1"', '5\'2"', '5\'3"', '5\'4"', '5\'5"', '5\'6"', '5\'7"', '5\'8"', '5\'9"', '5\'10"', '5\'11"', '6\'0"', '6\'1"', '6\'2"', '6\'3"', '6\'4"'];
    const weights = ['40-45 kg', '45-50 kg', '50-55 kg', '55-60 kg', '60-65 kg', '65-70 kg', '70-75 kg', '75-80 kg', '80-85 kg', '85-90 kg', '90+ kg'];

    const [formData, setFormData] = useState({ biodataType: '', name: '', profileImage: '', dateOfBirth: '', height: '', weight: '', age: '', occupation: '', race: '', fathersName: '', mothersName: '', permanentDivision: '', presentDivision: '', expectedPartnerAge: '', expectedPartnerHeight: '', expectedPartnerWeight: '', mobileNumber: '' });

    const { data: existingBiodata, isLoading } = useQuery({
        queryKey: ['myBiodata'],
        queryFn: async () => { try { const response = await biodataAPI.getMyBiodata(); return response.data; } catch (error) { if (error.response?.status === 404) return null; throw error; } }
    });

    useEffect(() => {
        if (existingBiodata) {
            setFormData({ biodataType: existingBiodata.biodataType || '', name: existingBiodata.name || '', profileImage: existingBiodata.profileImage || '', dateOfBirth: existingBiodata.dateOfBirth ? existingBiodata.dateOfBirth.split('T')[0] : '', height: existingBiodata.height || '', weight: existingBiodata.weight || '', age: existingBiodata.age || '', occupation: existingBiodata.occupation || '', race: existingBiodata.race || '', fathersName: existingBiodata.fathersName || '', mothersName: existingBiodata.mothersName || '', permanentDivision: existingBiodata.permanentDivision || '', presentDivision: existingBiodata.presentDivision || '', expectedPartnerAge: existingBiodata.expectedPartnerAge || '', expectedPartnerHeight: existingBiodata.expectedPartnerHeight || '', expectedPartnerWeight: existingBiodata.expectedPartnerWeight || '', mobileNumber: existingBiodata.mobileNumber || '' });
        }
    }, [existingBiodata]);

    const saveMutation = useMutation({
        mutationFn: (data) => biodataAPI.createOrUpdate(data),
        onSuccess: () => { queryClient.invalidateQueries(['myBiodata']); toast.success(existingBiodata ? t('toast.biodataUpdated') : t('toast.biodataCreated')); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.biodataFailed')); }
    });

    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };

    useEffect(() => {
        if (formData.dateOfBirth) { const today = new Date(); const birthDate = new Date(formData.dateOfBirth); let age = today.getFullYear() - birthDate.getFullYear(); const m = today.getMonth() - birthDate.getMonth(); if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--; setFormData(prev => ({ ...prev, age: age.toString() })); }
    }, [formData.dateOfBirth]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const requiredFields = ['biodataType', 'name', 'dateOfBirth', 'height', 'weight', 'occupation', 'race', 'fathersName', 'mothersName', 'permanentDivision', 'presentDivision', 'expectedPartnerAge', 'expectedPartnerHeight', 'expectedPartnerWeight', 'mobileNumber'];
        for (const field of requiredFields) { if (!formData[field]) { toast.error(t('toast.fillAllFields')); return; } }
        saveMutation.mutate(formData);
    };

    if (isLoading) return <div className="flex flex-col items-center justify-center py-20"><div className="spinner-lg"></div><p className="mt-3 text-gray-500 text-sm">{t('dashboard.editBiodata.loading')}</p></div>;

    const isEdit = !!existingBiodata;

    const inputClass = "w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-400 dark:text-white text-sm";
    const selectClass = "w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:text-white text-sm";

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{isEdit ? t('dashboard.editBiodata.heading') : t('dashboard.editBiodata.createHeading')}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{t('dashboard.editBiodata.subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 md:p-6">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><FaUser className="text-emerald-600 text-sm" />{t('dashboard.editBiodata.basicInfo')}</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('dashboard.editBiodata.biodataType')} *</label>
                            <div className="flex gap-3">
                                <label className="flex items-center gap-2 p-2.5 rounded-lg cursor-pointer border transition-colors flex-1 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 dark:has-[:checked]:bg-emerald-900/20 border-gray-300 dark:border-gray-600">
                                    <input type="radio" name="biodataType" value="Male" checked={formData.biodataType === 'Male'} onChange={handleChange} className="w-4 h-4 text-emerald-600" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('dashboard.editBiodata.male')}</span>
                                </label>
                                <label className="flex items-center gap-2 p-2.5 rounded-lg cursor-pointer border transition-colors flex-1 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 dark:has-[:checked]:bg-emerald-900/20 border-gray-300 dark:border-gray-600">
                                    <input type="radio" name="biodataType" value="Female" checked={formData.biodataType === 'Female'} onChange={handleChange} className="w-4 h-4 text-emerald-600" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('dashboard.editBiodata.female')}</span>
                                </label>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('dashboard.editBiodata.fullName')} *</label><input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={t('dashboard.editBiodata.namePlaceholder')} className={inputClass} required /></div>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('dashboard.editBiodata.profileImage')} *</label><input type="url" name="profileImage" value={formData.profileImage} onChange={handleChange} placeholder={t('dashboard.editBiodata.imagePlaceholder')} className={inputClass} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('dashboard.editBiodata.dateOfBirth')} *</label><input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputClass} required /></div>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('dashboard.editBiodata.height')} *</label><select name="height" value={formData.height} onChange={handleChange} className={selectClass} required><option value="">{t('dashboard.editBiodata.selectHeight')}</option>{heights.map(h => <option key={h} value={h}>{h}</option>)}</select></div>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('dashboard.editBiodata.weight')} *</label><select name="weight" value={formData.weight} onChange={handleChange} className={selectClass} required><option value="">{t('dashboard.editBiodata.selectWeight')}</option>{weights.map(w => <option key={w} value={w}>{w}</option>)}</select></div>
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('dashboard.editBiodata.ageAuto')}</label><input type="text" value={formData.age} readOnly className="w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg outline-none cursor-not-allowed text-gray-600 dark:text-gray-300 text-sm" /></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('dashboard.editBiodata.occupation')} *</label><select name="occupation" value={formData.occupation} onChange={handleChange} className={selectClass} required><option value="">{t('dashboard.editBiodata.selectOccupation')}</option>{occupations.map(occ => <option key={occ} value={occ}>{occ}</option>)}</select></div>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('dashboard.editBiodata.skinColor')} *</label><select name="race" value={formData.race} onChange={handleChange} className={selectClass} required><option value="">{t('dashboard.editBiodata.selectRace')}</option>{races.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 md:p-6">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><FaHeart className="text-pink-600 text-sm" />{t('dashboard.editBiodata.familyInfo')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('dashboard.editBiodata.fathersName')} *</label><input type="text" name="fathersName" value={formData.fathersName} onChange={handleChange} placeholder={t('dashboard.editBiodata.fatherPlaceholder')} className={inputClass} required /></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('dashboard.editBiodata.mothersName')} *</label><input type="text" name="mothersName" value={formData.mothersName} onChange={handleChange} placeholder={t('dashboard.editBiodata.motherPlaceholder')} className={inputClass} required /></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 md:p-6">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><FaMapMarkerAlt className="text-blue-600 text-sm" />{t('dashboard.editBiodata.location')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('dashboard.editBiodata.permanentDivision')} *</label><select name="permanentDivision" value={formData.permanentDivision} onChange={handleChange} className={selectClass} required><option value="">{t('dashboard.editBiodata.selectDivision')}</option>{divisions.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('dashboard.editBiodata.presentDivision')} *</label><select name="presentDivision" value={formData.presentDivision} onChange={handleChange} className={selectClass} required><option value="">{t('dashboard.editBiodata.selectDivision')}</option>{divisions.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 md:p-6">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><FaStar className="text-amber-600 text-sm" />{t('dashboard.editBiodata.expectedPartner')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('dashboard.editBiodata.expectedAge')} *</label><input type="text" name="expectedPartnerAge" value={formData.expectedPartnerAge} onChange={handleChange} placeholder={t('dashboard.editBiodata.expectedAgePlaceholder')} className={inputClass} required /></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('dashboard.editBiodata.expectedHeight')} *</label><select name="expectedPartnerHeight" value={formData.expectedPartnerHeight} onChange={handleChange} className={selectClass} required><option value="">{t('dashboard.editBiodata.selectHeight')}</option>{heights.map(h => <option key={h} value={h}>{h}</option>)}</select></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('dashboard.editBiodata.expectedWeight')} *</label><select name="expectedPartnerWeight" value={formData.expectedPartnerWeight} onChange={handleChange} className={selectClass} required><option value="">{t('dashboard.editBiodata.selectWeight')}</option>{weights.map(w => <option key={w} value={w}>{w}</option>)}</select></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 md:p-6">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><FaPhone className="text-purple-600 text-sm" />{t('dashboard.editBiodata.contactInfo')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('dashboard.editBiodata.contactEmail')}</label><input type="email" value={user?.email || ''} readOnly className="w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg outline-none cursor-not-allowed text-gray-600 dark:text-gray-300 text-sm" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('dashboard.editBiodata.mobileNumber')} *</label><input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder={t('dashboard.editBiodata.mobilePlaceholder')} className={inputClass} required /></div>
                    </div>
                </div>

                <button type="submit" disabled={saveMutation.isLoading} className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 text-sm">
                    <FaSave className="text-sm" />{saveMutation.isLoading ? t('dashboard.editBiodata.saving') : t('dashboard.editBiodata.save')}
                </button>
                <p className="text-center text-xs text-gray-400">{t('dashboard.editBiodata.required')}</p>
            </form>
        </div>
    );
};

export default EditBiodata;
