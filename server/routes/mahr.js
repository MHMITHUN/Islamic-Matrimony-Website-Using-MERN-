const express = require('express');
const MahrAgreement = require('../models/MahrAgreement');
const MarriageJourney = require('../models/MarriageJourney');
const Notification = require('../models/Notification');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get the mahr agreement for a journey (party only)
router.get('/by-journey/:journeyId', verifyToken, async (req, res) => {
    try {
        const journey = await MarriageJourney.findById(req.params.journeyId);
        if (!journey) return res.status(404).json({ message: 'Journey not found' });
        const isParty = [journey.userA, journey.userB].some(u => u?.toString() === req.user._id?.toString());
        if (!isParty) return res.status(403).json({ message: 'Forbidden' });

        let agreement = journey.mahr?.agreementId
            ? await MahrAgreement.findById(journey.mahr.agreementId)
            : null;
        if (!agreement) {
            agreement = await MahrAgreement.create({
                journeyId: journey._id,
                biodataA: journey.biodataA,
                biodataB: journey.biodataB
            });
            journey.mahr = { agreementId: agreement._id };
            await journey.save();
        }
        res.json(agreement);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Upsert draft terms (party only)
router.put('/', verifyToken, async (req, res) => {
    try {
        const { journeyId, amount, amountType, description, witnessName, witnessContact } = req.body;
        const journey = await MarriageJourney.findById(journeyId);
        if (!journey) return res.status(404).json({ message: 'Journey not found' });
        const isParty = [journey.userA, journey.userB].some(u => u?.toString() === req.user._id?.toString());
        if (!isParty) return res.status(403).json({ message: 'Forbidden' });

        let agreement = journey.mahr?.agreementId
            ? await MahrAgreement.findById(journey.mahr.agreementId)
            : null;
        if (!agreement) {
            agreement = new MahrAgreement({ journeyId: journey._id, biodataA: journey.biodataA, biodataB: journey.biodataB });
        }
        if (amount !== undefined) agreement.amount = amount;
        if (amountType !== undefined) agreement.amountType = amountType;
        if (description !== undefined) agreement.description = description;
        if (witnessName !== undefined) agreement.witnessName = witnessName;
        if (witnessContact !== undefined) agreement.witnessContact = witnessContact;
        // Editing resets confirmations (terms changed)
        if (agreement.status !== 'agreed') {
            agreement.confirmations.partyA.confirmed = false;
            agreement.confirmations.partyB.confirmed = false;
            agreement.status = amount || description ? 'pending' : 'draft';
        }
        await agreement.save();

        if (!journey.mahr?.agreementId) {
            journey.mahr = { agreementId: agreement._id };
            await journey.save();
        }

        res.json({ message: 'Mahr terms saved', agreement });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Confirm my side; when both confirm → status 'agreed' + notify
router.post('/:id/confirm', verifyToken, async (req, res) => {
    try {
        const agreement = await MahrAgreement.findById(req.params.id);
        if (!agreement) return res.status(404).json({ message: 'Agreement not found' });

        const journey = await MarriageJourney.findById(agreement.journeyId);
        if (!journey) return res.status(404).json({ message: 'Journey not found' });

        const side = journey.userA?.toString() === req.user._id?.toString() ? 'partyA'
            : journey.userB?.toString() === req.user._id?.toString() ? 'partyB' : null;
        if (!side) return res.status(403).json({ message: 'Forbidden' });

        agreement.confirmations[side] = { confirmed: true, confirmedAt: new Date() };
        if (agreement.confirmations.partyA.confirmed && agreement.confirmations.partyB.confirmed) {
            agreement.status = 'agreed';
        }
        await agreement.save();

        if (agreement.status === 'agreed') {
            const otherUserId = side === 'partyA' ? journey.userB : journey.userA;
            await Notification.create({
                userId: otherUserId,
                type: 'mahr_confirmed',
                title: 'Mahr agreement confirmed',
                message: 'Both parties confirmed the mahr terms. You can advance the journey.',
                relatedId: journey._id.toString()
            });
        }

        res.json({ message: 'Confirmed', agreement });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
