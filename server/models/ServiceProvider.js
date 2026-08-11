const mongoose = require('mongoose');

// Shared directory model for imams, kazis and counselors.
// Imams are also Users (role:'imam') with userId linked; kazis/counselors are
// admin-created directory entries without a member account.
const serviceProviderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    serviceType: {
        type: String,
        enum: ['imam', 'kazi', 'counselor'],
        required: true
    },
    title: { type: String, default: '' },
    organization: { type: String, default: '' },
    city: { type: String, default: '' },
    area: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    photoURL: { type: String, default: '' },
    bio: { type: String, default: '' },
    specialties: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    yearsExperience: { type: Number, default: 0 },
    fee: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    partnerSince: { type: Date, default: null }
}, {
    timestamps: true
});

serviceProviderSchema.index({ serviceType: 1, city: 1, active: 1 });
serviceProviderSchema.index({ serviceType: 1, verified: 1 });

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);
