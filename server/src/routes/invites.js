'use strict';

const { Router } = require('express');
const authMiddleware = require('../auth/authMiddleware');
const { getInvitePreview, acceptInvite } = require('../controllers/externalInvitesController');

const router = Router();

// Public — anyone can preview an invite by code
router.get('/:inviteCode', getInvitePreview);

// Auth required — accept the invite (links the authed user)
router.post('/:inviteCode/accept', authMiddleware, acceptInvite);

module.exports = router;
