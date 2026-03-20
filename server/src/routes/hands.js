'use strict';

const express = require('express');
const router  = express.Router();
const authMiddleware = require('../auth/authMiddleware');
const { postHand, getHands, getHand, putHand, destroyHand } = require('../controllers/handsController');

router.use(authMiddleware);

router.get('/',     getHands);
router.post('/',    postHand);
router.get('/:id',  getHand);
router.patch('/:id', putHand);
router.delete('/:id', destroyHand);

module.exports = router;
