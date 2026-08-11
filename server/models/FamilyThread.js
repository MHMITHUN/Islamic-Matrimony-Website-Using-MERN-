const mongoose = require('mongoose');

// Family-to-family channel between the guardians of two connected biodatas.
// Messages themselves are stored in the Message model with familyThreadId set.
const familyThreadSchema = new mongoose.Schema({
    biodataA: { type: Number, required: true },
    biodataB: { type: Number, required: true },
    guardianA: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    guardianB: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    contactRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'ContactRequest', default: null },
    lastMessageAt: { type: Date, default: null },
    status: { type: String, enum: ['active', 'closed'], default: 'active' }
}, {
    timestamps: true
});

familyThreadSchema.index({ biodataA: 1, biodataB: 1 }, { unique: true });

module.exports = mongoose.model('FamilyThread', familyThreadSchema);
