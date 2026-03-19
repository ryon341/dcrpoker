'use strict';

const express = require('express');
const router  = express.Router();
const authMiddleware = require('../auth/authMiddleware');
const { getCredits, testGrantCredit } = require('../controllers/creditsController');

router.use(authMiddleware);

router.get('/',             getCredits);
router.post('/test-grant',  testGrantCredit);

module.exports = router;
