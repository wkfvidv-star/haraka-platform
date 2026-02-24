import express from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { validate } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import OpenAI from 'openai';
import prisma from '../prisma/client.js';

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
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

router.post('/', authenticate, chatLimiter, validate(chatSchema), async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.userId;

    // Fetch user context for RAG
    const profile = await prisma.profile.findUnique({ where: { userId } });
    const activities = await prisma.dailyActivity.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 3
    });

    const contextString = `
      User Profile: ${profile?.firstName} ${profile?.lastName}
      Height: ${profile?.height}cm, Weight: ${profile?.weight}kg
      Goal: ${profile?.athleticGoal}
      Recent Activity: ${activities.map(a => `${a.date.toISOString().split('T')[0]}: ${a.steps} steps, ${a.calories} cal`).join(' | ')}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "أنت مدرب رياضي ذكي محترف في منصة 'حركة' (Haraka). مهمتك هي تقديم نصائح رياضية وصحية دقيقة بناءً على بيانات المستخدم. رد دائماً باللغة العربية بأسلوب تحفيزي وعلمي. استخدم بيانات البروتوكول للمستخدم المرفقة لتخصيص الإجابة."
        },
        { role: "system", content: `Context: ${contextString}` },
        { role: "user", content: message }
      ],
      max_tokens: 300,
    });

    const reply = response.choices[0].message.content;

    res.json({
      success: true,
      reply,
      timestamp: new Date().toISOString(),
      model: 'gpt-4o-mini'
    });

  } catch (error) {
    logger.error('Chat error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
