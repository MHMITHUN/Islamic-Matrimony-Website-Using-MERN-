const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    biodataId: {
        type: Number,
        required: true
    },
    matchedBiodataId: {
        type: Number,
        required: true
    },
    compatibilityScore: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    matchDetails: {
        ageMatch: { type: Boolean, default: false },
        heightMatch: { type: Boolean, default: false },
        divisionMatch: { type: Boolean, default: false },
        occupationMatch: { type: Boolean, default: false },
        deenMatch: { type: Boolean, default: false }
    },
    status: {
        type: String,
        enum: ['suggested', 'viewed', 'interested', 'rejected'],
        default: 'suggested'
    }
}, {
    timestamps: true
});

matchSchema.index({ userEmail: 1, compatibilityScore: -1 });
matchSchema.index({ biodataId: 1, matchedBiodataId: 1 }, { unique: true });

module.exports = mongoose.model('Match', matchSchema);
