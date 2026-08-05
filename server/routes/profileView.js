const express = require('express');
const router = express.Router();
const ProfileView = require('../models/ProfileView');
const Biodata = require('../models/Biodata');
const Notification = require('../models/Notification');
const { verifyToken } = require('../middleware/auth');

// Record a profile view
router.post('/', verifyToken, async (req, res) => {
    try {
        const { viewedBiodataId } = req.body;

        if (!viewedBiodataId) {
            return res.status(400).json({ message: 'viewedBiodataId is required' });
        }

        const viewedBiodata = await Biodata.findOne({ biodataId: parseInt(viewedBiodataId) });
        if (!viewedBiodata) {
            return res.status(404).json({ message: 'Biodata not found' });
        }

        // Don't record self-views
        if (viewedBiodata.userEmail === req.user.email) {
            return res.json({ message: 'Self view not recorded' });
        }

        // Check for recent view (within last hour) to avoid spam
        const recentView = await ProfileView.findOne({
            viewerEmail: req.user.email,
            viewedBiodataId: parseInt(viewedBiodataId),
            createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
        });

        if (!recentView) {
            const view = new ProfileView({
                viewerId: req.user._id,
                viewerEmail: req.user.email,
                viewedBiodataId: parseInt(viewedBiodataId),
                viewedUserId: viewedBiodata.userId,
                viewedUserEmail: viewedBiodata.userEmail
            });
            await view.save();

            // Create notification for the viewed user
            await Notification.create({
                userId: viewedBiodata.userId,
                type: 'profile_viewed',
                title: 'Profile Viewed',
                message: `Someone viewed your profile (Biodata #${viewedBiodataId})`,
                relatedId: viewedBiodataId.toString()
            });
        }

        res.json({ message: 'View recorded' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get who viewed my profile
router.get('/my-views', verifyToken, async (req, res) => {
    try {
        const views = await ProfileView.find({ viewedUserEmail: req.user.email })
            .sort({ createdAt: -1 })
            .limit(50);

        // Enrich with viewer biodata info
        const enrichedViews = await Promise.all(
            views.map(async (view) => {
                const viewerBiodata = await Biodata.findOne({ userEmail: view.viewerEmail })
                    .select('biodataId name profileImage biodataType occupation permanentDivision age');
                return {
                    ...view.toObject(),
                    viewer: viewerBiodata
                };
            })
        );

        const totalViews = await ProfileView.countDocuments({ viewedUserEmail: req.user.email });
        const uniqueViewers = await ProfileView.distinct('viewerEmail', { viewedUserEmail: req.user.email });

        res.json({
            views: enrichedViews,
            totalViews,
            uniqueViewers: uniqueViewers.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
