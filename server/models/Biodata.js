const mongoose = require('mongoose');

const biodataSchema = new mongoose.Schema({
    biodataId: {
        type: Number,
        unique: true,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    biodataType: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    profileImage: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    height: {
        type: String,
        required: true
    },
    weight: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    occupation: {
        type: String,
        enum: ['Student', 'Job', 'Business', 'Housewife', 'Teacher', 'Doctor', 'Engineer', 'Other'],
        required: true
    },
    race: {
        type: String,
        enum: ['Fair', 'Light Brown', 'Brown', 'Dark'],
        required: true
    },
    fathersName: {
        type: String,
        required: true,
        trim: true
    },
    mothersName: {
        type: String,
        required: true,
        trim: true
    },
    permanentDivision: {
        type: String,
        enum: ['Dhaka', 'Chattagram', 'Rangpur', 'Barisal', 'Khulna', 'Mymensingh', 'Sylhet'],
        required: true
    },
    presentDivision: {
        type: String,
        enum: ['Dhaka', 'Chattagram', 'Rangpur', 'Barisal', 'Khulna', 'Mymensingh', 'Sylhet'],
        required: true
    },
    // --- Islamic / Deen Profile (all optional) ---
    maritalStatus: {
        type: String,
        enum: ['Never Married', 'Divorced', 'Widowed', 'Seeking Polygyny'],
        default: ''
    },
    sect: {
        type: String,
        enum: ['Sunni-Hanafi', "Sunni-Shafi'i", 'Sunni-Maliki', 'Sunni-Hanbali', 'Shia', 'Other'],
        default: ''
    },
    religiousCommitment: {
        type: String,
        enum: ['Practicing', 'Moderate', 'Cultural'],
        default: ''
    },
    prayerFrequency: {
        type: String,
        enum: ['Five Daily', 'Sometimes', 'Rarely'],
        default: ''
    },
    modesty: {
        // female: Hijab / Niqab / None ; male: Beard / No Beard — UI branches on biodataType
        type: String,
        default: ''
    },
    revert: {
        type: Boolean,
        default: false
    },
    religiousEducation: {
        type: String,
        enum: ['General', 'Madrasa', 'Hifz', 'Alim', 'Other'],
        default: ''
    },
    mahrPreference: {
        type: String,
        enum: ['Simple', 'Moderate', 'As per capability', 'To discuss'],
        default: ''
    },
    alcoholFree: {
        type: Boolean,
        default: true
    },
    smoking: {
        type: String,
        enum: ['No', 'Occasionally', 'Yes'],
        default: ''
    },
    diet: {
        type: String,
        enum: ['Halal only', 'Vegetarian', 'Other'],
        default: 'Halal only'
    },
    hasChildren: {
        type: Boolean,
        default: false
    },
    childrenCount: {
        type: Number,
        default: 0
    },
    childrenLivingWith: {
        type: String,
        enum: ['Yes', 'No', 'Shared'],
        default: ''
    },
    expectedPartnerAge: {
        type: String,
        required: true
    },
    expectedPartnerHeight: {
        type: String,
        required: true
    },
    expectedPartnerWeight: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    // --- Profile Verification (anti-fake-profile trust signal) ---
    verification: {
        status: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' },
        method: { type: String, enum: ['none', 'nid', 'imam_endorsement', 'community_leader'], default: 'none' },
        referenceName: { type: String, default: '' },
        referenceContact: { type: String, default: '' },
        submittedAt: { type: Date, default: null },
        verifiedAt: { type: Date, default: null }
    },
    // --- Wali / Guardian (Islamic marriage guardian oversight) ---
    waliEnabled: { type: Boolean, default: false },
    waliName: { type: String, default: '' },
    waliRelation: { type: String, enum: ['Father', 'Brother', 'Uncle', 'Grandfather', 'Son', 'Other'], default: '' },
    waliContact: { type: String, default: '' },
    waliEmail: { type: String, default: '' },
    waliConsent: { type: String, enum: ['none', 'pending', 'given', 'denied'], default: 'none' },
    isPremium: {
        type: Boolean,
        default: false
    },
    premiumRequestStatus: {
        type: String,
        enum: ['none', 'pending', 'approved'],
        default: 'none'
    }
}, {
    timestamps: true
});

// Create index for faster queries
biodataSchema.index({ biodataType: 1 });
biodataSchema.index({ permanentDivision: 1 });
biodataSchema.index({ age: 1 });

module.exports = mongoose.model('Biodata', biodataSchema);
