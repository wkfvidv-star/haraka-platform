import express from 'express';
import { login, register, refresh, setupMfa, verifyMfaSetup } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);

// Phase 9: MFA Setup endpoints (Require authentication before full MFA is verified)
router.get('/mfa/setup', authenticate, setupMfa);
router.post('/mfa/verify', authenticate, verifyMfaSetup);

export default router;
