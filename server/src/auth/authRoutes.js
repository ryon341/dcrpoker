const { Router } = require('express');
const { register, login, me } = require('./authController');
const authMiddleware = require('./authMiddleware');

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login',    login);
router.get('/auth/me',        authMiddleware, me);

module.exports = router;
