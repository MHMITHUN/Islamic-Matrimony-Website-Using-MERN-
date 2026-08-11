const MarriageJourney = require('../models/MarriageJourney');
const Biodata = require('../models/Biodata');

// Create a MarriageJourney from an approved ContactRequest (idempotent).
// The requester (biodataA/userA) requested the target (biodataB/userB).
async function createJourneyFromRequest(contactRequest) {
    if (!contactRequest) return null;

    // Idempotent: one journey per contact request
    const existing = await MarriageJourney.findOne({ contactRequestId: contactRequest._id });
    if (existing) return existing;

    const requesterBiodata = await Biodata.findOne({ biodataId: contactRequest.biodataId }); // target of the request
    const requester = await require('../models/User').findById(contactRequest.requesterId);

    if (!requesterBiodata || !requester) return null;

    const journey = await MarriageJourney.create({
        contactRequestId: contactRequest._id,
        biodataA: contactRequest.requesterBiodataId || requester?.biodataId,
        biodataB: contactRequest.biodataId,
        userA: contactRequest.requesterId,
        userB: requesterBiodata.userId,
        currentStage: 'connected',
        stageHistory: [{ stage: 'connected', enteredAt: new Date(), note: 'Contact request approved' }]
    });

    return journey;
}

module.exports = { createJourneyFromRequest };
