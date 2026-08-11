const express = require('express');
const CourseEnrollment = require('../models/CourseEnrollment');
const MarriageJourney = require('../models/MarriageJourney');
const Notification = require('../models/Notification');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();
const { TOTAL_MODULES } = require('../models/CourseEnrollment');

// Get (or auto-create) my enrollment
router.get('/progress', verifyToken, async (req, res) => {
    try {
        let enroll = await CourseEnrollment.findOne({ userId: req.user._id, courseKey: 'premarital_readiness' });
        if (!enroll) {
            enroll = await CourseEnrollment.create({
                userId: req.user._id,
                userEmail: req.user.email,
                courseKey: 'premarital_readiness',
                startedAt: new Date()
            });
        }
        res.json({ ...enroll.toObject(), totalModules: TOTAL_MODULES });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Link my enrollment to a journey (so the certificate reflects on the journey)
router.post('/link-journey/:journeyId', verifyToken, async (req, res) => {
    try {
        const journey = await MarriageJourney.findById(req.params.journeyId);
        if (!journey) return res.status(404).json({ message: 'Journey not found' });
        const isParty = [journey.userA, journey.userB].some(u => u?.toString() === req.user._id?.toString());
        if (!isParty) return res.status(403).json({ message: 'Forbidden' });

        const enroll = await CourseEnrollment.findOneAndUpdate(
            { userId: req.user._id, courseKey: 'premarital_readiness' },
            { journeyId: journey._id, startedAt: new Date() },
            { upsert: true, new: true }
        );
        if (!journey.readinessCourse?.startedAt) {
            journey.readinessCourse = { ...journey.readinessCourse?.toObject?.() ?? {}, startedAt: new Date() };
            await journey.save();
        }
        res.json({ message: 'Linked', enrollment: enroll });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Mark a module complete
router.post('/module/:n/complete', verifyToken, async (req, res) => {
    try {
        const moduleIdx = parseInt(req.params.n, 10);
        if (Number.isNaN(moduleIdx) || moduleIdx < 0 || moduleIdx >= TOTAL_MODULES) {
            return res.status(400).json({ message: 'Invalid module' });
        }

        let enroll = await CourseEnrollment.findOne({ userId: req.user._id, courseKey: 'premarital_readiness' });
        if (!enroll) {
            enroll = await CourseEnrollment.create({ userId: req.user._id, userEmail: req.user.email, courseKey: 'premarital_readiness' });
        }
        if (!enroll.completedModules.includes(moduleIdx)) {
            enroll.completedModules.push(moduleIdx);
            enroll.completedModules.sort((a, b) => a - b);
        }
        enroll.currentModule = Math.max(enroll.currentModule, Math.min(moduleIdx + 1, TOTAL_MODULES));
        enroll.progress = Math.round((enroll.completedModules.length / TOTAL_MODULES) * 100);

        if (enroll.completedModules.length >= TOTAL_MODULES && enroll.status !== 'completed') {
            enroll.status = 'completed';
            enroll.completedAt = new Date();
            enroll.certificateIssued = true;

            // Reflect on the linked journey
            if (enroll.journeyId) {
                await MarriageJourney.updateOne(
                    { _id: enroll.journeyId },
                    { $set: { 'readinessCourse.completedAt': new Date(), 'readinessCourse.certificateIssued': true } }
                );
            }
            // Self-notify
            await Notification.create({
                userId: req.user._id,
                type: 'course_completed',
                title: 'Premarital course completed',
                message: 'You earned the marriage-readiness certificate.',
                relatedId: enroll._id.toString()
            });
        }

        await enroll.save();
        res.json({ message: 'Module complete', enrollment: enroll, totalModules: TOTAL_MODULES });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
