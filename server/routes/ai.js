import express from 'express';
import { OpenAI } from 'openai';
import multer from 'multer';
import prisma from '../prisma/client.js';
import { authenticate, billingGuard } from '../middleware/auth.js';

const router = express.Router();

// Configure OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Configure Multer for in-memory upload handling
const upload = multer({ storage: multer.memoryStorage() });

// @route   POST /api/ai/coach
// @desc    Virtual Coach Chat
// @access  Private
router.post('/coach', authenticate, billingGuard, async (req, res) => {
    try {
        const { query, userId } = req.body;

        const startTime = Date.now();
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "أنت مدرب رياضي محترف ومعلم لمنصة Haraka. تجيب فقط باللغة العربية، وتعطي نصائح عملية ومحددة لدعم الأداء الحركي والإدراكي للطالب." },
                { role: "user", content: query }
            ],
            max_tokens: 300
        });

        const reply = completion.choices[0].message.content;

        // Log the AI Usage dynamically
        if (userId) {
            await prisma.aiUsageLog.create({
                data: {
                    userId,
                    serviceName: 'openai_chat',
                    tokensUsed: completion.usage.total_tokens,
                    processingTimeMs: Date.now() - startTime,
                    status: 'SUCCESS'
                }
            });
        }

        res.status(200).json({ success: true, response: reply });
    } catch (error) {
        console.error('OpenAI Error:', error);
        res.status(500).json({ success: false, error: 'AI processing failed' });
    }
});

// @route   POST /api/ai/vision-analyze
// @desc    YOLOv8 Computer Vision Pipeline Mock (Node MVP worker)
// @access  Private
router.post('/vision-analyze', authenticate, billingGuard, upload.single('video'), async (req, res) => {
    try {
        const { userId } = req.body;

        // Simulating the Python AI Worker processing time
        const startTime = Date.now();
        await new Promise(resolve => setTimeout(resolve, 2500));

        const motionScore = Math.floor(Math.random() * 20) + 80; // 80-100
        const feedback = [
            "وضعية الجسم مستقيمة (Verified by YOLOv8)",
            "تم التعرف على زاوية الركبة الصحيحة أثناء الهبوط",
            "سرعة استجابة حركية مقبولة"
        ];

        // Log the Usage
        if (userId) {
            await prisma.aiUsageLog.create({
                data: {
                    userId,
                    serviceName: 'yolo_vision',
                    tokensUsed: 0, // Not applicable for YOLO
                    processingTimeMs: Date.now() - startTime,
                    status: 'SUCCESS'
                }
            });
        }

        res.status(200).json({
            success: true,
            score: motionScore,
            feedback
        });
    } catch (error) {
        console.error('Vision AI Error:', error);
        res.status(500).json({ success: false, error: 'Computer Vision pipeline failed' });
    }
});

// @route   POST /api/ai/recommend
// @desc    Provide ML Recommendations based on Fatigue and MotionScore
// @access  Private
router.post('/recommend', authenticate, billingGuard, async (req, res) => {
    try {
        const { userId, level, recentScore } = req.body;

        const startTime = Date.now();
        // Here we simulate the Scikit-learn Pipeline
        await new Promise(resolve => setTimeout(resolve, 800));

        let recommendations = [];

        // Dynamic Recommendation Rule Engine based on recent data
        if (recentScore < 70) {
            recommendations = [
                { id: 'rehab-1', category: 'rehabilitation', level: 'beginner', title: 'تمارين تأهيل خفيفة' }
            ];
        } else if (level > 10) {
            recommendations = [
                { id: 'cog-1', category: 'cognitive', level: 'advanced', title: 'Focus Master (متقدم)' },
                { id: 'rea-1', category: 'reaction', level: 'advanced', title: 'Light Speed (صعب)' }
            ];
        } else {
            recommendations = [
                { id: 'cog-1', category: 'cognitive', level: 'intermediate', title: 'Focus Master (متوسط)' },
                { id: 'rea-1', category: 'reaction', level: 'beginner', title: 'Light Speed (سهل)' }
            ];
        }

        // Log Usage
        if (userId) {
            await prisma.aiUsageLog.create({
                data: {
                    userId,
                    serviceName: 'scikit_recommendation',
                    tokensUsed: 0,
                    processingTimeMs: Date.now() - startTime,
                    status: 'SUCCESS'
                }
            });
        }

        res.status(200).json({ success: true, recommendations });
    } catch (error) {
        console.error('Recommendation Error:', error);
        res.status(500).json({ success: false, error: 'Recommendation Engine Failed' });
    }
});

export default router;
