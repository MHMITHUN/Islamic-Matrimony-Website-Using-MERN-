const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Public: Submit a contact message
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const newMessage = new ContactMessage({
            name,
            email,
            subject,
            message
        });

        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully', data: newMessage });
    } catch (error) {
        console.error('Error saving contact message:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
});

// Admin: Get all messages
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
});

// Admin: Delete a message
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        await ContactMessage.findByIdAndDelete(req.params.id);
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact message:', error);
        res.status(500).json({ message: 'Failed to delete message' });
    }
});

module.exports = router;
