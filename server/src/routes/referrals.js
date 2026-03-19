'use strict';

const express = require('express');
const router  = express.Router();
const authMiddleware = require('../auth/authMiddleware');
const { getReferrals, applyReferral } = require('../controllers/referralsController');

router.use(authMiddleware);

router.get('/',       getReferrals);
router.post('/apply', applyReferral);

module.exports = router;
