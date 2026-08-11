const express = require('express');
const Biodata = require('../models/Biodata');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get all biodatas with filters and pagination
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            biodataType,
            division,
            occupation,
            minAge,
            maxAge,
            sort = 'asc'
        } = req.query;

        const query = {};

        if (biodataType) {
            query.biodataType = biodataType;
        }

        if (division) {
            query.permanentDivision = division;
        }

        if (occupation) {
            query.occupation = occupation;
        }

        if (minAge || maxAge) {
            query.age = {};
            if (minAge) query.age.$gte = parseInt(minAge);
            if (maxAge) query.age.$lte = parseInt(maxAge);
        }

        const sortOrder = sort === 'desc' ? -1 : 1;

        const biodatas = await Biodata.find(query)
            .sort({ age: sortOrder })
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .select('-mobileNumber -userEmail');

        const total = await Biodata.countDocuments(query);

        res.json({
            biodatas,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get premium biodatas (6 for homepage)
router.get('/premium', async (req, res) => {
    try {
        const { sort = 'asc', limit = 6 } = req.query;
        const sortOrder = sort === 'desc' ? -1 : 1;

        const biodatas = await Biodata.find({ isPremium: true })
            .sort({ age: sortOrder })
            .limit(parseInt(limit))
            .select('biodataId biodataType profileImage permanentDivision age occupation');

        res.json(biodatas);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single biodata by biodataId
router.get('/:biodataId', verifyToken, async (req, res) => {
    try {
        const biodata = await Biodata.findOne({ biodataId: parseInt(req.params.biodataId) });

        if (!biodata) {
            return res.status(404).json({ message: 'Biodata not found' });
        }

        const user = await User.findOne({ email: req.user.email });
        const isOwner = biodata.userEmail === req.user.email;
        const isPremium = user?.isPremium || false;

        const biodataResponse = biodata.toObject();

        if (!isPremium && !isOwner) {
            delete biodataResponse.mobileNumber;
            delete biodataResponse.userEmail;
        }

        res.json({
            ...biodataResponse,
            canViewContact: isPremium || isOwner
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get similar biodatas
router.get('/:biodataId/similar', verifyToken, async (req, res) => {
    try {
        const biodata = await Biodata.findOne({ biodataId: parseInt(req.params.biodataId) });

        if (!biodata) {
            return res.status(404).json({ message: 'Biodata not found' });
        }

        const similarBiodatas = await Biodata.find({
            biodataType: biodata.biodataType,
            biodataId: { $ne: biodata.biodataId }
        })
            .limit(3)
            .select('biodataId biodataType profileImage permanentDivision age occupation');

        res.json(similarBiodatas);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create or update biodata (for logged in user)
router.post('/', verifyToken, async (req, res) => {
    try {
        const userEmail = req.user.email;

        let biodata = await Biodata.findOne({ userEmail });

        if (biodata) {
            Object.assign(biodata, req.body);
            biodata.userEmail = userEmail;
            await biodata.save();
            return res.json({ message: 'Biodata updated successfully', biodata });
        }

        const lastBiodata = await Biodata.findOne().sort({ biodataId: -1 });
        const newBiodataId = lastBiodata ? lastBiodata.biodataId + 1 : 1;

        const user = await User.findOne({ email: userEmail });

        biodata = new Biodata({
            ...req.body,
            biodataId: newBiodataId,
            userId: user._id,
            userEmail
        });

        await biodata.save();
        res.status(201).json({ message: 'Biodata created successfully', biodata });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get user's own biodata
router.get('/user/me', verifyToken, async (req, res) => {
    try {
        const biodata = await Biodata.findOne({ userEmail: req.user.email });

        if (!biodata) {
            return res.status(404).json({ message: 'No biodata found for this user' });
        }

        res.json(biodata);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Request premium status
router.post('/request-premium', verifyToken, async (req, res) => {
    try {
        const biodata = await Biodata.findOne({ userEmail: req.user.email });

        if (!biodata) {
            return res.status(404).json({ message: 'Please create a biodata first' });
        }

        if (biodata.isPremium) {
            return res.status(400).json({ message: 'Already a premium member' });
        }

        if (biodata.premiumRequestStatus === 'pending') {
            return res.status(400).json({ message: 'Premium request already pending' });
        }

        biodata.premiumRequestStatus = 'pending';
        await biodata.save();

        await User.findOneAndUpdate(
            { email: req.user.email },
            { premiumRequestStatus: 'pending' }
        );

        res.json({ message: 'Premium request submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Request profile verification (NID / imam endorsement / community leader)
router.post('/request-verification', verifyToken, async (req, res) => {
    try {
        const biodata = await Biodata.findOne({ userEmail: req.user.email });

        if (!biodata) {
            return res.status(404).json({ message: 'Please create a biodata first' });
        }

        if (biodata.verification?.status === 'verified') {
            return res.status(400).json({ message: 'Profile is already verified' });
        }

        if (biodata.verification?.status === 'pending') {
            return res.status(400).json({ message: 'Verification request already pending' });
        }

        const { method, referenceName, referenceContact } = req.body;
        if (!method || method === 'none') {
            return res.status(400).json({ message: 'Please choose a verification method' });
        }

        biodata.verification = {
            status: 'pending',
            method,
            referenceName: referenceName || '',
            referenceContact: referenceContact || '',
            submittedAt: new Date(),
            verifiedAt: null
        };
        await biodata.save();

        res.json({ message: 'Verification request submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
