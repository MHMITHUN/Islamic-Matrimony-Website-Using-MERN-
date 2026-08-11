const mongoose = require('mongoose');

const mahrAgreementSchema = new mongoose.Schema({
    journeyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MarriageJourney',
        required: true,
        unique: true
    },
    biodataA: { type: Number, required: true },
    biodataB: { type: Number, required: true },
    amount: { type: String, default: '' },
    amountType: {
        type: String,
        enum: ['fixed', 'mahr_e_mithl', 'deferred', 'to_discuss'],
        default: 'to_discuss'
    },
    currency: { type: String, default: 'BDT' },
    description: { type: String, default: '' },
    confirmations: {
        partyA: { confirmed: { type: Boolean, default: false }, confirmedAt: { type: Date, default: null } },
        partyB: { confirmed: { type: Boolean, default: false }, confirmedAt: { type: Date, default: null } }
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'agreed', 'documented'],
        default: 'draft'
    },
    witnessName: { type: String, default: '' },
    witnessContact: { type: String, default: '' }
}, {
    timestamps: true
});

module.exports = mongoose.model('MahrAgreement', mahrAgreementSchema);
