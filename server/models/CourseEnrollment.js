const mongoose = require('mongoose');

const TOTAL_MODULES = 5;

const courseEnrollmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userEmail: { type: String, required: true },
    courseKey: { type: String, default: 'premarital_readiness' },
    journeyId: { type: mongoose.Schema.Types.ObjectId, ref: 'MarriageJourney', default: null },
    progress: { type: Number, default: 0 }, // 0-100
    completedModules: { type: [Number], default: [] },
    currentModule: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
    certificateIssued: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ['in_progress', 'completed'],
        default: 'in_progress'
    }
}, {
    timestamps: true
});

courseEnrollmentSchema.index({ userId: 1, courseKey: 1 }, { unique: true });

module.exports = mongoose.model('CourseEnrollment', courseEnrollmentSchema);
module.exports.TOTAL_MODULES = TOTAL_MODULES;
