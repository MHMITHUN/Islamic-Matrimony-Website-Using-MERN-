const express = require('express');
const Biodata = require('../models/Biodata');
const SukoonRevealRequest = require('../models/SukoonRevealRequest');
const Notification = require('../models/Notification');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// My biodata id helper
const myBiodataId = async (email) => {
    const b = await Biodata.findOne({ userEmail: email }).select('biodataId');
    return b?.biodataId || null;
};

// Browse Sukoon (second-marriage) profiles. Photos blurred unless the viewer is
// in the profile's sukoonRevealedTo list; contact info is never returned here.
router.get('/profiles', verifyToken, async (req, res) => {
    try {
        const { biodataType, division } = req.query;
        const viewerId = await myBiodataId(req.user.email);

        const query = { sukoon: true };
        if (biodataType) query.biodataType = biodataType;
        if (division) query.permanentDivision = division;

        const profiles = await Biodata.find(query)
            .select('biodataId biodataType name age occupation permanentDivision maritalStatus profileImage hasChildren childrenCount sukoonPhotoReveal sukoonRevealedTo tazkiyaTier')
            .sort({ createdAt: -1 })
            .limit(50);

        const safe = profiles.map(p => {
            const revealed = viewerId && p.sukoonRevealedTo?.includes(viewerId);
            return {
                biodataId: p.biodataId,
                biodataType: p.biodataType,
                name: p.name,
                age: p.age,
                occupation: p.occupation,
                permanentDivision: p.permanentDivision,
                maritalStatus: p.maritalStatus,
                hasChildren: p.hasChildren,
                childrenCount: p.childrenCount,
                profileImage: revealed ? p.profileImage : (p.profileImage ? '__BLURRED__' : ''),
                profileImageBlurred: !revealed && !!p.profileImage,
                revealed,
                tazkiyaTier: p.tazkiyaTier
            };
        });

        res.json(safe);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Request identity reveal for a Sukoon profile
router.post('/reveal-request/:biodataId', verifyToken, async (req, res) => {
    try {
        const targetBiodataId = Number(req.params.biodataId);
        const requesterId = await myBiodataId(req.user.email);
        if (!requesterId) return res.status(400).json({ message: 'Create your biodata first' });

        const target = await Biodata.findOne({ biodataId: targetBiodataId });
        if (!target || !target.sukoon) return res.status(404).json({ message: 'Sukoon profile not found' });

        // Already revealed?
        if (target.sukoonRevealedTo?.includes(requesterId)) {
            return res.json({ message: 'Already revealed', revealed: true });
        }

        const existing = await SukoonRevealRequest.findOne({ requesterBiodataId: requesterId, targetBiodataId });
        if (existing && existing.status === 'pending') {
            return res.status(400).json({ message: 'A reveal request is already pending' });
        }

        const reqDoc = await SukoonRevealRequest.findOneAndUpdate(
            { requesterBiodataId: requesterId, targetBiodataId },
            {
                requesterEmail: req.user.email,
                targetUserId: target.userId,
                message: req.body.message || '',
                status: 'pending',
                decidedAt: null
            },
            { upsert: true, new: true }
        );

        if (target.userId) {
            await Notification.create({
                userId: target.userId,
                type: 'sukoon_reveal_request',
                title: 'Sukoon identity reveal request',
                message: `Biodata #${requesterId} requested to see your identity (Sukoon).`,
                relatedId: reqDoc._id.toString()
            });
        }

        res.status(201).json({ message: 'Reveal request sent', request: reqDoc });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Decide a reveal request (target only)
router.post('/reveal-request/:id/decide', verifyToken, async (req, res) => {
    try {
        const { decision } = req.body; // 'approved' | 'rejected'
        const request = await SukoonRevealRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        const target = await Biodata.findOne({ biodataId: request.targetBiodataId });
        if (!target || target.userEmail !== req.user.email) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        request.status = decision === 'approved' ? 'approved' : 'rejected';
        request.decidedAt = new Date();
        await request.save();

        if (decision === 'approved' && !target.sukoonRevealedTo.includes(request.requesterBiodataId)) {
            target.sukoonRevealedTo.push(request.requesterBiodataId);
            await target.save();
        }

        // Notify requester
        const requesterBio = await Biodata.findOne({ biodataId: request.requesterBiodataId });
        if (requesterBio?.userId) {
            await Notification.create({
                userId: requesterBio.userId,
                type: 'sukoon_reveal_decision',
                title: decision === 'approved' ? 'Identity reveal approved' : 'Identity reveal declined',
                message: decision === 'approved'
                    ? `Biodata #${request.targetBiodataId} approved your reveal request.`
                    : `Biodata #${request.targetBiodataId} declined your reveal request.`,
                relatedId: request._id.toString()
            });
        }

        res.json({ message: `Decision recorded: ${request.status}`, request });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// My incoming reveal requests
router.get('/reveal-requests', verifyToken, async (req, res) => {
    try {
        const myBio = await Biodata.findOne({ userEmail: req.user.email }).select('biodataId');
        if (!myBio) return res.json([]);
        const requests = await SukoonRevealRequest.find({ targetBiodataId: myBio.biodataId }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
