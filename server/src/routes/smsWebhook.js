'use strict';

const express = require('express');
const { handleInboundSms } = require('../controllers/smsWebhookController');

const router = express.Router();

// Twilio sends form-encoded bodies — parse before hitting the controller
router.post('/sms', express.urlencoded({ extended: false }), handleInboundSms);

module.exports = router;
