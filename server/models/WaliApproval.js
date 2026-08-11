const mongoose = require('mongoose');

const waliApprovalSchema = new mongoose.Schema({
    contactRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContactRequest',
        required: true
    },
    biodataId: {
        type: Number,
        required: true
    },
    waliEmail: {
        type: String,
        required: true
    },
    requesterName: {
        type: String,
        required: true
    },
    requesterBiodataId: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'expired'],
        default: 'pending'
    },
    decisionToken: {
        type: String,
        required: true,
        unique: true
    },
    decidedAt: {
        type: Date,
        default: null
    },
    waliNote: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

waliApprovalSchema.index({ contactRequestId: 1 });

module.exports = mongoose.model('WaliApproval', waliApprovalSchema);
