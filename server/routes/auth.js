const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Create or update user and get JWT token
router.post('/jwt', async (req, res) => {
    try {
        const { email, name, photoURL } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Security: Prevent registration with admin email
        const ADMIN_EMAIL = 'admin@islamicmatrimony.com';
        const isAdminEmail = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

        // Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            // Prevent anyone from registering with the admin email
            if (isAdminEmail) {
                return res.status(403).json({
                    message: 'This email is reserved. Please contact support if you are the administrator.'
                });
            }

            user = new User({
                email,
                name: name || 'Anonymous',
                photoURL: photoURL || '',
                role: 'user' // Explicitly set role to 'user' for new registrations
            });
            await user.save();
        } else {
            // Protect existing admin accounts from being modified
            if (user.role === 'admin') {
                // Admin account exists, only update if it's the same admin logging in
                // Don't allow role changes through this endpoint
                if (name && name !== user.name) user.name = name;
                if (photoURL && photoURL !== user.photoURL) user.photoURL = photoURL;
                await user.save();
            } else {
                // Update regular user info if provided
                if (name) user.name = name;
                if (photoURL) user.photoURL = photoURL;
                await user.save();
            }
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

        res.json({ isAdmin: user?.role === 'admin' });
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
