const express = require('express');
const Favorite = require('../models/Favorite');
const Biodata = require('../models/Biodata');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get user's favorites
router.get('/', verifyToken, async (req, res) => {
    try {
        const favorites = await Favorite.find({ userEmail: req.user.email });

        // Get biodata info for each favorite
        const favoritesWithBiodata = await Promise.all(
            favorites.map(async (favorite) => {
                const biodata = await Biodata.findOne({ biodataId: favorite.biodataId });
                return {
                    _id: favorite._id,
                    biodataId: favorite.biodataId,
                    name: biodata?.name || 'Unknown',
                    permanentAddress: biodata?.permanentDivision || 'Unknown',
                    occupation: biodata?.occupation || 'Unknown',
                    createdAt: favorite.createdAt
                };
            })
        );

        res.json(favoritesWithBiodata);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add to favorites
router.post('/', verifyToken, async (req, res) => {
    try {
        const { biodataId } = req.body;

        // Check if already favorited
        const existingFavorite = await Favorite.findOne({
            userEmail: req.user.email,
            biodataId
        });

        if (existingFavorite) {
            return res.status(400).json({ message: 'Already in favorites' });
        }

        const biodata = await Biodata.findOne({ biodataId });

        if (!biodata) {
            return res.status(404).json({ message: 'Biodata not found' });
        }

        const user = await User.findOne({ email: req.user.email });

        const favorite = new Favorite({
            userId: user._id,
            userEmail: req.user.email,
            biodataId
        });

        await favorite.save();

        res.status(201).json({ message: 'Added to favorites', favorite });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Remove from favorites
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const favorite = await Favorite.findById(req.params.id);

        if (!favorite) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        if (favorite.userEmail !== req.user.email) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await Favorite.findByIdAndDelete(req.params.id);

        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Check if biodata is favorited
router.get('/check/:biodataId', verifyToken, async (req, res) => {
    try {
        const favorite = await Favorite.findOne({
            userEmail: req.user.email,
            biodataId: parseInt(req.params.biodataId)
        });

        res.json({ isFavorited: !!favorite, favoriteId: favorite?._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
