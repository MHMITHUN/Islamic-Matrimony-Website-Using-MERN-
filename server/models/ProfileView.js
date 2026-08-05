const mongoose = require('mongoose');

const profileViewSchema = new mongoose.Schema({
    viewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    viewerEmail: {
        type: String,
        required: true
    },
    viewedBiodataId: {
        type: Number,
        required: true
    },
    viewedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    viewedUserEmail: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

profileViewSchema.index({ viewedUserEmail: 1, createdAt: -1 });
profileViewSchema.index({ viewerEmail: 1, viewedBiodataId: 1 });

module.exports = mongoose.model('ProfileView', profileViewSchema);
