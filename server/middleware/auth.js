const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // Get fresh user data from database or auto-create if missing
            let user = await User.findOne({ email: decoded.email });
            if (!user && decoded.email) {
                user = await User.create({
                    name: decoded.name || decoded.email.split('@')[0],
                    email: decoded.email,
                    role: 'user',
                    isPremium: false
                });
            }

            if (user) {
                req.user.role = user.role;
                req.user.isPremium = user.isPremium;
                req.user._id = user._id;
                req.user.name = user.name || decoded.name;
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const verifyAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.user.email });

        // Admin access is determined SOLELY by the ADMIN_EMAILS env variable
        const adminEmails = (process.env.ADMIN_EMAILS || '')
            .split(',')
            .map(e => e.trim().toLowerCase())
            .filter(Boolean);
        const isEnvAdmin = adminEmails.includes(req.user.email.toLowerCase());

        if (!isEnvAdmin) {
            // Downgrade any user whose role is 'admin' but is no longer in ADMIN_EMAILS
            if (user && user.role === 'admin') {
                user.role = 'user';
                await user.save();
            }
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        // Sync database role if env says admin but DB doesn't
        if (user && user.role !== 'admin') {
            user.role = 'admin';
            user.isPremium = true;
            await user.save();
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const verifyPremium = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.user.email });

        if (!user || !user.isPremium) {
            return res.status(403).json({ message: 'Premium membership required.' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { verifyToken, verifyAdmin, verifyPremium };
