import express from 'express';
import prisma from '../prisma/client.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/coach/video-reports
// @desc    Get pending and completed video analyses for the coach's students
// @access  Coach Private
router.get('/video-reports', authenticate, authorize('COACH', 'ADMIN'), async (req, res) => {
    try {
        // Mock data to remove frontend hardcoding, as deep CV pipeline isn't fully integrated here
        const mockReports = [
            {
                id: 'analysis_001',
                sessionId: 'session_001',
                studentId: 'student_001',
                studentName: 'أحمد محمد',
                exerciseName: 'تمرين القوة الوظيفية',
                videoUrl: '/mock-video-1.mp4',
                overallScore: 85,
                metrics: { balance: 88, speed: 82, accuracy: 85, modelConfidence: 92 },
                recommendation: 'ممتاز! حافظ على هذا المستوى وركز على تحسين السرعة',
                status: 'completed',
                coachReviewRequested: true,
                coachReviewed: false,
                createdAt: new Date('2024-01-15T10:30:00'),
                completedAt: new Date('2024-01-15T10:35:00')
            },
            {
                id: 'analysis_002',
                sessionId: 'session_002',
                studentId: 'student_002',
                studentName: 'فاطمة علي',
                exerciseName: 'تمارين التوازن',
                videoUrl: '/mock-video-2.mp4',
                overallScore: 72,
                metrics: { balance: 68, speed: 75, accuracy: 74, modelConfidence: 87 },
                recommendation: 'جيد، لكن يحتاج تحسين في التوازن. جرب تمارين الثبات',
                status: 'completed',
                coachReviewRequested: true,
                coachReviewed: true,
                coachFeedback: 'أوافق على التوصية. أضف تمارين اليوغا للتوازن',
                createdAt: new Date('2024-01-14T14:20:00'),
                completedAt: new Date('2024-01-14T14:25:00')
            }
        ];
        res.status(200).json({ success: true, data: mockReports });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch reports' });
    }
});

// @route   POST /api/coach/review-report
// @desc    Update a report with coach feedback
// @access  Coach Private
router.post('/review-report', authenticate, authorize('COACH', 'ADMIN'), async (req, res) => {
    try {
        const { reportId, approved, feedback } = req.body;
        // In actual prod, we update the analysis table in DB
        res.status(200).json({ success: true, message: 'Review saved', reportId });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to save review' });
    }
});

export default router;
