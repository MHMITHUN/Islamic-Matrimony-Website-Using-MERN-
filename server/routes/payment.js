const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', verifyToken, async (req, res) => {
    try {
        const { amount = 500 } = req.body;

        // Demo mode - simulate successful payment
        const demoPaymentId = `PI_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        res.json({
            clientSecret: 'demo_secret',
            paymentId: demoPaymentId,
            demo: true
        });
    } catch (error) {
        console.error('Payment intent error:', error);
        res.status(500).json({ message: 'Payment error', error: error.message });
    }
});

// Confirm payment (demo endpoint)
router.post('/confirm-payment', verifyToken, async (req, res) => {
    try {
        const { paymentId } = req.body;

        res.json({
            success: true,
            paymentId,
            message: 'Payment confirmed successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'Payment confirmation error', error: error.message });
    }
});


module.exports = router;
