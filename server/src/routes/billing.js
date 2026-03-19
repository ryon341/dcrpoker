'use strict';

const express = require('express');
const router  = express.Router();

const authMiddleware = require('../auth/authMiddleware');
const { getBillingStatus, createSubscriptionCheckout, cancelCurrentSubscription, getOverage } =
  require('../controllers/billingController');

router.use(authMiddleware);

router.get('/',           getBillingStatus);
router.get('/overage',    getOverage);
router.post('/subscribe', createSubscriptionCheckout);
router.post('/cancel',    cancelCurrentSubscription);

module.exports = router;
