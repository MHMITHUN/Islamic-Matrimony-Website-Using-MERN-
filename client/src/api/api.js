import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        const lang = localStorage.getItem('nikah-lang');
        if (lang) {
            config.headers['Accept-Language'] = lang;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access-token');
            window.dispatchEvent(new CustomEvent('unauthorized'));
        }
        return Promise.reject(error);
    }
);

export default api;

export const authAPI = {
    getToken: (userData) => api.post('/auth/jwt', userData),
    adminLogin: (credentials) => api.post('/auth/admin-login', credentials),
    getCurrentUser: () => api.get('/auth/me'),
    checkAdmin: (email) => api.get(`/auth/admin/${email}`),
    checkPremium: (email) => api.get(`/auth/premium/${email}`),
    setRole: (data) => api.patch('/auth/role', data)
};

export const biodataAPI = {
    getAll: (params) => api.get('/biodata', { params }),
    getPremium: (params) => api.get('/biodata/premium', { params }),
    getById: (id) => api.get(`/biodata/${id}`),
    getSimilar: (id) => api.get(`/biodata/${id}/similar`),
    getMyBiodata: () => api.get('/biodata/user/me'),
    createOrUpdate: (data) => api.post('/biodata', data),
    requestPremium: () => api.post('/biodata/request-premium'),
    requestVerification: (data) => api.post('/biodata/request-verification', data)
};

export const contactRequestAPI = {
    getMyRequests: () => api.get('/contact-requests/my-requests'),
    create: (data) => api.post('/contact-requests', data),
    delete: (id) => api.delete(`/contact-requests/${id}`)
};

export const favoritesAPI = {
    getAll: () => api.get('/favorites'),
    add: (biodataId) => api.post('/favorites', { biodataId }),
    remove: (id) => api.delete(`/favorites/${id}`),
    check: (biodataId) => api.get(`/favorites/check/${biodataId}`)
};

export const successStoryAPI = {
    getAll: () => api.get('/success-stories'),
    create: (data) => api.post('/success-stories', data),
    getById: (id) => api.get(`/success-stories/${id}`)
};

export const adminAPI = {
    getUsers: (search) => api.get('/admin/users', { params: { search } }),
    makeAdmin: (id) => api.patch(`/admin/users/${id}/make-admin`),
    makeGuardian: (id, data) => api.patch(`/auth/make-guardian/${id}`, data),
    makeImam: (id, data) => api.patch(`/auth/make-imam/${id}`, data),
    updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
    makePremium: (id) => api.patch(`/admin/users/${id}/make-premium`),
    removePremium: (id) => api.patch(`/admin/users/${id}/remove-premium`),
    getPremiumRequests: () => api.get('/admin/premium-requests'),
    getApprovedPremiumHistory: () => api.get('/admin/approved-premium-history'),
    approvePremium: (biodataId) => api.patch(`/admin/approve-premium/${biodataId}`),
    getContactRequests: () => api.get('/admin/contact-requests'),
    approveContact: (id) => api.patch(`/admin/approve-contact/${id}`),
    getVerificationRequests: () => api.get('/admin/verification-requests'),
    approveVerification: (biodataId) => api.patch(`/admin/approve-verification/${biodataId}`),
    rejectVerification: (biodataId) => api.patch(`/admin/reject-verification/${biodataId}`),
    getSukoonProfiles: () => api.get('/admin/sukoon-profiles'),
    getSuccessStories: () => api.get('/admin/success-stories')
};

export const statsAPI = {
    getPublic: () => api.get('/stats/public'),
    getAdmin: () => api.get('/stats/admin')
};

export const contactMessageAPI = {
    send: (data) => api.post('/contact-messages', data),
    getAll: () => api.get('/contact-messages'),
    delete: (id) => api.delete(`/contact-messages/${id}`)
};

export const analyticsAPI = {
    getStats: () => api.get('/analytics/stats'),
    getUserGrowth: () => api.get('/analytics/user-growth'),
    getLocationStats: () => api.get('/analytics/location-stats'),
    getAgeDistribution: () => api.get('/analytics/age-distribution'),
    getRecentActivity: () => api.get('/analytics/recent-activity')
};

export const paymentAPI = {
    createPaymentIntent: (amount) => api.post('/payment/create-payment-intent', { amount }),
    confirmPayment: (paymentId) => api.post('/payment/confirm-payment', { paymentId })
};

export const reportAPI = {
    create: (data) => api.post('/reports', data),
    check: (biodataId) => api.get(`/reports/check/${biodataId}`),
    getAll: () => api.get('/reports/admin'),
    updateStatus: (id, status) => api.patch(`/reports/admin/${id}`, { status })
};

export const notificationAPI = {
    getAll: (params) => api.get('/notifications', { params }),
    getUnreadCount: () => api.get('/notifications/unread-count'),
    markRead: (id) => api.patch(`/notifications/${id}/read`),
    markAllRead: () => api.patch('/notifications/read-all'),
    delete: (id) => api.delete(`/notifications/${id}`)
};

export const messageAPI = {
    getInbox: () => api.get('/messages/inbox'),
    getSent: () => api.get('/messages/sent'),
    getConversation: (email) => api.get(`/messages/conversation/${encodeURIComponent(email)}`),
    send: (data) => api.post('/messages', data),
    delete: (id) => api.delete(`/messages/${id}`),
    getTemplates: () => api.get('/messages/templates')
};

