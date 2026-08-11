const express = require('express');
const ServiceProvider = require('../models/ServiceProvider');
const Endorsement = require('../models/Endorsement');
const Biodata = require('../models/Biodata');
const Notification = require('../models/Notification');
const { verifyToken, verifyAdmin, verifyImam } = require('../middleware/auth');
const { computeTrust, weightOf } = require('../lib/trust');

const router = express.Router();

// Public directory — filter by serviceType and optionally city
router.get('/', async (req, res) => {
    try {
        const { serviceType, city } = req.query;
        const query = { active: true };
        if (serviceType) query.serviceType = serviceType;
        if (city) query.city = city;
        const providers = await ServiceProvider.find(query).sort({ verified: -1, rating: -1 });
        res.json(providers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Single provider
router.get('/:id', async (req, res) => {
    try {
        const provider = await ServiceProvider.findById(req.params.id);
        if (!provider) return res.status(404).json({ message: 'Provider not found' });
        res.json(provider);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Admin: create a directory provider (kazi/counselor, or an imam entry)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const provider = await ServiceProvider.create(req.body);
        res.status(201).json({ message: 'Provider created', provider });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Admin: verify a provider
router.patch('/:id/verify', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const provider = await ServiceProvider.findByIdAndUpdate(
            req.params.id,
            { verified: true },
            { new: true }
        );
        if (!provider) return res.status(404).json({ message: 'Provider not found' });
        res.json({ message: 'Provider verified', provider });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Imam-only: attest a member's character/deen (posts a high-weight Endorsement)
router.post('/attest/:biodataId', verifyToken, verifyImam, async (req, res) => {
    try {
        const biodataId = Number(req.params.biodataId);
        const { categories, note } = req.body;
        const target = await Biodata.findOne({ biodataId });
        if (!target) return res.status(404).json({ message: 'Biodata not found' });

        const existing = await Endorsement.findOne({
            endorserId: req.user._id,
            endorsedBiodataId: biodataId,
            status: 'active'
        });
        if (existing) return res.status(400).json({ message: 'You have already attested this profile.' });

        const endorsement = await Endorsement.create({
            endorserId: req.user._id,
            endorserEmail: req.user.email,
            endorserName: req.user.name,
            endorserRole: 'imam',
            endorserTrustAtSubmit: 0,
            endorsedBiodataId: biodataId,
            endorsedUserId: target.userId,
            endorsedName: target.name,
            categories: Array.isArray(categories) ? categories : ['good_character'],
            weight: weightOf('imam', 0),
            note: note || 'Attested by a verified Imam.'
        });

        await computeTrust(biodataId);

        if (target.userId) {
            await Notification.create({
                userId: target.userId,
                type: 'endorsement_received',
                title: 'Imam attestation received',
                message: `An imam attested your character — a significant trust boost.`,
                relatedId: endorsement._id.toString()
            });
        }

        res.status(201).json({ message: 'Attestation recorded', endorsement });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
