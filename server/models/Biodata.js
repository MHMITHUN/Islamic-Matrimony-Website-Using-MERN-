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
