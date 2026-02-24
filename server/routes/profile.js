import express from 'express';
import * as profileController from '../controllers/profileController.js';

const router = express.Router();

router.get('/:userId', profileController.getProfile);
router.put('/:userId', profileController.updateProfile);

export default router;
