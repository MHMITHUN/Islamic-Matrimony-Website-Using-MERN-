const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    photoURL: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'guardian', 'imam'],
        default: 'user'
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    premiumRequestStatus: {
        type: String,
        enum: ['none', 'pending', 'approved'],
        default: 'none'
    },
    // --- Tazkiya trust (F2) — cached, mirrored onto Biodata for directory sort ---
    trustScore: {
        type: Number,
        default: 0
    },
    tazkiyaTier: {
        type: String,
        enum: ['none', 'bronze', 'silver', 'gold'],
        default: 'none'
    },
    // --- Guardian profile (F1) ---
    guardianProfile: {
        relation: { type: String, enum: ['Father', 'Mother', 'Brother', 'Uncle', 'Grandfather', 'Son', 'Other'], default: '' },
        phone: { type: String, default: '' },
        whatsapp: { type: String, default: '' }
    },
    // --- Imam profile (F2) — paired with a ServiceProvider(serviceType:'imam') ---
    imamProfile: {
        title: { type: String, default: '' },
        organization: { type: String, default: '' },
        city: { type: String, default: '' },
        licenseNo: { type: String, default: '' },
        bio: { type: String, default: '' },
        verified: { type: Boolean, default: false },
        verifiedAt: { type: Date, default: null }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
