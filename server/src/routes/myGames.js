'use strict';

const { Router } = require('express');
const authMiddleware = require('../auth/authMiddleware');
const {
  createGame,
  listMyGames,
  getMyGame,
  updateMyGame,
  invitePlayer,
  inviteFromHostList,
  listGameInvites,
  cancelInvite,
  addPlayerToGame,
  listGameRsvps,
  updateRsvp,
  assignSeat,
  clearSeat,
  promoteWaitlist,
  reorderWaitlist,
} = require('../controllers/myGamesController');

const { requirePlanFeature } = require('../middleware/featureGate');

const router = Router();

router.use(authMiddleware);

router.post('/',   createGame);
router.get('/',    listMyGames);
router.get('/:id', getMyGame);
router.patch('/:id', updateMyGame);

// More specific sub-route first to avoid ambiguity
router.post('/:id/invites/from-host-list', inviteFromHostList);
router.post('/:id/invites',                invitePlayer);
router.get('/:id/invites',                 listGameInvites);

router.patch('/:gameId/invites/:inviteId', cancelInvite);

router.post('/:id/add-player', addPlayerToGame);

const seatGate = requirePlanFeature('seat_tools');

router.get('/:id/rsvps',             seatGate, listGameRsvps);
router.patch('/:id/rsvps/:inviteId', seatGate, updateRsvp);
router.post('/:id/assign-seat',      seatGate, assignSeat);
router.post('/:id/clear-seat',       seatGate, clearSeat);
router.post('/:id/promote-waitlist', seatGate, promoteWaitlist);
router.post('/:id/reorder-waitlist', seatGate, reorderWaitlist);

module.exports = router;
