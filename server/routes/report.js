const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const Biodata = require('../models/Biodata');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Create a report (authenticated)
router.post('/', verifyToken, async (req, res) => {
    try {
        const { biodataId, reason, description } = req.body;

        if (!biodataId || !reason) {
            return res.status(400).json({ message: 'biodataId and reason are required' });
        }

        const biodata = await Biodata.findOne({ biodataId: parseInt(biodataId) });
        if (!biodata) {
            return res.status(404).json({ message: 'Biodata not found' });
        }

        // Prevent self-reporting
        if (biodata.userEmail === req.user.email) {
            return res.status(400).json({ message: 'You cannot report your own profile' });
        }

        // Check for duplicate report
        const existing = await Report.findOne({
            reporterId: req.user._id,
            biodataId: parseInt(biodataId)
        });
        if (existing) {
            return res.status(400).json({ message: 'You have already reported this profile' });
        }

        const report = new Report({
            reporterId: req.user._id,
            reporterEmail: req.user.email,
            biodataId: parseInt(biodataId),
            biodataUserId: biodata.userId,
            reason,
            description: description || ''
        });

        await report.save();
        res.status(201).json({ message: 'Report submitted successfully', data: report });
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all reports (admin only)
router.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('reporterId', 'name email photoURL')
            .sort({ createdAt: -1 });

        // Enrich with biodata info
        const enrichedReports = await Promise.all(
            reports.map(async (report) => {
                const biodata = await Biodata.findOne({ biodataId: report.biodataId })
                    .select('name profileImage biodataType occupation permanentDivision');
                return {
                    ...report.toObject(),
                    biodata: biodata || null
                };
            })
        );

        res.json(enrichedReports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update report status (admin only)
router.patch('/admin/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['pending', 'reviewed', 'resolved', 'dismissed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const report = await Report.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.json({ message: 'Report updated', data: report });
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Check if user has reported a biodata
router.get('/check/:biodataId', verifyToken, async (req, res) => {
    try {
        const report = await Report.findOne({
            reporterId: req.user._id,
            biodataId: parseInt(req.params.biodataId)
        });
        res.json({ hasReported: !!report, reportId: report?._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
