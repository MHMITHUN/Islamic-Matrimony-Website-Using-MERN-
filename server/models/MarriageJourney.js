const mongoose = require('mongoose');

const STAGES = ['connected', 'supervised_intro', 'counseling', 'mahr_agreed', 'kazi_booked', 'nikah_registered'];

const journeySchema = new mongoose.Schema({
    contactRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContactRequest',
        required: true,
        unique: true
    },
    biodataA: { type: Number, required: true },
    biodataB: { type: Number, required: true },
    userA: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userB: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    guardianA: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    guardianB: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    currentStage: {
        type: String,
        enum: STAGES,
        default: 'connected'
    },
    stageHistory: [{
        stage: String,
        enteredAt: Date,
        note: String
    }],
    counseling: {
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
        completedAt: { type: Date, default: null },
        certificateIssued: { type: Boolean, default: false }
    },
    mahr: {
        agreementId: { type: mongoose.Schema.Types.ObjectId, ref: 'MahrAgreement', default: null }
    },
    kazi: {
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
        providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider', default: null }
    },
    readinessCourse: {
        startedAt: { type: Date, default: null },
        completedAt: { type: Date, default: null },
        certificateIssued: { type: Boolean, default: false }
    },
    nikahDate: { type: Date, default: null },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    }
}, {
    timestamps: true
});

journeySchema.index({ userA: 1, status: 1 });
journeySchema.index({ userB: 1, status: 1 });
journeySchema.index({ biodataA: 1, biodataB: 1 });

module.exports = mongoose.model('MarriageJourney', journeySchema);
module.exports.STAGES = STAGES;