export const matchAPI = {
    getMatches: () => api.get('/matches'),
    getMatchWith: (biodataId) => api.get(`/matches/with/${biodataId}`)
};

export const profileViewAPI = {
    record: (viewedBiodataId) => api.post('/profile-views', { viewedBiodataId }),
    getMyViews: () => api.get('/profile-views/my-views')
};

export const subscriptionAPI = {
    getPlans: () => api.get('/subscriptions/plans'),
    getMySubscription: () => api.get('/subscriptions/my-subscription'),
    create: (data) => api.post('/subscriptions', data),
    getAll: () => api.get('/subscriptions/admin/all')
};

export const recentlyViewedAPI = {
    getAll: () => api.get('/recently-viewed'),
    add: (biodataId) => api.post('/recently-viewed', { biodataId }),
    remove: (biodataId) => api.delete(`/recently-viewed/${biodataId}`),
    clearAll: () => api.delete('/recently-viewed')
};

export const waliAPI = {
    getMyWaliInfo: () => api.get('/wali/my-info'),
    updateWaliInfo: (data) => api.post('/wali/my-info', data),
    getPendingForMe: () => api.get('/wali/pending'),
    resend: (contactRequestId) => api.post(`/wali/resend/${contactRequestId}`),
    getDecisionByToken: (token) => api.get(`/wali/request/${token}`),
    submitDecision: (token, data) => api.post(`/wali/decision/${token}`, data)
};

export const endorsementAPI = {
    canEndorse: (biodataId) => api.get(`/endorsements/can-endorse/${biodataId}`),
    create: (data) => api.post('/endorsements', data),
    getReceived: () => api.get('/endorsements/received'),
    getGiven: () => api.get('/endorsements/given'),
    getFor: (biodataId) => api.get(`/endorsements/for/${biodataId}`),
    revoke: (id) => api.delete(`/endorsements/${id}`)
};

export const providerAPI = {
    getAll: (params) => api.get('/providers', { params }),
    getById: (id) => api.get(`/providers/${id}`),
    apply: (data) => api.post('/providers/apply', data),
    create: (data) => api.post('/providers', data),
    update: (id, data) => api.put(`/providers/${id}`, data),
    verify: (id) => api.patch(`/providers/${id}/verify`),
    toggleActive: (id) => api.patch(`/providers/${id}/toggle-active`),
    delete: (id) => api.delete(`/providers/${id}`),
    attest: (biodataId, data) => api.post(`/providers/attest/${biodataId}`, data)
};

export const journeyAPI = {
    getMine: () => api.get('/journey/mine'),
    getById: (id) => api.get(`/journey/${id}`),
    advance: (id, data) => api.post(`/journey/advance/${id}`, data),
    getAdminAll: () => api.get('/journey/admin/all')
};

export const bookingAPI = {
    getMine: () => api.get('/bookings/mine'),
    create: (data) => api.post('/bookings', data),
    complete: (id) => api.patch(`/bookings/${id}/complete`),
    getAll: () => api.get('/bookings')
};

export const mahrAPI = {
    getByJourney: (journeyId) => api.get(`/mahr/by-journey/${journeyId}`),
    save: (data) => api.put('/mahr', data),
    confirm: (id) => api.post(`/mahr/${id}/confirm`)
};

export const courseAPI = {
    getProgress: () => api.get('/course/progress'),
    linkJourney: (journeyId) => api.post(`/course/link-journey/${journeyId}`),
    completeModule: (n) => api.post(`/course/module/${n}/complete`)
};

export const guardianAPI = {
    inviteWard: (data) => api.post('/guardian/wards/invite', data),
    getMyGuardians: () => api.get('/guardian/my-guardians'),
    getLinkByToken: (token) => api.get(`/guardian/link/${token}`),
    decideLink: (token, data) => api.post(`/guardian/link/${token}/decide`, data),
    getMyWards: () => api.get('/guardian/my-wards'),
    revokeWard: (id) => api.delete(`/guardian/wards/${id}`),
    browseWard: (wardBiodataId) => api.get(`/guardian/browse/${wardBiodataId}`),
    getShortlist: (wardBiodataId) => api.get(`/guardian/shortlist/${wardBiodataId}`),
    addShortlist: (data) => api.post('/guardian/shortlist', data),
    removeShortlist: (id) => api.delete(`/guardian/shortlist/${id}`),
    getWardRequests: (wardBiodataId) => api.get(`/guardian/requests/${wardBiodataId}`),
    getFamilyThreads: () => api.get('/guardian/family-threads'),
    getFamilyMessages: (threadId) => api.get(`/guardian/family-threads/${threadId}/messages`),
    sendFamilyMessage: (data) => api.post('/guardian/family-threads', data)
};

export const sukoonAPI = {
    getProfiles: (params) => api.get('/sukoon/profiles', { params }),
    requestReveal: (biodataId, data) => api.post(`/sukoon/reveal-request/${biodataId}`, data),
    decideReveal: (id, data) => api.post(`/sukoon/reveal-request/${id}/decide`, data),
    getRevealRequests: () => api.get('/sukoon/reveal-requests')
};
