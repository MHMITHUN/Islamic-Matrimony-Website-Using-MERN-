const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reporterEmail: {
        type: String,
        required: true
    },
    biodataId: {
        type: Number,
        required: true
    },
    biodataUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reason: {
        type: String,
        enum: ['fake_profile', 'inappropriate_content', 'harassment', 'spam', 'other'],
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

reportSchema.index({ reporterId: 1, biodataId: 1 }, { unique: true });

module.exports = mongoose.model('Report', reportSchema);
