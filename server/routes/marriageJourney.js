const express = require('express');
const MarriageJourney = require('../models/MarriageJourney');
const ContactRequest = require('../models/ContactRequest');
const Biodata = require('../models/Biodata');
const Booking = require('../models/Booking');
const MahrAgreement = require('../models/MahrAgreement');
const SuccessStory = require('../models/SuccessStory');
const Notification = require('../models/Notification');
const { verifyToken } = require('../middleware/auth');
const { createJourneyFromRequest } = require('../lib/journey');

const router = express.Router();
const { STAGES } = require('../models/MarriageJourney');

const isParty = (journey, user) => journey && (
    journey.userA?.toString() === user._id?.toString() ||
    journey.userB?.toString() === user._id?.toString()
);

// My journeys (as either party)
router.get('/mine', verifyToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const myBiodata = await Biodata.findOne({ userEmail: req.user.email }).select('biodataId');
        const myBiodataId = myBiodata?.biodataId;

        // Auto-sync/backfill any approved contact requests for this user that don't have a journey yet
        const approvedRequests = await ContactRequest.find({
            $or: [
                { requesterId: userId },
                { biodataUserId: userId },
                ...(myBiodataId ? [{ biodataId: myBiodataId }] : [])
            ],
            status: 'approved'
        });

        for (const reqDoc of approvedRequests) {
            await createJourneyFromRequest(reqDoc);
        }

        const query = {
            $or: [
                { userA: userId },
                { userB: userId },
                ...(myBiodataId ? [{ biodataA: myBiodataId }, { biodataB: myBiodataId }] : [])
            ],
            status: { $ne: 'cancelled' }
        };

        const journeys = await MarriageJourney.find(query).sort({ updatedAt: -1 });
        res.json(journeys);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Admin: all journeys
router.get('/admin/all', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
        const journeys = await MarriageJourney.find().sort({ updatedAt: -1 }).limit(100);
        res.json(journeys);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Single journey (party only)
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const journey = await MarriageJourney.findById(req.params.id);
        if (!journey) return res.status(404).json({ message: 'Journey not found' });
        if (!isParty(journey, req.user)) return res.status(403).json({ message: 'Forbidden' });

        // Attach related docs for convenience
        const [counselingBooking, kaziBooking, mahr] = await Promise.all([
            journey.counseling?.bookingId ? Booking.findById(journey.counseling.bookingId).lean() : null,
            journey.kazi?.bookingId ? Booking.findById(journey.kazi.bookingId).lean() : null,
            journey.mahr?.agreementId ? MahrAgreement.findById(journey.mahr.agreementId).lean() : null
        ]);

        res.json({ ...journey.toObject(), counselingBooking, kaziBooking, mahr });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Advance to the next stage (forward-only, with guards)
router.post('/advance/:id', verifyToken, async (req, res) => {
    try {
        const journey = await MarriageJourney.findById(req.params.id);
        if (!journey) return res.status(404).json({ message: 'Journey not found' });
        if (!isParty(journey, req.user)) return res.status(403).json({ message: 'Forbidden' });

        const { stage, note } = req.body;
        const currentIndex = STAGES.indexOf(journey.currentStage);
        const targetIndex = STAGES.indexOf(stage);
        if (targetIndex === -1) return res.status(400).json({ message: 'Invalid stage' });
        if (targetIndex !== currentIndex + 1) {
            return res.status(400).json({ message: 'You can only advance to the next stage.' });
        }

        // Stage guards — "do the work in-stage, advance requires it done".
        // Target stage → prerequisite that must be satisfied to ENTER it.
        if (stage === 'mahr_agreed') {
            // entering the mahr stage requires counseling to be completed first
            const cb = journey.counseling?.bookingId ? await Booking.findById(journey.counseling.bookingId) : null;
            if (!cb || cb.status !== 'completed') {
                return res.status(400).json({ message: 'Complete a counseling session before the mahr stage.' });
            }
        }
        if (stage === 'kazi_booked') {
            // entering the kazi stage requires the mahr to be agreed
            const mahr = journey.mahr?.agreementId ? await MahrAgreement.findById(journey.mahr.agreementId) : null;
            if (!mahr || mahr.status !== 'agreed') {
                return res.status(400).json({ message: 'Both parties must confirm the mahr agreement before booking the kazi.' });
            }
        }
        if (stage === 'nikah_registered') {
            // registering requires a confirmed kazi booking
            const kaziBooking = journey.kazi?.bookingId ? await Booking.findById(journey.kazi.bookingId) : null;
            if (!kaziBooking || kaziBooking.status !== 'confirmed') {
                return res.status(400).json({ message: 'Confirm a kazi booking before registering the nikah.' });
            }
        }

        journey.currentStage = stage;
        journey.stageHistory.push({ stage, enteredAt: new Date(), note: note || '' });

        if (stage === 'nikah_registered') {
            journey.nikahDate = new Date();
            journey.status = 'completed';
            // Emit a SuccessStory
            await SuccessStory.create({
                selfBiodataId: journey.biodataA,
                partnerBiodataId: journey.biodataB,
                maleBiodataId: journey.biodataA,
                femaleBiodataId: journey.biodataB,
                marriageDate: new Date(),
                reviewStar: 5,
                successStoryText: 'Completed their nikah journey on Nikah.',
                coupleImage: '',
                status: 'approved'
            }).catch(() => { /* non-fatal if a story already exists */ });
        }

        await journey.save();

        // Notify the other party
        const otherUserId = journey.userA?.toString() === req.user._id?.toString() ? journey.userB : journey.userA;
        if (otherUserId) {
            await Notification.create({
                userId: otherUserId,
                type: 'journey_stage',
                title: 'Marriage journey advanced',
                message: `Your journey advanced to: ${stage.replace(/_/g, ' ')}.`,
                relatedId: journey._id.toString()
            });
        }

        res.json({ message: 'Stage advanced', journey });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
