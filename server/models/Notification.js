const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['contact_request', 'contact_approved', 'premium_approved', 'new_message', 'profile_viewed', 'system', 'wali_pending', 'wali_decision', 'wali_consent', 'guardian_link_request', 'guardian_link_decided', 'endorsement_received', 'family_message', 'journey_stage', 'booking_update', 'mahr_confirmed', 'sukoon_reveal_request', 'sukoon_reveal_decision', 'course_completed'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    relatedId: {
        type: String,
        default: null
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
