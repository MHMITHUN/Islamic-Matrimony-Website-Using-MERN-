const MarriageJourney = require('../models/MarriageJourney');
const Biodata = require('../models/Biodata');
const User = require('../models/User');

// Create a MarriageJourney from an approved ContactRequest (idempotent).
async function createJourneyFromRequest(contactRequest) {
    if (!contactRequest) return null;

    // Idempotent: one journey per contact request
    const existing = await MarriageJourney.findOne({ contactRequestId: contactRequest._id });
    if (existing) return existing;

    const targetBiodata = await Biodata.findOne({ biodataId: contactRequest.biodataId });
    let targetUserId = contactRequest.biodataUserId || targetBiodata?.userId;

    if (!targetUserId && targetBiodata?.userEmail) {
        const u = await User.findOne({ email: targetBiodata.userEmail });
        if (u) targetUserId = u._id;
    }

    const requesterUser = await User.findById(contactRequest.requesterId);
    let requesterBiodataId = contactRequest.requesterBiodataId;
    if (!requesterBiodataId && requesterUser?.email) {
        const b = await Biodata.findOne({ userEmail: requesterUser.email });
        if (b) requesterBiodataId = b.biodataId;
    }

    if (!targetUserId || !contactRequest.requesterId) return null;

    try {
        const journey = await MarriageJourney.create({
            contactRequestId: contactRequest._id,
            biodataA: requesterBiodataId || 0,
            biodataB: contactRequest.biodataId,
            userA: contactRequest.requesterId,
            userB: targetUserId,
            currentStage: 'connected',
            stageHistory: [{ stage: 'connected', enteredAt: contactRequest.updatedAt || new Date(), note: 'Contact request approved' }]
        });

        return journey;
    } catch (err) {
        console.error('[JOURNEY] create error:', err.message);
        return null;
    }
}

module.exports = { createJourneyFromRequest };
