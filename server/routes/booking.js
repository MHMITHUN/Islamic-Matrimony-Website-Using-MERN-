const express = require('express');
const Booking = require('../models/Booking');
const MarriageJourney = require('../models/MarriageJourney');
const ServiceProvider = require('../models/ServiceProvider');
const Notification = require('../models/Notification');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// My bookings
router.get('/mine', verifyToken, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create a booking (payment is stubbed — booking is created as 'confirmed')
router.post('/', verifyToken, async (req, res) => {
    try {
        const { journeyId, serviceType, providerId, requestedDate, requestedTime, notes } = req.body;
        if (!['kazi', 'counselor'].includes(serviceType)) {
            return res.status(400).json({ message: 'Invalid service type' });
        }

        const journey = await MarriageJourney.findById(journeyId);
        if (!journey) return res.status(404).json({ message: 'Journey not found' });

        const provider = await ServiceProvider.findById(providerId);
        if (!provider) return res.status(404).json({ message: 'Provider not found' });

        // Stubbed payment: generate a mock payment id and confirm immediately
        const paymentId = `pi_demo_${Date.now()}`;

        const booking = await Booking.create({
            journeyId,
            serviceType,
            providerId,
            providerName: provider.name,
            userId: req.user._id,
            userEmail: req.user.email,
            requestedDate: requestedDate || null,
            requestedTime: requestedTime || '',
            status: 'confirmed',
            paymentId,
            amount: provider.fee || 0,
            notes: notes || '',
            confirmedAt: new Date()
        });

        // Link booking to the journey stage sub-doc
        if (serviceType === 'counseling') {
            journey.counseling = { ...journey.counseling?.toObject?.() ?? {}, bookingId: booking._id };
        } else {
            journey.kazi = { ...journey.kazi?.toObject?.() ?? {}, bookingId: booking._id, providerId: provider._id };
        }
        await journey.save();

        // Notify the other party
        const otherUserId = journey.userA?.toString() === req.user._id?.toString() ? journey.userB : journey.userA;
        if (otherUserId) {
            await Notification.create({
                userId: otherUserId,
                type: 'booking_update',
                title: `${serviceType === 'kazi' ? 'Kazi' : 'Counselor'} booked`,
                message: `A ${serviceType} booking was confirmed for your journey.`,
                relatedId: booking._id.toString()
            });
        }

        res.status(201).json({ message: 'Booking confirmed', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Mark a booking completed (drives counseling certificate).
// Allowed for the booking owner (they attended) OR an admin.
router.patch('/:id/complete', verifyToken, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        const isOwner = booking.userId?.toString() === req.user._id?.toString();
        const isAdmin = req.user.role === 'admin' || req.user.email === (process.env.ADMIN_EMAIL || '').toLowerCase();
        if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Forbidden' });

        booking.status = 'completed';
        booking.completedAt = new Date();
        await booking.save();

        // If counseling, mark journey counseling completed
        if (booking.serviceType === 'counseling') {
            await MarriageJourney.updateOne(
                { 'counseling.bookingId': booking._id },
                { $set: { 'counseling.completedAt': new Date(), 'counseling.certificateIssued': true } }
            );
        }

        res.json({ message: 'Booking completed', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Admin: all bookings
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 }).limit(100);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
