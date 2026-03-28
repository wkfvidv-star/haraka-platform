import express from 'express';
import { getStudentPerformance, getWeeklyData, getAchievements } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/performance', authenticate, getStudentPerformance);
router.get('/weekly', authenticate, getWeeklyData);
router.get('/achievements', authenticate, getAchievements);

export default router;
