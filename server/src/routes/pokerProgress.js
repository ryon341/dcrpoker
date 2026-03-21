const { Router } = require('express');
const authMiddleware = require('../auth/authMiddleware');
const {
  getProgress,
  saveProgress,
  getDailyProgress,
  saveDailyProgress,
} = require('../controllers/pokerProgressController');

const router = Router();

router.get('/progress',         authMiddleware, getProgress);
router.post('/progress',        authMiddleware, saveProgress);
router.get('/daily',            authMiddleware, getDailyProgress);
router.post('/daily',           authMiddleware, saveDailyProgress);

module.exports = router;
