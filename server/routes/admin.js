const express = require('express');
const User = require('../models/User');
const Biodata = require('../models/Biodata');
const ContactRequest = require('../models/ContactRequest');
const SuccessStory = require('../models/SuccessStory');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all users with search
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { search = '' } = req.query;

        const query = search
            ? { name: { $regex: search, $options: 'i' } }
            : {};

        const users = await User.find(query)
            .select('-__v')
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Make user admin
router.patch('/users/:id/make-admin', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = 'admin';
        await user.save();

        res.json({ message: 'User is now an admin', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Make user premium
router.patch('/users/:id/make-premium', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isPremium = true;
        user.premiumRequestStatus = 'approved';
        await user.save();

        // Also update biodata premium status
        await Biodata.findOneAndUpdate(
            { userEmail: user.email },
            { isPremium: true, premiumRequestStatus: 'approved' }
        );

        res.json({ message: 'User is now premium', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Remove user premium
router.patch('/users/:id/remove-premium', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isPremium = false;
        user.premiumRequestStatus = null;
        await user.save();

        // Also update biodata premium status
        await Biodata.findOneAndUpdate(
            { userEmail: user.email },
            { isPremium: false, premiumRequestStatus: null }
        );

        res.json({ message: 'User premium removed', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get approved premium members (history)
router.get('/approved-premium-history', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const approvedPremium = await Biodata.find({
            isPremium: true,
            premiumRequestStatus: 'approved'
        })
            .select('biodataId name userEmail age occupation permanentDivision createdAt updatedAt')
            .sort({ updatedAt: -1 });

        res.json(approvedPremium);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get premium requests
router.get('/premium-requests', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const biodatas = await Biodata.find({ premiumRequestStatus: 'pending' })
            .select('biodataId name userEmail');

        res.json(biodatas);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Approve premium request
router.patch('/approve-premium/:biodataId', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const biodata = await Biodata.findOne({ biodataId: parseInt(req.params.biodataId) });

        if (!biodata) {
            return res.status(404).json({ message: 'Biodata not found' });
        }

        biodata.isPremium = true;
        biodata.premiumRequestStatus = 'approved';
        await biodata.save();

        // Also update user premium status
        await User.findOneAndUpdate(
            { email: biodata.userEmail },
            { isPremium: true, premiumRequestStatus: 'approved' }
        );

        res.json({ message: 'Premium status approved', biodata });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all contact requests
router.get('/contact-requests', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const requests = await ContactRequest.find()
            .populate('requesterId', 'name email')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Approve contact request
router.patch('/approve-contact/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const request = await ContactRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Contact request not found' });
        }

        request.status = 'approved';
        await request.save();

        res.json({ message: 'Contact request approved', request });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all success stories for admin
router.get('/success-stories', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const stories = await SuccessStory.find()
            .sort({ createdAt: -1 });

        res.json(stories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
