const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    plan: {
        type: String,
        enum: ['basic', 'premium', 'gold'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String,
        default: ''
    },
    paymentMethod: {
        type: String,
        enum: ['stripe', 'bkash', 'nagad', 'rocket', 'manual'],
        default: 'stripe'
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'cancelled', 'pending'],
        default: 'active'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    features: [{
        type: String
    }]
}, {
    timestamps: true
});

subscriptionSchema.index({ userEmail: 1, status: 1 });
subscriptionSchema.index({ endDate: 1, status: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
