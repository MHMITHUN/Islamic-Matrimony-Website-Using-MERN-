const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const Biodata = require('../models/Biodata');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Get subscription plans
router.get('/plans', (req, res) => {
    res.json([
        {
            id: 'basic',
            name: 'Basic',
            price: 0,
            duration: 'Free',
            features: ['Create biodata', 'Browse profiles', '3 contact requests/month']
        },
        {
            id: 'premium',
            name: 'Premium',
            price: 500,
            duration: '3 months',
            features: ['All Basic features', 'Unlimited contact requests', 'See contact info', 'Priority support', 'Profile highlighted']
        },
        {
            id: 'gold',
            name: 'Gold',
            price: 1000,
            duration: '6 months',
            features: ['All Premium features', 'Profile boost', 'Compatibility reports', 'Verified badge', 'Dedicated matchmaker']
        }
    ]);
});

// Get current user's subscription
router.get('/my-subscription', verifyToken, async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            userEmail: req.user.email,
            status: 'active',
            endDate: { $gte: new Date() }
        }).sort({ createdAt: -1 });

        res.json(subscription);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create subscription (after payment)
router.post('/', verifyToken, async (req, res) => {
    try {
        const { plan, paymentId, paymentMethod } = req.body;

        const planDetails = {
            basic: { amount: 0, duration: 0 },
            premium: { amount: 500, duration: 90 },
            gold: { amount: 1000, duration: 180 }
        };

        if (!planDetails[plan]) {
            return res.status(400).json({ message: 'Invalid plan' });
        }

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + planDetails[plan].duration);

        const subscription = new Subscription({
            userId: req.user._id,
            userEmail: req.user.email,
            plan,
            amount: planDetails[plan].amount,
            paymentId: paymentId || '',
            paymentMethod: paymentMethod || 'stripe',
            endDate,
            features: plan === 'premium' ? ['unlimited_contacts', 'see_contact_info', 'priority_support'] :
                plan === 'gold' ? ['unlimited_contacts', 'see_contact_info', 'priority_support', 'profile_boost', 'verified_badge'] : []
        });

        await subscription.save();

        // Update user and biodata
        if (plan !== 'basic') {
            await User.findOneAndUpdate({ email: req.user.email }, { isPremium: true, premiumRequestStatus: 'approved' });
            await Biodata.findOneAndUpdate({ userEmail: req.user.email }, { isPremium: true, premiumRequestStatus: 'approved' });
        }

        res.status(201).json({ message: 'Subscription created', data: subscription });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all subscriptions (admin)
router.get('/admin/all', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const subscriptions = await Subscription.find()
            .sort({ createdAt: -1 })
            .limit(100);

        const stats = {
            total: await Subscription.countDocuments(),
            active: await Subscription.countDocuments({ status: 'active', endDate: { $gte: new Date() } }),
            premium: await Subscription.countDocuments({ plan: 'premium' }),
            gold: await Subscription.countDocuments({ plan: 'gold' }),
            totalRevenue: await Subscription.aggregate([
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]).then(r => r[0]?.total || 0)
        };

        res.json({ subscriptions, stats });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
