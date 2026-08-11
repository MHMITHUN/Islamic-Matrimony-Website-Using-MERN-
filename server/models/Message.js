const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderEmail: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverEmail: {
        type: String,
        required: true
    },
    receiverName: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    biodataId: {
        type: Number,
        default: null
    },
    familyThreadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FamilyThread',
        default: null
    },
    isTemplateMessage: {
        type: Boolean,
        default: false
    },
    waliCC: {
        type: Boolean,
        default: false
    },
    waliCcEmail: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

messageSchema.index({ senderEmail: 1, createdAt: -1 });
messageSchema.index({ receiverEmail: 1, isRead: 1 });
messageSchema.index({ senderEmail: 1, receiverEmail: 1 });

module.exports = mongoose.model('Message', messageSchema);
