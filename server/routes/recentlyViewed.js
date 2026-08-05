const express = require('express');
const RecentlyViewed = require('../models/RecentlyViewed');
const Biodata = require('../models/Biodata');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get user's recently viewed
router.get('/', verifyToken, async (req, res) => {
    try {
        const history = await RecentlyViewed.find({ userEmail: req.user.email })
            .sort({ viewedAt: -1 })
            .limit(20);

        // Get biodata info for each item
        const historyWithBiodata = await Promise.all(
            history.map(async (item) => {
                const biodata = await Biodata.findOne({ biodataId: item.biodataId });
                if (!biodata) return null;
                return {
                    biodataId: item.biodataId,
                    name: biodata.name,
                    profileImage: biodata.profileImage,
                    biodataType: biodata.biodataType,
                    occupation: biodata.occupation,
                    age: biodata.age,
                    permanentDivision: biodata.permanentDivision,
                    viewedAt: item.viewedAt
                };
            })
        );

        // Filter out nulls in case a biodata was deleted
        res.json(historyWithBiodata.filter(item => item !== null));
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add to recently viewed
router.post('/', verifyToken, async (req, res) => {
    try {
        const { biodataId } = req.body;

        if (!biodataId) {
            return res.status(400).json({ message: 'biodataId is required' });
        }

        // Upsert the view record to update the viewedAt timestamp
        const view = await RecentlyViewed.findOneAndUpdate(
            { userEmail: req.user.email, biodataId: parseInt(biodataId) },
            { viewedAt: new Date() },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Keep only the most recent 20 items per user
        const viewsCount = await RecentlyViewed.countDocuments({ userEmail: req.user.email });
        if (viewsCount > 20) {
            const oldestViews = await RecentlyViewed.find({ userEmail: req.user.email })
                .sort({ viewedAt: 1 })
                .limit(viewsCount - 20);
            
            const idsToDelete = oldestViews.map(v => v._id);
            await RecentlyViewed.deleteMany({ _id: { $in: idsToDelete } });
        }

        res.status(200).json({ message: 'Added to recently viewed', view });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Remove one from recently viewed
router.delete('/:biodataId', verifyToken, async (req, res) => {
    try {
        await RecentlyViewed.findOneAndDelete({
            userEmail: req.user.email,
            biodataId: parseInt(req.params.biodataId)
        });

        res.json({ message: 'Removed from recently viewed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Clear all recently viewed
router.delete('/', verifyToken, async (req, res) => {
    try {
        await RecentlyViewed.deleteMany({ userEmail: req.user.email });
        res.json({ message: 'All recently viewed cleared' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
