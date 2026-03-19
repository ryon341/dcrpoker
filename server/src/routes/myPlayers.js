'use strict';

const { Router } = require('express');
const authMiddleware = require('../auth/authMiddleware');
const { addPlayer, listMyPlayers } = require('../controllers/hostPlayersController');

const router = Router();

router.use(authMiddleware);

router.post('/', addPlayer);
router.get('/',  listMyPlayers);

module.exports = router;
