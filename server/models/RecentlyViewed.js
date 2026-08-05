const mongoose = require('mongoose');

const recentlyViewedSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    biodataId: {
        type: Number,
        required: true
    },
    viewedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create a compound index for fast queries and upserts
recentlyViewedSchema.index({ userEmail: 1, biodataId: 1 }, { unique: true });
// Index for sorting by viewedAt
recentlyViewedSchema.index({ userEmail: 1, viewedAt: -1 });

module.exports = mongoose.model('RecentlyViewed', recentlyViewedSchema);
