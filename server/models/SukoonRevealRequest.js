const mongoose = require('mongoose');

// Stricter-than-normal identity reveal gate for Sukoon (second-marriage) profiles.
const sukoonRevealRequestSchema = new mongoose.Schema({
    requesterBiodataId: { type: Number, required: true },
    requesterEmail: { type: String, default: '' },
    targetBiodataId: { type: Number, required: true },
    targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    message: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    decidedAt: { type: Date, default: null }
}, {
    timestamps: true
});

sukoonRevealRequestSchema.index({ requesterBiodataId: 1, targetBiodataId: 1 }, { unique: true });
sukoonRevealRequestSchema.index({ targetUserId: 1, status: 1 });

module.exports = mongoose.model('SukoonRevealRequest', sukoonRevealRequestSchema);
