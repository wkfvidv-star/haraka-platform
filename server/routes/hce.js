import express from 'express';
import { getInsights, processActivity } from '../controllers/hceController.js';

const router = express.Router();

// Get AGI-driven insights for the user
router.get('/insights/:userId', getInsights);

// Process new user activity through the cognitive engine
router.post('/activity', processActivity);

export default router;
