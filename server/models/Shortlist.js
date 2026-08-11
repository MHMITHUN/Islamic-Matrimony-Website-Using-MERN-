const mongoose = require('mongoose');

// Guardian shortlist on behalf of a ward. Clone of Favorite, scoped by guardian + ward.
const shortlistSchema = new mongoose.Schema({
    guardianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    guardianEmail: { type: String, required: true },
    wardBiodataId: { type: Number, required: true },
    biodataId: { type: Number, required: true },
    note: { type: String, default: '' },
    tag: { type: String, enum: ['considering', 'shortlisted', 'rejected'], default: 'shortlisted' }
}, {
    timestamps: true
});

shortlistSchema.index({ guardianId: 1, wardBiodataId: 1, biodataId: 1 }, { unique: true });

module.exports = mongoose.model('Shortlist', shortlistSchema);
