const { Router } = require('express');
const authMiddleware = require('../auth/authMiddleware');
const { getStats, getGameStats, submitResult } = require('../controllers/arcadeController');

const router = Router();

router.get('/stats',      authMiddleware, getStats);
router.get('/stats/:gameId', authMiddleware, getGameStats);
router.post('/submit',    authMiddleware, submitResult);

module.exports = router;
