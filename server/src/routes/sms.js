'use strict';

const { Router } = require('express');
const authMiddleware = require('../auth/authMiddleware');
const { usageLimitMiddleware } = require('../middleware/usageLimit');
const { requirePlanFeature } = require('../middleware/featureGate');
const { sendBatch } = require('../controllers/smsController');

const router = Router();

// All SMS routes require auth + Level 2+ plan
router.post('/send', authMiddleware, requirePlanFeature('sms_send'), usageLimitMiddleware, sendBatch);

module.exports = router;
