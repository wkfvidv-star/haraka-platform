import express from 'express';
import { getLeaderboard, getBadges } from '../controllers/gamificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.get('/badges', authenticate, getBadges);

export default router;
