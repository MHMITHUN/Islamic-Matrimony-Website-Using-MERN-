const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const WaliApproval = require('../models/WaliApproval');
const ContactRequest = require('../models/ContactRequest');
const Biodata = require('../models/Biodata');
const Notification = require('../models/Notification');
const { verifyToken } = require('../middleware/auth');
const { createJourneyFromRequest } = require('../lib/journey');

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const magicLink = (token) => `${CLIENT_URL}/wali/approve/${token}`;

// ---- Owner endpoints (auth required) ----

// Get the current user's wali/guardian info
router.get('/my-info', verifyToken, async (req, res) => {
    try {
        const biodata = await Biodata.findOne({ userEmail: req.user.email });
        if (!biodata) return res.status(404).json({ message: 'Please create a biodata first' });

        res.json({
            waliEnabled: biodata.waliEnabled,
            waliName: biodata.waliName || '',
            waliRelation: biodata.waliRelation || '',
            waliContact: biodata.waliContact || '',
            waliEmail: biodata.waliEmail || '',
            waliConsent: biodata.waliConsent || 'none'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update wali/guardian info
router.post('/my-info', verifyToken, async (req, res) => {
    try {
        const biodata = await Biodata.findOne({ userEmail: req.user.email });
        if (!biodata) return res.status(404).json({ message: 'Please create a biodata first' });

        const { waliEnabled, waliName, waliRelation, waliContact, waliEmail } = req.body;
        biodata.waliEnabled = !!waliEnabled;
        biodata.waliName = waliName || '';
        biodata.waliRelation = waliRelation || '';
        biodata.waliContact = waliContact || '';
        biodata.waliEmail = waliEmail || '';
        if (biodata.waliConsent === 'none' && biodata.waliEnabled) {
            biodata.waliConsent = 'pending';
        }
        await biodata.save();

        res.json({ message: 'Wali information updated', biodata });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// List pending wali approvals for the current user's profile (with magic links)
router.get('/pending', verifyToken, async (req, res) => {
    try {
        const biodata = await Biodata.findOne({ userEmail: req.user.email });
        if (!biodata) return res.json([]);

        const approvals = await WaliApproval.find({ biodataId: biodata.biodataId })
            .sort({ createdAt: -1 });

        res.json(approvals.map(a => ({
            _id: a._id,
            requesterName: a.requesterName,
            requesterBiodataId: a.requesterBiodataId,
            status: a.status,
            magicLink: magicLink(a.decisionToken),
            waliNote: a.waliNote,
            createdAt: a.createdAt,
            decidedAt: a.decidedAt
        })));
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Resend / regenerate a magic link for a given contact request (owner only)
router.post('/resend/:contactRequestId', verifyToken, async (req, res) => {
    try {
        const biodata = await Biodata.findOne({ userEmail: req.user.email });
        const request = await ContactRequest.findById(req.params.contactRequestId);
        if (!request) return res.status(404).json({ message: 'Contact request not found' });
        if (!biodata || request.biodataId !== biodata.biodataId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const token = crypto.randomUUID();
        const approval = await WaliApproval.findOneAndUpdate(
            { contactRequestId: request._id },
            {
                decisionToken: token,
                status: 'pending',
                decidedAt: null,
                waliEmail: biodata.waliEmail,
                requesterName: request.requesterName,
                requesterBiodataId: request.requesterBiodataId || request.biodataId
            },
            { upsert: true, new: true }
        );

        // Email sending is stubbed for the SDP demo — surface the link instead.
        console.log(`[WALI] Magic link for ${biodata.waliEmail}: ${magicLink(token)}`);

        res.json({ message: 'Magic link regenerated', magicLink: magicLink(token) });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ---- Public endpoints (wali uses a single-use token, no login) ----

// Fetch a safe summary for the wali approval page
router.get('/request/:token', async (req, res) => {
    try {
        const approval = await WaliApproval.findOne({ decisionToken: req.params.token });
        if (!approval) return res.status(404).json({ message: 'Invalid or expired link' });

        const biodata = await Biodata.findOne({ biodataId: approval.biodataId });

        res.json({
            requesterName: approval.requesterName,
            requesterBiodataId: approval.requesterBiodataId,
            biodataOwnerName: biodata?.name || 'the profile owner',
            waliName: biodata?.waliName || '',
            status: approval.status,
            decidedAt: approval.decidedAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Wali submits an approve / reject decision
router.post('/decision/:token', async (req, res) => {
    try {
        const { decision, waliNote } = req.body;
        if (!['approved', 'rejected'].includes(decision)) {
            return res.status(400).json({ message: 'Invalid decision' });
        }

        const approval = await WaliApproval.findOne({ decisionToken: req.params.token });
        if (!approval) return res.status(404).json({ message: 'Invalid or expired link' });
        if (approval.decidedAt) {
            return res.status(409).json({ message: 'This request has already been decided' });
        }

        approval.status = decision;
        approval.decidedAt = new Date();
        approval.waliNote = waliNote || '';
        await approval.save();

        // Update the linked contact request
        const contactRequest = await ContactRequest.findById(approval.contactRequestId);
        if (contactRequest) {
            contactRequest.status = decision === 'approved' ? 'approved' : 'rejected';
            await contactRequest.save();

            // On approval, kick off the end-to-end Marriage Journey (F3)
            if (decision === 'approved') {
                createJourneyFromRequest(contactRequest).catch((e) => console.error('[JOURNEY] create failed:', e.message));
            }

            // Notify the requester
            if (contactRequest.requesterId) {
                await Notification.create({
                    userId: contactRequest.requesterId,
                    type: decision === 'approved' ? 'contact_approved' : 'wali_decision',
                    title: decision === 'approved' ? 'Contact request approved' : 'Contact request declined',
                    message: decision === 'approved'
                        ? `The wali approved your contact request for ${approval.requesterBiodataId}.`
                        : `The wali declined your contact request for ${approval.requesterBiodataId}.`,
                    relatedId: contactRequest._id.toString()
                });
            }
        }

        // Notify the profile owner
        const biodata = await Biodata.findOne({ biodataId: approval.biodataId });
        if (biodata?.userId) {
            await Notification.create({
                userId: biodata.userId,
                type: 'wali_decision',
                title: decision === 'approved' ? 'Wali approved' : 'Wali declined',
                message: `Your wali ${decision === 'approved' ? 'approved' : 'declined'} ${approval.requesterName}'s contact request.`,
                relatedId: contactRequest ? contactRequest._id.toString() : null
            });
        }

        res.json({ message: `Decision recorded: ${decision}`, approval });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
