const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const Biodata = require('../models/Biodata');
const { verifyToken } = require('../middleware/auth');

// Calculate compatibility score between two biodatas
function calculateCompatibility(myBiodata, targetBiodata) {
    let score = 0;
    let total = 0;
    const details = { ageMatch: false, heightMatch: false, divisionMatch: false, occupationMatch: false };

    // Age match: check if target's age falls within my expected partner age range
    if (myBiodata.expectedPartnerAge && targetBiodata.age) {
        total++;
        const [minAge, maxAge] = myBiodata.expectedPartnerAge.split('-').map(Number);
        if (targetBiodata.age >= minAge && targetBiodata.age <= maxAge) {
            score++;
            details.ageMatch = true;
        }
    }

    // Height match
    if (myBiodata.expectedPartnerHeight && targetBiodata.height) {
        total++;
        if (myBiodata.expectedPartnerHeight === targetBiodata.height) {
            score++;
            details.heightMatch = true;
        }
    }

    // Division match
    if (myBiodata.permanentDivision && targetBiodata.permanentDivision) {
        total++;
        if (myBiodata.permanentDivision === targetBiodata.permanentDivision) {
            score++;
            details.divisionMatch = true;
        }
    }

    // Occupation match
    if (myBiodata.occupation && targetBiodata.occupation) {
        total++;
        if (myBiodata.occupation === targetBiodata.occupation) {
            score++;
            details.occupationMatch = true;
        }
    }

    return { score: total > 0 ? Math.round((score / total) * 100) : 0, details };
}

// Get matches for current user
router.get('/', verifyToken, async (req, res) => {
    try {
        const biodata = await Biodata.findOne({ userEmail: req.user.email });
        if (!biodata) {
            return res.json([]);
        }

        // Find potential matches (opposite gender)
        const targetType = biodata.biodataType === 'Male' ? 'Female' : 'Male';
        const candidates = await Biodata.find({
            biodataType: targetType,
            biodataId: { $ne: biodata.biodataId }
        }).limit(50);

        // Calculate compatibility for each
        const matches = candidates.map(candidate => {
            const { score, details } = calculateCompatibility(biodata, candidate);
            return {
                biodataId: candidate.biodataId,
                name: candidate.name,
                profileImage: candidate.profileImage,
                age: candidate.age,
                occupation: candidate.occupation,
                permanentDivision: candidate.permanentDivision,
                biodataType: candidate.biodataType,
                compatibilityScore: score,
                matchDetails: details
            };
        });

        // Sort by compatibility score descending
        matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

        res.json(matches.slice(0, 20));
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get match details between current user and specific biodata
router.get('/with/:biodataId', verifyToken, async (req, res) => {
    try {
        const myBiodata = await Biodata.findOne({ userEmail: req.user.email });
        if (!myBiodata) {
            return res.status(404).json({ message: 'Create your biodata first' });
        }

        const targetBiodata = await Biodata.findOne({ biodataId: parseInt(req.params.biodataId) });
        if (!targetBiodata) {
            return res.status(404).json({ message: 'Biodata not found' });
        }

        const myMatch = calculateCompatibility(myBiodata, targetBiodata);
        const theirMatch = calculateCompatibility(targetBiodata, myBiodata);

        res.json({
            myCompatibility: myMatch,
            theirCompatibility: theirMatch,
            mutualScore: Math.round((myMatch.score + theirMatch.score) / 2)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
