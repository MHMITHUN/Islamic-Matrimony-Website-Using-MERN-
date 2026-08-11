const express = require('express');
const Endorsement = require('../models/Endorsement');
const Biodata = require('../models/Biodata');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { verifyToken } = require('../middleware/auth');
const { computeTrust, weightOf } = require('../lib/trust');

const router = express.Router();

// Can the current user endorse this biodata? (not self, not already endorsed)
router.get('/can-endorse/:biodataId', verifyToken, async (req, res) => {
    try {
        const biodataId = Number(req.params.biodataId);
        const myBiodata = await Biodata.findOne({ userEmail: req.user.email });
        const isSelf = myBiodata && myBiodata.biodataId === biodataId;
        const existing = await Endorsement.findOne({
            endorserId: req.user._id,
            endorsedBiodataId: biodataId,
            status: 'active'
        });
        res.json({ canEndorse: !isSelf && !existing, isSelf, alreadyEndorsed: !!existing });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create an endorsement
router.post('/', verifyToken, async (req, res) => {
    try {
        const { endorsedBiodataId, categories, note } = req.body;
        const numId = Number(endorsedBiodataId);
        if (!numId) return res.status(400).json({ message: 'endorsedBiodataId is required' });

        const target = await Biodata.findOne({ biodataId: numId });
        if (!target) return res.status(404).json({ message: 'Biodata not found' });

        // Can't endorse yourself
        if (target.userEmail === req.user.email) {
            return res.status(400).json({ message: 'You cannot endorse yourself.' });
        }

        // One active endorsement per endorser per target
        const existing = await Endorsement.findOne({
            endorserId: req.user._id,
            endorsedBiodataId: numId,
            status: 'active'
        });
        if (existing) return res.status(400).json({ message: 'You have already endorsed this profile.' });

        const endorser = await User.findById(req.user._id);
        const endorserRole = endorser?.role === 'imam' ? 'imam' : 'user';
        const endorserTrust = endorser?.trustScore || 0;

        const endorsement = await Endorsement.create({
            endorserId: req.user._id,
            endorserEmail: req.user.email,
            endorserName: endorser?.name || req.user.name,
            endorserRole,
            endorserTrustAtSubmit: endorserTrust,
            endorsedBiodataId: numId,
            endorsedUserId: target.userId,
            endorsedName: target.name,
            categories: Array.isArray(categories) ? categories : [],
            weight: weightOf(endorserRole, endorserTrust),
            note: note || ''
        });

        // Recompute target trust (caches on User + Biodata)
        await computeTrust(numId);

        // Notify the endorsed user
        if (target.userId) {
            await Notification.create({
                userId: target.userId,
                type: 'endorsement_received',
                title: 'New Tazkiya endorsement',
                message: `${endorser.name || 'Someone'} endorsed your character/deen.`,
                relatedId: endorsement._id.toString()
            });
        }

        res.status(201).json({ message: 'Endorsement added', endorsement });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Endorsements received by the current user's biodata
router.get('/received', verifyToken, async (req, res) => {
    try {
        const myBiodata = await Biodata.findOne({ userEmail: req.user.email });
        if (!myBiodata) return res.json([]);
        const list = await Endorsement.find({ endorsedBiodataId: myBiodata.biodataId, status: 'active' })
            .sort({ createdAt: -1 });
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Endorsements given by the current user (so they can revoke)
router.get('/given', verifyToken, async (req, res) => {
    try {
        const list = await Endorsement.find({ endorserId: req.user._id, status: 'active' })
            .sort({ createdAt: -1 });
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Public list of endorsements for a profile (shown on BiodataDetails)
router.get('/for/:biodataId', verifyToken, async (req, res) => {
    try {
        const biodataId = Number(req.params.biodataId);
        const list = await Endorsement.find({ endorsedBiodataId: biodataId, status: 'active' })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Revoke my endorsement + recompute target trust
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const endorsement = await Endorsement.findOne({
            _id: req.params.id,
            endorserId: req.user._id
        });
        if (!endorsement) return res.status(404).json({ message: 'Endorsement not found' });

        endorsement.status = 'revoked';
        await endorsement.save();
        await computeTrust(endorsement.endorsedBiodataId);

        res.json({ message: 'Endorsement revoked' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
