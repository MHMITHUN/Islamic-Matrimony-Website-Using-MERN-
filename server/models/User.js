const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    photoURL: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
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

module.exports = mongoose.model('User', userSchema);
