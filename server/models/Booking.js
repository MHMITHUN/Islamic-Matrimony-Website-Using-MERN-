const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    journeyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MarriageJourney',
        required: true
    },
    serviceType: {
        type: String,
        enum: ['kazi', 'counselor'],
        required: true
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceProvider',
        required: true
    },
    providerName: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userEmail: { type: String, required: true },
    requestedDate: { type: Date, default: null },
    requestedTime: { type: String, default: '' },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentId: { type: String, default: '' },
    amount: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    confirmedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null }
}, {
    timestamps: true
});

bookingSchema.index({ journeyId: 1, serviceType: 1 });
bookingSchema.index({ providerId: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
