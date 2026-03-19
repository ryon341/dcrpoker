const { Router } = require('express');
const { listUsers, getUser, getUserInvites } = require('../controllers/usersController');

const router = Router();

router.get('/users',                listUsers);
router.get('/users/:id',            getUser);
router.get('/users/:userId/invites', getUserInvites);

module.exports = router;
