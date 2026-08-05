const express = require('express');
const Biodata = require('../models/Biodata');
const ContactRequest = require('../models/ContactRequest');
const SuccessStory = require('../models/SuccessStory');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Get public stats for homepage
router.get('/public', async (req, res) => {
    try {
        const totalBiodata = await Biodata.countDocuments();
        const maleBiodata = await Biodata.countDocuments({ biodataType: 'Male' });
        const femaleBiodata = await Biodata.countDocuments({ biodataType: 'Female' });
        const marriagesCompleted = await SuccessStory.countDocuments();

        res.json({
            totalBiodata,
            maleBiodata,
            femaleBiodata,
            marriagesCompleted
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get admin dashboard stats
router.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const totalBiodata = await Biodata.countDocuments();
        const maleBiodata = await Biodata.countDocuments({ biodataType: 'Male' });
        const femaleBiodata = await Biodata.countDocuments({ biodataType: 'Female' });
        const premiumBiodata = await Biodata.countDocuments({ isPremium: true });

        // Calculate total revenue (each contact request is $5)
        const totalContactRequests = await ContactRequest.countDocuments();
        const totalRevenue = totalContactRequests * 5;

        res.json({
            totalBiodata,
            maleBiodata,
            femaleBiodata,
            premiumBiodata,
            totalRevenue,
            totalContactRequests
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
