const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Admin credentials from environment
const getAdminEmail = () => (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const getAdminPassword = () => process.env.ADMIN_PASSWORD || '';

// Create or update user and get JWT token (for regular Firebase users)
router.post('/jwt', async (req, res) => {
    try {
        const { email, name, photoURL } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Regular users never get admin role through this endpoint
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                email,
                name: name || 'Anonymous',
                photoURL: photoURL || '',
                role: 'user',
                isPremium: false
            });
            await user.save();
        } else {
            // Downgrade any stale admin role for non-admin users
            if (user.role === 'admin') {
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

// Admin login with email + password (env-based, no Firebase required)
router.post('/admin-login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const adminEmail = getAdminEmail();
        const adminPassword = getAdminPassword();

        if (!adminEmail || !adminPassword) {
            return res.status(503).json({ message: 'Admin login is not configured on the server.' });
        }

        // Verify admin credentials
        if (email.trim().toLowerCase() !== adminEmail) {
            return res.status(401).json({ message: 'Invalid admin credentials.' });
        }

        const isMatch = await bcrypt.compare(password, adminPassword);
        // Also allow plain-text comparison as fallback (for env without hash)
        const isMatchPlain = password === adminPassword;

        if (!isMatch && !isMatchPlain) {
            return res.status(401).json({ message: 'Invalid admin credentials.' });
        }

        // Find or create admin user in database
        let user = await User.findOne({ email: adminEmail });

        if (!user) {
            user = new User({
                name: 'Admin',
                email: adminEmail,
                photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
                role: 'admin',
                isPremium: true,
                premiumRequestStatus: 'approved'
            });
            await user.save();
        } else if (user.role !== 'admin') {
            user.role = 'admin';
            user.isPremium = true;
            await user.save();
        }

        // Generate admin JWT token
        const token = jwt.sign(
            {
                email: user.email,
                name: user.name,
                role: 'admin',
                isPremium: true,
                adminLogin: true
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
                role: 'admin',
                isPremium: true
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
            premiumRequestStatus: user.premiumRequestStatus,
            trustScore: user.trustScore || 0,
            tazkiyaTier: user.tazkiyaTier || 'none',
            guardianProfile: user.guardianProfile || null,
            imamProfile: user.imamProfile || null
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Self-select guardian or imam role (for a dedicated non-member Firebase account).
// Cannot be used to gain 'admin'. Reuses the existing JWT auth machinery.
router.patch('/role', verifyToken, async (req, res) => {
    try {
        const { role, guardianProfile, imamProfile } = req.body;
        if (!['guardian', 'imam'].includes(role)) {
            return res.status(400).json({ message: 'Only guardian or imam self-registration is allowed.' });
        }
        const user = await User.findOne({ email: req.user.email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Prevent a member account from silently switching into guardian/imam of itself
        // (a guardian/imam is expected to be a separate account). If the user already owns
        // a biodata, block the switch to keep ownership clean.
        const Biodata = require('../models/Biodata');
        const ownsBiodata = await Biodata.exists({ userEmail: user.email });
        if (ownsBiodata) {
            return res.status(400).json({ message: 'This account already owns a biodata. Register a separate account to act as a guardian or imam.' });
        }

        user.role = role;
        if (role === 'guardian' && guardianProfile) {
            user.guardianProfile = { ...user.guardianProfile.toObject?.() ?? {}, ...guardianProfile };
        }
        if (role === 'imam' && imamProfile) {
            user.imamProfile = { ...user.imamProfile.toObject?.() ?? {}, ...imamProfile };
        }
        await user.save();

        res.json({
            message: `Role updated to ${role}`,
            user: { _id: user._id, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Admin: promote a user to guardian
router.patch('/make-guardian/:id', verifyToken, require('../middleware/auth').verifyAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.role = 'guardian';
        if (req.body.guardianProfile) {
            user.guardianProfile = { ...user.guardianProfile.toObject?.() ?? {}, ...req.body.guardianProfile };
        }
        await user.save();
        res.json({ message: 'User is now a guardian', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Admin: promote a user to imam
router.patch('/make-imam/:id', verifyToken, require('../middleware/auth').verifyAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.role = 'imam';
        if (req.body.imamProfile) {
            user.imamProfile = { ...user.imamProfile.toObject?.() ?? {}, ...req.body.imamProfile };
        }
        await user.save();
        res.json({ message: 'User is now an imam', user });
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

        // Admin status is determined by ADMIN_EMAIL env variable
        const adminEmail = getAdminEmail();
        const isAdmin = email.trim().toLowerCase() === adminEmail;

        // Sync DB role
        const user = await User.findOne({ email });
        if (user) {
            if (isAdmin && user.role !== 'admin') {
                user.role = 'admin';
                user.isPremium = true;
                await user.save();
            } else if (!isAdmin && user.role === 'admin') {
                user.role = 'user';
                await user.save();
            }
        }

        res.json({ isAdmin });
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
