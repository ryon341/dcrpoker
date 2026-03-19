'use strict';

const express = require('express');
const router  = express.Router();

const { handlePaypalWebhook } = require('../controllers/paypalWebhookController');

// Public — no JWT.  PayPal signs requests with PAYPAL_WEBHOOK_ID.
router.post('/', handlePaypalWebhook);

module.exports = router;
