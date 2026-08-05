const mongoose = require('mongoose');

const contactRequestSchema = new mongoose.Schema({
    requesterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requesterEmail: {
        type: String,
        required: true
    },
    requesterName: {
        type: String,
        required: true
    },
    biodataId: {
        type: Number,
        required: true
    },
    biodataUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved'],
        default: 'pending'
    },
    paymentId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        default: 5
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ContactRequest', contactRequestSchema);
