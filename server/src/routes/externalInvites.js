'use strict';

const { Router } = require('express');
const authMiddleware = require('../auth/authMiddleware');
const {
  createInvite,
  listInvites,
  getInvite,
  getInvitePreview,
  acceptInvite,
} = require('../controllers/externalInvitesController');

const router = Router();

// Protected management routes
router.use(authMiddleware);
router.post('/',    createInvite);
router.get('/',     listInvites);
router.get('/:id',  getInvite);

module.exports = router;
