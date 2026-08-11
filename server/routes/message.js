const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const Biodata = require('../models/Biodata');
const Notification = require('../models/Notification');
const { verifyToken } = require('../middleware/auth');

// Halal initial-contact templates — respectful, marriage-intent phrasing that
// discourages casual/flirtatious free chat. Localized via Accept-Language header.
const TEMPLATES = {
    en: [
        "Assalamu Alaikum. I came across your profile and would like to know more with the intention of marriage, in sha Allah. May our families be involved.",
        "Assalamu Alaikum wa Rahmatullah. Your profile caught my attention. If you are open to it, I would like to explore compatibility for nikah. Jazak Allah khair.",
        "Assalamu Alaikum. With due respect to you and your family, I am reaching out regarding marriage. I would be glad to share more about myself.",
    ],
    bn: [
        "আসসালামু আলাইকুম। আপনার প্রোফাইল দেখে বিবাহের উদ্দেশ্যে পরিচিত হতে চাই, ইনশাআল্লাহ। আমাদের পরিবারের অংশগ্রহণ থাকবে।",
        "আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ। আপনার প্রোফাইল আমার মনোযোগ আকর্ষণ করেছে। নিকাহর জন্য উপযুক্ততা যাচাই করতে চাইলে কৃতজ্ঞ থাকব।",
        "আসসালামু আলাইকুম। আপনাকে ও আপনার পরিবারকে সম্মান জানিয়ে বিবাহ সংক্রান্ত যোগাযোগ করছি। নিজের সম্পর্কে বিস্তারিত জানাতে পারি।",
    ]
};

// Get message templates for the chosen language
router.get('/templates', verifyToken, (req, res) => {
    const lang = (req.headers['accept-language'] || 'en').toLowerCase().startsWith('bn') ? 'bn' : 'en';
    res.json({ lang, templates: TEMPLATES[lang] });
});

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
        const { receiverEmail, subject, content, biodataId, waliCC, isTemplateMessage } = req.body;

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

        // If the sender chose to CC the recipient's wali, resolve the wali email.
        // Only possible when the recipient has wali oversight enabled.
        let waliCcEmail = '';
        if (waliCC) {
            const receiverBiodata = await Biodata.findOne({ userEmail: receiverEmail });
            if (!receiverBiodata || !receiverBiodata.waliEnabled || !receiverBiodata.waliEmail) {
                return res.status(400).json({ message: 'Recipient has not enabled wali oversight — cannot CC a wali.' });
            }
            waliCcEmail = receiverBiodata.waliEmail;
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
            biodataId: biodataId || null,
            isTemplateMessage: !!isTemplateMessage,
            waliCC: !!waliCC,
            waliCcEmail
        });

        await message.save();

        // Create notification for receiver
        await Notification.create({
            userId: receiver._id,
            type: 'new_message',
            title: 'New Message',
            message: `${req.user.name} sent you a message${subject ? ': ' + subject : ''}${waliCC ? ' (CC’d to your wali)' : ''}`,
            relatedId: message._id.toString()
        });

        // Email forwarding to the wali is stubbed for the SDP demo — log it.
        if (waliCC && waliCcEmail) {
            console.log(`[WALI-CC] Forwarding message from ${req.user.email} to wali ${waliCcEmail}: ${content}`);
        }

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
