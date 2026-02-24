import express from 'express';
import { verifyQR, remoteApproval, getAccessLogs } from '../controllers/accessController.js';

const router = express.Router();

router.post('/verify-qr', verifyQR);
router.post('/remote-approval', remoteApproval);
router.get('/logs', getAccessLogs);

export default router;
