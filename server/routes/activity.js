import express from 'express';
import { saveActivity, getActivityHistory } from '../controllers/activityController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/save', authenticate, saveActivity);
router.get('/history', authenticate, getActivityHistory);

export default router;
