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
        }
        return Promise.reject(error);
    }
);

export default api;

export const authAPI = {
    getToken: (userData) => api.post('/auth/jwt', userData),
    getCurrentUser: () => api.get('/auth/me'),
    checkAdmin: (email) => api.get(`/auth/admin/${email}`),
    checkPremium: (email) => api.get(`/auth/premium/${email}`)
};

export const biodataAPI = {
    getAll: (params) => api.get('/biodata', { params }),
    getPremium: (params) => api.get('/biodata/premium', { params }),
    getById: (id) => api.get(`/biodata/${id}`),
    getSimilar: (id) => api.get(`/biodata/${id}/similar`),
    getMyBiodata: () => api.get('/biodata/user/me'),
    createOrUpdate: (data) => api.post('/biodata', data),
    requestPremium: () => api.post('/biodata/request-premium')
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
    makePremium: (id) => api.patch(`/admin/users/${id}/make-premium`),
    removePremium: (id) => api.patch(`/admin/users/${id}/remove-premium`),
    getPremiumRequests: () => api.get('/admin/premium-requests'),
    getApprovedPremiumHistory: () => api.get('/admin/approved-premium-history'),
    approvePremium: (biodataId) => api.patch(`/admin/approve-premium/${biodataId}`),
    getContactRequests: () => api.get('/admin/contact-requests'),
    approveContact: (id) => api.patch(`/admin/approve-contact/${id}`),
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
    delete: (id) => api.delete(`/messages/${id}`)
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
