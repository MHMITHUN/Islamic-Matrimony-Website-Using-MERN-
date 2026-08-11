const express = require('express');
const crypto = require('crypto');
const ContactRequest = require('../models/ContactRequest');
const Biodata = require('../models/Biodata');
const User = require('../models/User');
const WaliApproval = require('../models/WaliApproval');
const Notification = require('../models/Notification');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const waliMagicLink = (token) => `${CLIENT_URL}/wali/approve/${token}`;

// Get user's contact requests
router.get('/my-requests', verifyToken, async (req, res) => {
    try {
        const requests = await ContactRequest.find({ requesterEmail: req.user.email })
            .populate('biodataUserId', 'name email');

        // Get biodata info for each request
        const requestsWithBiodata = await Promise.all(
            requests.map(async (request) => {
                const biodata = await Biodata.findOne({ biodataId: request.biodataId });
                return {
                    _id: request._id,
                    biodataId: request.biodataId,
                    name: biodata?.name || 'Unknown',
                    status: request.status,
                    mobileNumber: request.status === 'approved' ? biodata?.mobileNumber : null,
                    email: request.status === 'approved' ? biodata?.userEmail : null,
                    createdAt: request.createdAt
                };
            })
        );

        res.json(requestsWithBiodata);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create contact request (after payment)
router.post('/', verifyToken, async (req, res) => {
    try {
        const { biodataId, paymentId } = req.body;
        const numBiodataId = Number(biodataId);

        let user = await User.findOne({ email: req.user.email });
        if (!user) {
            user = await User.create({
                name: req.user.name || req.user.email.split('@')[0],
                email: req.user.email,
                role: 'user',
                isPremium: false
            });
        }

        // Check if request already exists
        const existingRequest = await ContactRequest.findOne({
            requesterEmail: req.user.email,
            biodataId: numBiodataId
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Contact request already exists for this biodata' });
        }

        const biodata = await Biodata.findOne({ biodataId: numBiodataId });

        if (!biodata) {
            return res.status(404).json({ message: 'Biodata not found' });
        }

        // Resolve the requester's own biodata (used in wali approval page)
        const requesterBiodata = await Biodata.findOne({ userEmail: req.user.email });
        const requesterBiodataId = requesterBiodata?.biodataId || null;

        // If the target profile is wali-protected, route the request through wali approval
        const waliProtected = !!(biodata.waliEnabled && biodata.waliEmail);

        const contactRequest = new ContactRequest({
            requesterId: user._id,
            requesterEmail: req.user.email,
            requesterName: user.name || req.user.email.split('@')[0],
            requesterBiodataId,
            biodataId: numBiodataId,
            biodataUserId: biodata.userId,
            paymentId,
            status: waliProtected ? 'wali_pending' : 'pending'
        });

        await contactRequest.save();

        let waliLink = null;
        if (waliProtected) {
            const token = crypto.randomUUID();
            await WaliApproval.create({
                contactRequestId: contactRequest._id,
                biodataId: numBiodataId,
                waliEmail: biodata.waliEmail,
                requesterName: contactRequest.requesterName,
                requesterBiodataId: requesterBiodataId || numBiodataId,
                decisionToken: token
            });
            waliLink = waliMagicLink(token);

            // Email sending is stubbed for the SDP demo — log + return the link.
            console.log(`[WALI] Magic link for ${biodata.waliEmail}: ${waliLink}`);

            // Notify the profile owner that their wali's approval is required
            if (biodata.userId) {
                await Notification.create({
                    userId: biodata.userId,
                    type: 'wali_pending',
                    title: 'Wali approval required',
                    message: `${contactRequest.requesterName} requested your contact info — your wali must approve.`,
                    relatedId: contactRequest._id.toString()
                });
            }

            return res.status(201).json({
                message: 'Contact request submitted — awaiting wali approval',
                contactRequest,
                waliPending: true
            });
        }

        res.status(201).json({ message: 'Contact request submitted successfully', contactRequest });
    } catch (error) {
        console.error('Contact request error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete contact request
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const request = await ContactRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Contact request not found' });
        }

        if (request.requesterEmail !== req.user.email) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await ContactRequest.findByIdAndDelete(req.params.id);

        res.json({ message: 'Contact request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
