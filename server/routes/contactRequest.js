const express = require('express');
const ContactRequest = require('../models/ContactRequest');
const Biodata = require('../models/Biodata');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

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

        // Check if request already exists
        const existingRequest = await ContactRequest.findOne({
            requesterEmail: req.user.email,
            biodataId
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Contact request already exists for this biodata' });
        }

        const biodata = await Biodata.findOne({ biodataId });

        if (!biodata) {
            return res.status(404).json({ message: 'Biodata not found' });
        }

        const user = await User.findOne({ email: req.user.email });

        const contactRequest = new ContactRequest({
            requesterId: user._id,
            requesterEmail: req.user.email,
            requesterName: user.name,
            biodataId,
            biodataUserId: biodata.userId,
            paymentId,
            status: 'pending'
        });

        await contactRequest.save();

        res.status(201).json({ message: 'Contact request submitted successfully', contactRequest });
    } catch (error) {
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
