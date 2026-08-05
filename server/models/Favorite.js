const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    biodataId: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate favorites
favoriteSchema.index({ userId: 1, biodataId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
