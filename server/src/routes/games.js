const { Router } = require('express');
const { listGames, getGame, getGameInvites } = require('../controllers/gamesController');

const router = Router();

router.get('/games',                  listGames);
router.get('/games/:id',              getGame);
router.get('/games/:gameId/invites',  getGameInvites);

module.exports = router;
