const { Router } = require('express');
const { getHostPlayers } = require('../controllers/hostsController');

const router = Router();

router.get('/hosts/:hostUserId/players', getHostPlayers);

module.exports = router;
