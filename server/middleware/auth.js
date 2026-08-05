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

            // Get fresh user data from database
            const user = await User.findOne({ email: decoded.email });
            if (user) {
                req.user.role = user.role;
                req.user.isPremium = user.isPremium;
                req.user._id = user._id;
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

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
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
