import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FaRing, FaStar, FaImage, FaHeart, FaCalendar, FaIdCard, FaUser } from 'react-icons/fa';
import { successStoryAPI, biodataAPI } from '../../../api/api';
import { useLanguage } from '../../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const GotMarried = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const [formData, setFormData] = useState({ selfBiodataId: '', partnerBiodataId: '', coupleImage: '', marriageDate: '', reviewStar: 5, successStoryText: '' });

    const { data: myBiodata } = useQuery({
        queryKey: ['myBiodata'],
        queryFn: async () => { const response = await biodataAPI.getMyBiodata(); return response.data; },
        onSuccess: (data) => { if (data?.biodataId) setFormData(prev => ({ ...prev, selfBiodataId: data.biodataId })); }
    });

    const submitMutation = useMutation({
        mutationFn: (data) => successStoryAPI.create(data),
        onSuccess: () => { toast.success(t('toast.storySubmitted')); navigate('/dashboard/view-biodata'); },
        onError: (error) => { toast.error(error.response?.data?.message || t('toast.genericError')); }
    });

    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.selfBiodataId || !formData.partnerBiodataId || !formData.coupleImage || !formData.marriageDate || !formData.successStoryText) { toast.error(t('toast.fillAllFieldsSimple')); return; }
        submitMutation.mutate({ ...formData, selfBiodataId: parseInt(formData.selfBiodataId), partnerBiodataId: parseInt(formData.partnerBiodataId), reviewStar: parseInt(formData.reviewStar) });
    };

    return (
        <div className="space-y-6">
            <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 rounded-full text-pink-600 text-sm font-medium mb-2"><FaStar className="text-xs" /><span>{t('dashboard.gotMarried.badge')}</span></div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3"><FaRing className="text-amber-500" /> {t('dashboard.gotMarried.heading')}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{t('dashboard.gotMarried.subtitle')}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 p-6 relative overflow-hidden">
                    <div className="relative flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"><FaHeart className="text-white text-2xl" /></div>
                        <div><h2 className="text-xl font-bold text-white">{t('dashboard.gotMarried.shareStory')}</h2><p className="text-white/70">{t('dashboard.gotMarried.inspireOthers')}</p></div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"><FaIdCard className="text-emerald-500" />{t('dashboard.gotMarried.selfBiodataId')} <span className="text-red-500">*</span></label><input type="number" name="selfBiodataId" value={formData.selfBiodataId} readOnly={!!myBiodata?.biodataId} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-100 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 cursor-not-allowed outline-none" placeholder={t('dashboard.gotMarried.selfBiodataPlaceholder')} required /></div>
                        <div><label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"><FaUser className="text-pink-500" />{t('dashboard.gotMarried.partnerBiodataId')} <span className="text-red-500">*</span></label><input type="number" name="partnerBiodataId" value={formData.partnerBiodataId} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl outline-none transition-all duration-300 focus:border-pink-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-lg focus:shadow-pink-500/10 placeholder:text-slate-400 dark:text-slate-200" placeholder={t('dashboard.gotMarried.partnerBiodataPlaceholder')} required /></div>
                    </div>
                    <div><label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"><FaImage className="text-purple-500" />{t('dashboard.gotMarried.coupleImage')} <span className="text-red-500">*</span></label><input type="url" name="coupleImage" value={formData.coupleImage} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl outline-none transition-all duration-300 focus:border-pink-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-lg focus:shadow-pink-500/10 placeholder:text-slate-400 dark:text-slate-200" placeholder={t('dashboard.gotMarried.coupleImagePlaceholder')} required /></div>
                    <div><label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"><FaCalendar className="text-amber-500" />{t('dashboard.gotMarried.marriageDate')} <span className="text-red-500">*</span></label><input type="date" name="marriageDate" value={formData.marriageDate} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl outline-none transition-all duration-300 focus:border-pink-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-lg focus:shadow-pink-500/10 dark:text-slate-200" required /></div>
                    <div><label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3"><FaStar className="text-amber-400" />{t('dashboard.gotMarried.rating')} <span className="text-red-500">*</span></label><div className="flex gap-2 p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 rounded-2xl border border-amber-100 dark:border-amber-900/30">{[1,2,3,4,5].map((star) => (<button key={star} type="button" onClick={() => setFormData(prev => ({ ...prev, reviewStar: star }))} className="p-2 transition-all hover:scale-125"><FaStar className={`text-3xl transition-colors ${star <= formData.reviewStar ? 'text-amber-400 drop-shadow-md' : 'text-slate-200'}`} /></button>))}<span className="ml-auto text-amber-700 font-semibold self-center">{formData.reviewStar}/5</span></div></div>
                    <div><label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"><FaHeart className="text-pink-500" />{t('dashboard.gotMarried.storyText')} <span className="text-red-500">*</span></label><textarea name="successStoryText" value={formData.successStoryText} onChange={handleChange} rows={6} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl outline-none transition-all duration-300 focus:border-pink-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-lg focus:shadow-pink-500/10 placeholder:text-slate-400 dark:text-slate-200 resize-none" placeholder={t('dashboard.gotMarried.storyTextPlaceholder')} required></textarea></div>
                    <button type="submit" disabled={submitMutation.isLoading} className="w-full py-3 px-5 rounded-lg transition-colors bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {submitMutation.isLoading ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>{t('dashboard.gotMarried.submitting')}</>) : (<><FaHeart /> {t('dashboard.gotMarried.submit')}</>)}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GotMarried;
