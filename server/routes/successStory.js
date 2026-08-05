const express = require('express');
const SuccessStory = require('../models/SuccessStory');
const Biodata = require('../models/Biodata');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get all success stories (sorted by marriage date desc)
router.get('/', async (req, res) => {
    try {
        const stories = await SuccessStory.find()
            .sort({ marriageDate: -1 });

        res.json(stories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create success story (Got Married)
router.post('/', verifyToken, async (req, res) => {
    try {
        const { selfBiodataId, partnerBiodataId, coupleImage, marriageDate, reviewStar, successStoryText } = req.body;

        // Verify biodatas exist
        const selfBiodata = await Biodata.findOne({ biodataId: selfBiodataId });
        const partnerBiodata = await Biodata.findOne({ biodataId: partnerBiodataId });

        if (!selfBiodata) {
            return res.status(404).json({ message: 'Your biodata not found' });
        }

        if (!partnerBiodata) {
            return res.status(404).json({ message: 'Partner biodata not found' });
        }

        // Check if user owns the selfBiodata
        if (selfBiodata.userEmail !== req.user.email) {
            return res.status(403).json({ message: 'You can only submit story with your own biodata' });
        }

        const user = await User.findOne({ email: req.user.email });

        const story = new SuccessStory({
            selfBiodataId,
            partnerBiodataId,
            coupleImage,
            marriageDate,
            reviewStar,
            successStoryText,
            userId: user._id
        });

        await story.save();

        res.status(201).json({ message: 'Success story submitted', story });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single success story
router.get('/:id', async (req, res) => {
    try {
        const story = await SuccessStory.findById(req.params.id);

        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        res.json(story);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
