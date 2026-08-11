const Endorsement = require('../models/Endorsement');
const Biodata = require('../models/Biodata');
const User = require('../models/User');

const BASE = 5;
const TIER_CUTS = { bronze: 10, silver: 25, gold: 50 };

// Compute the tazkiya trust score for a biodata and cache it on both the owning
// User and the Biodata (denormalized for fast directory sort/filter).
// weight: imam endorsements = 10; member endorsements scale with the endorser's own trust.
const weightOf = (endorserRole, endorserTrustAtSubmit) =>
    endorserRole === 'imam' ? 10 : Math.round((endorserTrustAtSubmit || 0) / 5) + 1;

const tierFor = (score) => {
    if (score >= TIER_CUTS.gold) return 'gold';
    if (score >= TIER_CUTS.silver) return 'silver';
    if (score >= TIER_CUTS.bronze) return 'bronze';
    return 'none';
};

async function computeTrust(endorsedBiodataId) {
    const endorsements = await Endorsement.find({
        endorsedBiodataId,
        status: 'active'
    }).lean();

    const sum = endorsements.reduce((acc, e) => acc + weightOf(e.endorserRole, e.endorserTrustAtSubmit), 0);
    const score = BASE + sum;
    const tier = tierFor(score);

    // Cache on Biodata
    await Biodata.updateOne(
        { biodataId: endorsedBiodataId },
        { $set: { trustScore: score, tazkiyaTier: tier } }
    );

    // Cache on the owning User (if any)
    const biodata = await Biodata.findOne({ biodataId: endorsedBiodataId }).select('userEmail');
    if (biodata && biodata.userEmail) {
        await User.updateOne(
            { email: biodata.userEmail },
            { $set: { trustScore: score, tazkiyaTier: tier } }
        );
    }

    return { score, tier, endorsementCount: endorsements.length };
}

module.exports = { computeTrust, weightOf, tierFor, BASE, TIER_CUTS };
