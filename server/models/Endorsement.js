const mongoose = require('mongoose');

const endorsementSchema = new mongoose.Schema({
    endorserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    endorserEmail: {
        type: String,
        required: true
    },
    endorserName: {
        type: String,
        default: ''
    },
    endorserRole: {
        type: String,
        enum: ['user', 'imam', 'admin'],
        default: 'user'
    },
    // snapshot of the endorser's trust at submission (used in weight calculation)
    endorserTrustAtSubmit: {
        type: Number,
        default: 0
    },
    endorsedBiodataId: {
        type: Number,
        required: true
    },
    endorsedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    endorsedName: {
        type: String,
        default: ''
    },
    categories: {
        type: [String],
        enum: ['honest', 'prays_regularly', 'good_character', 'good_family', 'knowledgeable_deen'],
        default: []
    },
    weight: {
        type: Number,
        default: 1
    },
    note: {
        type: String,
        default: '',
        maxlength: 300
    },
    status: {
        type: String,
        enum: ['active', 'revoked'],
        default: 'active'
    }
}, {
    timestamps: true
});

// one active endorsement per endorser per target
endorsementSchema.index({ endorserId: 1, endorsedBiodataId: 1, status: 1 });
endorsementSchema.index({ endorsedBiodataId: 1, status: 1 });

module.exports = mongoose.model('Endorsement', endorsementSchema);
