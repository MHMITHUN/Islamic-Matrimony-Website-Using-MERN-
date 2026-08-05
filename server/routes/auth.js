const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get admin emails from environment variable
const getAdminEmails = () => {
    const raw = process.env.ADMIN_EMAILS || '';
    return raw.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
};

// Create or update user and get JWT token
router.post('/jwt', async (req, res) => {
    try {
        const { email, name, photoURL } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const adminEmails = getAdminEmails();
        const isAdminEmail = adminEmails.includes(email.toLowerCase());

        // Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                email,
                name: name || 'Anonymous',
                photoURL: photoURL || '',
                role: isAdminEmail ? 'admin' : 'user',
                isPremium: isAdminEmail
            });
            await user.save();
        } else {
            // Sync admin role from env configuration
            if (isAdminEmail && user.role !== 'admin') {
                user.role = 'admin';
                user.isPremium = true;
            } else if (!isAdminEmail && user.role === 'admin') {
                user.role = 'user';
            }
            if (name && name !== user.name) user.name = name;
            if (photoURL && photoURL !== user.photoURL) user.photoURL = photoURL;
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                email: user.email,
                name: user.name,
                role: user.role,
                isPremium: user.isPremium
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                photoURL: user.photoURL,
                role: user.role,
                isPremium: user.isPremium
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get current user info
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            _id: user._id,
            email: user.email,
            name: user.name,
            photoURL: user.photoURL,
            role: user.role,
            isPremium: user.isPremium,
            premiumRequestStatus: user.premiumRequestStatus
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Check if user is admin
router.get('/admin/:email', verifyToken, async (req, res) => {
    try {
        const email = req.params.email;

        if (req.user.email !== email) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const user = await User.findOne({ email });

        // Admin status is determined by ADMIN_EMAILS env variable, not just DB role
        const adminEmails = getAdminEmails();
        const isEnvAdmin = adminEmails.includes(email.toLowerCase());

        // Sync DB role if out of sync with env
        if (user && isEnvAdmin && user.role !== 'admin') {
            user.role = 'admin';
            user.isPremium = true;
            await user.save();
        } else if (user && !isEnvAdmin && user.role === 'admin') {
            user.role = 'user';
            await user.save();
        }

        res.json({ isAdmin: isEnvAdmin });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Check if user is premium
router.get('/premium/:email', verifyToken, async (req, res) => {
    try {
        const email = req.params.email;

        if (req.user.email !== email) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const user = await User.findOne({ email });

        res.json({ isPremium: user?.isPremium || false });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
