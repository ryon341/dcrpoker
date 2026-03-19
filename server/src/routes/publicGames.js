'use strict';

const express = require('express');
const router  = express.Router();
const authMiddleware = require('../auth/authMiddleware');
const {
  listPublicGames, getPublicGame,
  adminListVenues, adminCreateVenue, adminUpdateVenue,
  adminListGames, adminCreateGame, adminUpdateGame,
  requireAdmin,
} = require('../controllers/publicGamesController');

// Public read routes (no auth needed)
router.get('/',    listPublicGames);
router.get('/:id', getPublicGame);

// Admin routes
router.use('/admin', authMiddleware, requireAdmin);
router.get('/admin/venues',       adminListVenues);
router.post('/admin/venues',      adminCreateVenue);
router.patch('/admin/venues/:id', adminUpdateVenue);
router.get('/admin/games',        adminListGames);
router.post('/admin/games',       adminCreateGame);
router.patch('/admin/games/:id',  adminUpdateGame);

module.exports = router;
