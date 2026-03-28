import express from 'express';
import { getHealthProfile, saveMetrics, createGoal, updateGoalProgress } from '../controllers/healthController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/profile', getHealthProfile);
router.post('/metrics', saveMetrics);
router.post('/goals', createGoal);
router.patch('/goals/:goalId', updateGoalProgress);

export default router;
