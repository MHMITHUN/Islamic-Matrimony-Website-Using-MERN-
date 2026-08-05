const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { verifyToken } = require('../middleware/auth');

// Get inbox (received messages)
router.get('/inbox', verifyToken, async (req, res) => {
    try {
        const messages = await Message.find({ receiverEmail: req.user.email })
            .sort({ createdAt: -1 })
            .limit(50);
        const unreadCount = await Message.countDocuments({ receiverEmail: req.user.email, isRead: false });
        res.json({ messages, unreadCount });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get sent messages
router.get('/sent', verifyToken, async (req, res) => {
    try {
        const messages = await Message.find({ senderEmail: req.user.email })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get conversation between two users
router.get('/conversation/:email', verifyToken, async (req, res) => {
    try {
        const otherEmail = req.params.email;
        const messages = await Message.find({
            $or: [
                { senderEmail: req.user.email, receiverEmail: otherEmail },
                { senderEmail: otherEmail, receiverEmail: req.user.email }
            ]
        }).sort({ createdAt: 1 }).limit(100);

        // Mark messages from other user as read
        await Message.updateMany(
            { senderEmail: otherEmail, receiverEmail: req.user.email, isRead: false },
            { isRead: true }
        );

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Send message
router.post('/', verifyToken, async (req, res) => {
    try {
        const { receiverEmail, subject, content, biodataId } = req.body;

        if (!receiverEmail || !content) {
            return res.status(400).json({ message: 'receiverEmail and content are required' });
        }

        if (receiverEmail === req.user.email) {
            return res.status(400).json({ message: 'Cannot send message to yourself' });
        }

        const receiver = await User.findOne({ email: receiverEmail });
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }

        const message = new Message({
            senderId: req.user._id,
            senderEmail: req.user.email,
            senderName: req.user.name,
            receiverId: receiver._id,
            receiverEmail: receiver.email,
            receiverName: receiver.name,
            subject: subject || '',
            content,
            biodataId: biodataId || null
        });

        await message.save();

        // Create notification for receiver
        await Notification.create({
            userId: receiver._id,
            type: 'new_message',
            title: 'New Message',
            message: `${req.user.name} sent you a message${subject ? ': ' + subject : ''}`,
            relatedId: message._id.toString()
        });

        res.status(201).json({ message: 'Message sent', data: message });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete message
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const message = await Message.findOneAndDelete({
            _id: req.params.id,
            $or: [{ senderEmail: req.user.email }, { receiverEmail: req.user.email }]
        });
        if (!message) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
