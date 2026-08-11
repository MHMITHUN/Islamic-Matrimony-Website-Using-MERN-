const express = require('express');
const crypto = require('crypto');
const GuardianLink = require('../models/GuardianLink');
const Shortlist = require('../models/Shortlist');
const FamilyThread = require('../models/FamilyThread');
const Message = require('../models/Message');
const ContactRequest = require('../models/ContactRequest');
const Biodata = require('../models/Biodata');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { verifyToken, verifyGuardian } = require('../middleware/auth');
const { calculateCompatibility } = require('../lib/compatibility');

const router = express.Router();
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const linkUrl = (token) => `${CLIENT_URL}/guardian/link/${token}`;

// ---- Linking (guardian ↔ ward consent) ----

// Guardian invites a ward by email
router.post('/wards/invite', verifyToken, verifyGuardian, async (req, res) => {
    try {
        const { wardEmail, relation } = req.body;
        if (!wardEmail) return res.status(400).json({ message: 'wardEmail is required' });

        let link = await GuardianLink.findOne({ guardianEmail: req.user.email, wardEmail: wardEmail.toLowerCase() });
        const token = crypto.randomUUID();
        if (!link) {
            link = await GuardianLink.create({
                guardianId: req.user._id,
                guardianEmail: req.user.email,
                guardianName: req.user.name,
                wardEmail: wardEmail.toLowerCase(),
                relation: relation || '',
                inviteToken: token,
                status: 'pending'
            });
        } else {
            link.status = 'pending';
            link.inviteToken = token;
            link.invitedAt = new Date();
            await link.save();
        }

        // Try to resolve the ward's biodata to attach for convenience
        const wardBio = await Biodata.findOne({ userEmail: wardEmail.toLowerCase() });
        if (wardBio && !link.wardBiodataId) {
            link.wardBiodataId = wardBio.biodataId;
            link.wardUserId = wardBio.userId;
            await link.save();
            if (wardBio.userId) {
                await Notification.create({
                    userId: wardBio.userId,
                    type: 'guardian_link_request',
                    title: 'Guardian link request',
                    message: `${req.user.name} wants to act as your guardian on Nikah.`,
                    relatedId: link._id.toString()
                });
            }
        }

        // Email stubbed — surface the link
        console.log(`[GUARDIAN] Invite link for ${wardEmail}: ${linkUrl(token)}`);
        res.status(201).json({ message: 'Invitation created', magicLink: linkUrl(token), link });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Ward fetches the invite summary (public, by token)
router.get('/link/:token', async (req, res) => {
    try {
        const link = await GuardianLink.findOne({ inviteToken: req.params.token });
        if (!link) return res.status(404).json({ message: 'Invalid or expired link' });
        res.json({
            guardianName: link.guardianName,
            guardianEmail: link.guardianEmail,
            relation: link.relation,
            status: link.status,
            wardEmail: link.wardEmail
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Ward approves / rejects the link (public, by token)
router.post('/link/:token/decide', async (req, res) => {
    try {
        const { decision } = req.body; // 'approved' | 'rejected'
        const link = await GuardianLink.findOne({ inviteToken: req.params.token });
        if (!link) return res.status(404).json({ message: 'Invalid or expired link' });
        if (link.decidedAt) return res.status(409).json({ message: 'Already decided' });

        if (decision === 'approved') {
            link.status = 'approved';
            // resolve ward biodata if not already
            if (!link.wardBiodataId) {
                const wardBio = await Biodata.findOne({ userEmail: link.wardEmail });
                if (wardBio) { link.wardBiodataId = wardBio.biodataId; link.wardUserId = wardBio.userId; }
            }
            if (link.guardianId) {
                await Notification.create({
                    userId: link.guardianId,
                    type: 'guardian_link_decided',
                    title: 'Ward approved your link',
                    message: `${link.wardEmail} approved you as their guardian.`,
                    relatedId: link._id.toString()
                });
            }
        } else {
            link.status = 'revoked';
        }
        link.decidedAt = new Date();
        await link.save();
        res.json({ message: `Decision recorded: ${link.status}`, link });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Guardian: list my wards (approved) + pending invites
router.get('/my-wards', verifyToken, verifyGuardian, async (req, res) => {
    try {
        const links = await GuardianLink.find({ guardianId: req.user._id }).sort({ updatedAt: -1 });
        // attach ward names
        const enriched = await Promise.all(links.map(async (l) => {
            const bio = l.wardBiodataId ? await Biodata.findOne({ biodataId: l.wardBiodataId }).select('name biodataType') : null;
            return { ...l.toObject(), wardName: bio?.name || l.wardEmail };
        }));
        res.json(enriched);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Revoke a link
router.delete('/wards/:id', verifyToken, verifyGuardian, async (req, res) => {
    try {
        const link = await GuardianLink.findOne({ _id: req.params.id, guardianId: req.user._id });
        if (!link) return res.status(404).json({ message: 'Link not found' });
        link.status = 'revoked';
        await link.save();
        res.json({ message: 'Link revoked' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Helper: ensure an approved link exists for guardian → ward
const approvedLinkFor = async (guardianId, wardBiodataId) => GuardianLink.findOne({
    guardianId, wardBiodataId, status: 'approved'
});

// ---- Acting on behalf of ward ----

// Browse candidates for a ward (compatibility computed against the ward's biodata)
router.get('/browse/:wardBiodataId', verifyToken, verifyGuardian, async (req, res) => {
    try {
        const wardBiodataId = Number(req.params.wardBiodataId);
        const link = await approvedLinkFor(req.user._id, wardBiodataId);
        if (!link) return res.status(403).json({ message: 'No approved link for this ward' });

        const ward = await Biodata.findOne({ biodataId: wardBiodataId });
        if (!ward) return res.status(404).json({ message: 'Ward biodata not found' });

        const targetType = ward.biodataType === 'Male' ? 'Female' : 'Male';
        const candidates = await Biodata.find({ biodataType: targetType, biodataId: { $ne: wardBiodataId } }).limit(50);

        const results = candidates.map(c => {
            const { score, details } = calculateCompatibility(ward, c);
            return {
                biodataId: c.biodataId, name: c.name, profileImage: c.profileImage,
                age: c.age, occupation: c.occupation, permanentDivision: c.permanentDivision,
                biodataType: c.biodataType, tazkiyaTier: c.tazkiyaTier, trustScore: c.trustScore,
                compatibilityScore: score, matchDetails: details
            };
        }).sort((a, b) => b.compatibilityScore - a.compatibilityScore).slice(0, 20);

        res.json({ ward: { biodataId: ward.biodataId, name: ward.name, biodataType: ward.biodataType }, results });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Shortlist (clone of favorites, guardian-scoped)
router.get('/shortlist/:wardBiodataId', verifyToken, verifyGuardian, async (req, res) => {
    try {
        const wardBiodataId = Number(req.params.wardBiodataId);
        const link = await approvedLinkFor(req.user._id, wardBiodataId);
        if (!link) return res.status(403).json({ message: 'No approved link for this ward' });

        const items = await Shortlist.find({ guardianId: req.user._id, wardBiodataId }).sort({ createdAt: -1 });
        const enriched = await Promise.all(items.map(async (it) => {
            const bio = await Biodata.findOne({ biodataId: it.biodataId }).select('name age occupation permanentDivision biodataType profileImage');
            return { ...it.toObject(), biodata: bio };
        }));
        res.json(enriched);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/shortlist', verifyToken, verifyGuardian, async (req, res) => {
    try {
        const { wardBiodataId, biodataId, note, tag } = req.body;
        const link = await approvedLinkFor(req.user._id, Number(wardBiodataId));
        if (!link) return res.status(403).json({ message: 'No approved link for this ward' });

        const item = await Shortlist.findOneAndUpdate(
            { guardianId: req.user._id, wardBiodataId, biodataId },
            { note: note || '', tag: tag || 'shortlisted' },
            { upsert: true, new: true }
        );
        res.status(201).json({ message: 'Shortlisted', item });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/shortlist/:id', verifyToken, verifyGuardian, async (req, res) => {
    try {
        await Shortlist.deleteOne({ _id: req.params.id, guardianId: req.user._id });
        res.json({ message: 'Removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Ward's incoming contact requests (guardian view)
router.get('/requests/:wardBiodataId', verifyToken, verifyGuardian, async (req, res) => {
    try {
        const wardBiodataId = Number(req.params.wardBiodataId);
        const link = await approvedLinkFor(req.user._id, wardBiodataId);
        if (!link) return res.status(403).json({ message: 'No approved link for this ward' });

        const requests = await ContactRequest.find({ biodataId: wardBiodataId }).sort({ createdAt: -1 });
        const enriched = await Promise.all(requests.map(async (r) => {
            const requester = await Biodata.findOne({ biodataId: r.requesterBiodataId || r.biodataId }).select('name age occupation permanentDivision');
            return { ...r.toObject(), requesterName: r.requesterName, requesterBiodata: requester };
        }));
        res.json(enriched);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ---- Family-to-family chat ----

// List family threads involving the guardian's ward(s)
router.get('/family-threads', verifyToken, verifyGuardian, async (req, res) => {
    try {
        const links = await GuardianLink.find({ guardianId: req.user._id, status: 'approved' });
        const wardIds = links.map(l => l.wardBiodataId).filter(Boolean);
        const threads = await FamilyThread.find({
            $or: [{ biodataA: { $in: wardIds } }, { biodataB: { $in: wardIds } }],
            status: 'active'
        }).sort({ lastMessageAt: -1 });
        res.json(threads);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Messages in a family thread
router.get('/family-threads/:id/messages', verifyToken, verifyGuardian, async (req, res) => {
    try {
        const thread = await FamilyThread.findById(req.params.id);
        if (!thread) return res.status(404).json({ message: 'Thread not found' });
        const msgs = await Message.find({ familyThreadId: thread._id }).sort({ createdAt: 1 }).limit(100);
        res.json({ thread, messages: msgs });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Send a family message (creates/uses a thread for the biodata pair)
router.post('/family-threads', verifyToken, verifyGuardian, async (req, res) => {
    try {
        const { wardBiodataId, partnerBiodataId, content } = req.body;
        if (!content) return res.status(400).json({ message: 'content is required' });

        const link = await approvedLinkFor(req.user._id, Number(wardBiodataId));
        if (!link) return res.status(403).json({ message: 'No approved link for this ward' });

        const a = Math.min(wardBiodataId, partnerBiodataId);
        const b = Math.max(wardBiodataId, partnerBiodataId);

        let thread = await FamilyThread.findOne({ biodataA: a, biodataB: b });
        if (!thread) {
            thread = await FamilyThread.create({
                biodataA: a, biodataB: b,
                guardianA: wardBiodataId === a ? req.user._id : null,
                guardianB: wardBiodataId === b ? req.user._id : null
            });
        } else {
            if (wardBiodataId === a && !thread.guardianA) thread.guardianA = req.user._id;
            if (wardBiodataId === b && !thread.guardianB) thread.guardianB = req.user._id;
        }
        thread.lastMessageAt = new Date();
        await thread.save();

        const msg = await Message.create({
            senderId: req.user._id,
            senderEmail: req.user.email,
            senderName: `${req.user.name} (Guardian)`,
            receiverId: req.user._id, // family messages are threaded, not 1-1 inbox
            receiverEmail: req.user.email,
            receiverName: 'Family thread',
            content,
            familyThreadId: thread._id,
            biodataId: wardBiodataId
        });

        res.status(201).json({ message: 'Sent', thread, msg });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Member side: see guardians linked to me (the ward)
router.get('/my-guardians', verifyToken, async (req, res) => {
    try {
        const links = await GuardianLink.find({ wardEmail: req.user.email }).sort({ updatedAt: -1 });
        res.json(links);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
