'use strict';

const express = require('express');
const router  = express.Router();
const authMiddleware = require('../auth/authMiddleware');
const {
  postSession,
  getSessions,
  getSession,
  patchSession,
  destroySession,
  postAdjustment,
  getAdjustments,
  getSummary,
  getTrends,
} = require('../controllers/bankrollController');

router.use(authMiddleware);

router.get('/summary',           getSummary);
router.get('/trends',            getTrends);
router.get('/sessions',          getSessions);
router.post('/sessions',         postSession);
router.get('/sessions/:id',      getSession);
router.patch('/sessions/:id',    patchSession);
router.delete('/sessions/:id',   destroySession);
router.get('/adjustments',       getAdjustments);
router.post('/adjustments',      postAdjustment);

module.exports = router;
