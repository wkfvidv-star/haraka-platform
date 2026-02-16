import express from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { validate } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Demo Responder Logic
const MOCK_RESPONSES = [
  "رائع! الاستمرار في التمارين الرياضية هو مفتاح الصحة البدنية. هل ترغب في جدول تمارين مخصص؟",
  "التغذية السليمة تمثل 70% من النتائج. تأكد من شرب كميات كافية من الماء وتناول البروتين.",
  "بناءً على نشاطك الأخير، أقترح التركيز على تمارين التوازن اليوم لتعزيز التوافق العضلي العصبي.",
  "النوم الكافي ضروري جداً لعملية الاستشفاء العضلي. حاول الحصول على 8 ساعات من النوم.",
  "هل جربت تمارين التنفس العميق؟ إنها ممتازة لتقليل التوتر وتحسين التركيز قبل المذاكرة.",
  "ممتاز! تذكر أن الاستمرارية أهم من الكثافة في البداية. واصل العمل الجيد.",
  "بصفتي مساعدك الذكي، أنا هنا لدعمك في رحلتك الرياضية والتعليمية. ما هو سؤالك التالي؟"
];

const getDemoResponse = (message) => {
  const msg = message.toLowerCase();
  if (msg.includes('تمرين') || msg.includes('رياضة')) {
    return "التمارين الرياضية المنتظمة تعزز كفاءة الدماغ والتحصيل الدراسي. أنصحك بتمارين الكارديو الخفيفة في الصباح.";
  }
  if (msg.includes('أكل') || msg.includes('غذاء') || msg.includes('فطور')) {
    return "الغذاء الصحي المتوازن يمدك بالطاقة اللازمة ليومك الدراسي. ركز على الخضروات والفاكهة الطازجة.";
  }
  if (msg.includes('تعب') || msg.includes('ألم')) {
    return "إذا شعرت بأي ألم مستمر، يرجى التوقف عن التمرين واستشارة مدربك أو طبيبك المختص. السلامة أولاً.";
  }
  return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
};

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20, // Relaxed for demo
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many messages. Please wait a minute.'
  }
});

const chatSchema = z.object({
  body: z.object({
    message: z.string().min(1).max(1000),
  }),
});

// POST endpoint (Demo AI)
router.post('/', authenticate, chatLimiter, validate(chatSchema), async (req, res) => {
  try {
    const { message } = req.body;
    logger.info('📨 Received demo chat message', { userId: req.user.userId, length: message.length });

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const reply = getDemoResponse(message);

    res.json({
      success: true,
      reply,
      timestamp: new Date().toISOString(),
      model: 'demo-ai-v1'
    });

  } catch (error) {
    logger.error('Chat error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET endpoint (Test)
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Demo AI Chat API is active and ready for inference.'
  });
});

export default router;
