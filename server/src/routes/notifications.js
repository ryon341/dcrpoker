'use strict';

const express = require('express');
const router  = express.Router();
const authMiddleware = require('../auth/authMiddleware');
const { listNotifications, markRead, markAllRead } = require('../controllers/notificationsController');

router.use(authMiddleware);

router.get('/',              listNotifications);
router.patch('/read-all',    markAllRead);
router.patch('/:id/read',    markRead);

module.exports = router;
