'use strict';

const { Router } = require('express');
const authMiddleware = require('../auth/authMiddleware');
const { searchPlayers } = require('../controllers/playerSearchController');

const router = Router();

router.get('/', authMiddleware, searchPlayers);

module.exports = router;
