import express from 'express';
import * as profileController from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/:userId', authenticate, profileController.getProfile);
router.put('/:userId', authenticate, profileController.updateProfile);
router.put('/:userId/xp', authenticate, profileController.updateXP);

export default router;
