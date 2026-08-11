const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const Biodata = require('../models/Biodata');
const { verifyToken } = require('../middleware/auth');

// Calculate Deen (religious) compatibility sub-score in [0,1].
// Combines sect (0.4), prayer frequency (0.25), religious commitment (0.25),
// religious education (0.1). Each component is only counted when BOTH profiles
// provide it, and the result is normalized by the weight actually used so that
// older profiles without Deen data are not penalized here (they simply skip Deen).
function deenSubFactor(my, target) {
    let subscore = 0;
    let used = 0;

    // Sect / madhhab (weight 0.4)
    if (my.sect && target.sect) {
        let s;
        if (my.sect === target.sect) s = 1.0;
        else if (my.sect.startsWith('Sunni') && target.sect.startsWith('Sunni')) s = 0.7; // same school family, different madhhab
        else if (my.sect === 'Shia' || target.sect === 'Shia') s = 0.2; // cross-sect
        else s = 0.5;
        subscore += s * 0.4; used += 0.4;
    }
    // Prayer frequency (weight 0.25)
    if (my.prayerFrequency && target.prayerFrequency) {
        const order = { 'Five Daily': 0, 'Sometimes': 1, 'Rarely': 2 };
        const diff = Math.abs((order[my.prayerFrequency] ?? 1) - (order[target.prayerFrequency] ?? 1));
        const p = diff === 0 ? 1.0 : diff === 1 ? 0.6 : 0.3;
        subscore += p * 0.25; used += 0.25;
    }
    // Religious commitment (weight 0.25)
    if (my.religiousCommitment && target.religiousCommitment) {
        const order = { 'Practicing': 0, 'Moderate': 1, 'Cultural': 2 };
        const diff = Math.abs((order[my.religiousCommitment] ?? 1) - (order[target.religiousCommitment] ?? 1));
        const c = diff === 0 ? 1.0 : diff === 1 ? 0.7 : 0.3;
        subscore += c * 0.25; used += 0.25;
    }
    // Religious education (weight 0.1)
    if (my.religiousEducation && target.religiousEducation) {
        const e = my.religiousEducation === target.religiousEducation ? 1.0 : 0.6;
        subscore += e * 0.1; used += 0.1;
    }

    return { score: used > 0 ? subscore / used : 0, used };
}

// Calculate weighted compatibility score between two biodatas (0-100).
// Weights: Deen 35, Age 25, Height 15, Division 15, Occupation 10 (Deen dominant,
// reflecting the Prophetic guidance to prioritize religious commitment in a spouse).
// Factors are only counted when the data needed to evaluate them is present on
// both sides; the final score is normalized by the weight actually computable,
// so profiles with sparse data are not unfairly penalized.
function calculateCompatibility(myBiodata, targetBiodata) {
    const WEIGHTS = { deen: 35, age: 25, height: 15, division: 15, occupation: 10 };
    let contribution = 0;
    let weightSum = 0;
    const details = { ageMatch: false, heightMatch: false, divisionMatch: false, occupationMatch: false, deenMatch: false };

    // Age match: target's age within my expected partner age range
    if (myBiodata.expectedPartnerAge && targetBiodata.age) {
        weightSum += WEIGHTS.age;
        const [minAge, maxAge] = myBiodata.expectedPartnerAge.split('-').map(Number);
        if (targetBiodata.age >= minAge && targetBiodata.age <= maxAge) {
            contribution += WEIGHTS.age;
            details.ageMatch = true;
        }
    }

    // Height match
    if (myBiodata.expectedPartnerHeight && targetBiodata.height) {
        weightSum += WEIGHTS.height;
        if (myBiodata.expectedPartnerHeight === targetBiodata.height) {
            contribution += WEIGHTS.height;
            details.heightMatch = true;
        }
    }

    // Division match
    if (myBiodata.permanentDivision && targetBiodata.permanentDivision) {
        weightSum += WEIGHTS.division;
        if (myBiodata.permanentDivision === targetBiodata.permanentDivision) {
            contribution += WEIGHTS.division;
            details.divisionMatch = true;
        }
    }

    // Occupation match
    if (myBiodata.occupation && targetBiodata.occupation) {
        weightSum += WEIGHTS.occupation;
        if (myBiodata.occupation === targetBiodata.occupation) {
            contribution += WEIGHTS.occupation;
            details.occupationMatch = true;
        }
    }

    // Deen (religious) match — the dominant weighted factor
    const deen = deenSubFactor(myBiodata, targetBiodata);
    if (deen.used > 0) {
        weightSum += WEIGHTS.deen;
        contribution += WEIGHTS.deen * deen.score;
        details.deenMatch = deen.score >= 0.7;
    }

    return { score: weightSum > 0 ? Math.round((contribution / weightSum) * 100) : 0, details };
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
