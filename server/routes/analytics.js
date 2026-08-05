const express = require('express');
const router = express.Router();
const Biodata = require('../models/Biodata');
const User = require('../models/User');
const ContactRequest = require('../models/ContactRequest');
const SuccessStory = require('../models/SuccessStory');

// Get overall statistics
router.get('/stats', async (req, res) => {
    try {
        const [
            totalUsers,
            totalBiodatas,
            totalPremiumUsers,
            totalContactRequests,
            totalSuccessStories,
            maleCount,
            femaleCount
        ] = await Promise.all([
            User.countDocuments(),
            Biodata.countDocuments(),
            User.countDocuments({ isPremium: true }),
            ContactRequest.countDocuments(),
            SuccessStory.countDocuments(),
            Biodata.countDocuments({ biodataType: 'Male' }),
            Biodata.countDocuments({ biodataType: 'Female' })
        ]);

        // Calculate success rate (marriages / total contact requests * 100)
        const successRate = totalContactRequests > 0
            ? ((totalSuccessStories / totalContactRequests) * 100).toFixed(1)
            : 0;

        res.json({
            totalUsers,
            totalBiodatas,
            totalPremiumUsers,
            totalContactRequests,
            totalSuccessStories,
            maleCount,
            femaleCount,
            successRate: parseFloat(successRate)
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Error fetching statistics' });
    }
});

// Get user growth data (last 6 months)
router.get('/user-growth', async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const users = await User.find({
            createdAt: { $gte: sixMonthsAgo }
        }).select('createdAt isPremium');

        // Group by month
        const monthlyData = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        users.forEach(user => {
            const month = months[user.createdAt.getMonth()];
            const year = user.createdAt.getFullYear().toString();
            const key = `${month} ${year}`;

            if (!monthlyData[key]) {
                monthlyData[key] = { month: key, total: 0, premium: 0 };
            }
            monthlyData[key].total++;
            if (user.isPremium) {
                monthlyData[key].premium++;
            }
        });

        const growth = Object.values(monthlyData).slice(-6);
        res.json(growth);
    } catch (error) {
        console.error('Error fetching user growth:', error);
        res.status(500).json({ message: 'Error fetching user growth data' });
    }
});

// Get division/location distribution
router.get('/location-stats', async (req, res) => {
    try {
        const locationData = await Biodata.aggregate([
            {
                $group: {
                    _id: '$permanentDivision',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    name: '$_id',
                    value: '$count',
                    _id: 0
                }
            },
            { $sort: { value: -1 } }
        ]);

        res.json(locationData);
    } catch (error) {
        console.error('Error fetching location stats:', error);
        res.status(500).json({ message: 'Error fetching location statistics' });
    }
});

// Get age distribution
router.get('/age-distribution', async (req, res) => {
    try {
        const biodatas = await Biodata.find().select('age');

        const ageGroups = {
            '18-25': 0,
            '26-30': 0,
            '31-35': 0,
            '36-40': 0,
            '40+': 0
        };

        biodatas.forEach(biodata => {
            const age = biodata.age;
            if (age <= 25) ageGroups['18-25']++;
            else if (age <= 30) ageGroups['26-30']++;
            else if (age <= 35) ageGroups['31-35']++;
            else if (age <= 40) ageGroups['36-40']++;
            else ageGroups['40+']++;
        });

        const distribution = Object.entries(ageGroups).map(([name, value]) => ({
            name,
            value
        }));

        res.json(distribution);
    } catch (error) {
        console.error('Error fetching age distribution:', error);
        res.status(500).json({ message: 'Error fetching age distribution' });
    }
});

// Get recent activity
router.get('/recent-activity', async (req, res) => {
    try {
        const [recentUsers, recentBiodatas, recentRequests] = await Promise.all([
            User.find().sort({ createdAt: -1 }).limit(5).select('email displayName createdAt'),
            Biodata.find().sort({ createdAt: -1 }).limit(5).select('name biodataType createdAt'),
            ContactRequest.find().sort({ createdAt: -1 }).limit(5).populate('biodataId', 'name').select('createdAt status')
        ]);

        const activity = [
            ...recentUsers.map(u => ({
                type: 'user',
                message: `New user registered: ${u.displayName || u.email}`,
                time: u.createdAt
            })),
            ...recentBiodatas.map(b => ({
                type: 'biodata',
                message: `New ${b.biodataType} biodata created: ${b.name}`,
                time: b.createdAt
            })),
            ...recentRequests.map(r => ({
                type: 'request',
                message: `Contact request ${r.status} for ${r.biodataId?.name || 'profile'}`,
                time: r.createdAt
            }))
        ].sort((a, b) => b.time - a.time).slice(0, 10);

        res.json(activity);
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        res.status(500).json({ message: 'Error fetching recent activity' });
    }
});

module.exports = router;
