const mongoose = require('mongoose');

// Consent-based link between a guardian (a User with role 'guardian') and a ward.
// The ward approves via a single-use magic link, mirroring the wali flow.
const guardianLinkSchema = new mongoose.Schema({
    guardianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    guardianEmail: { type: String, required: true },
    guardianName: { type: String, default: '' },
    wardBiodataId: { type: Number, default: null },
    wardUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    wardEmail: { type: String, required: true },
    relation: { type: String, enum: ['Father', 'Mother', 'Brother', 'Uncle', 'Grandfather', 'Son', 'Other'], default: '' },
    status: { type: String, enum: ['pending', 'approved', 'revoked'], default: 'pending' },
    inviteToken: { type: String, default: '' },
    permissions: {
        browse: { type: Boolean, default: true },
        shortlist: { type: Boolean, default: true },
        viewRequests: { type: Boolean, default: true },
        familyChat: { type: Boolean, default: true }
    },
    invitedAt: { type: Date, default: Date.now },
    decidedAt: { type: Date, default: null }
}, {
    timestamps: true
});

guardianLinkSchema.index({ guardianEmail: 1, wardEmail: 1 }, { unique: true });
guardianLinkSchema.index({ wardBiodataId: 1, status: 1 });
guardianLinkSchema.index({ guardianId: 1, status: 1 });

module.exports = mongoose.model('GuardianLink', guardianLinkSchema);
