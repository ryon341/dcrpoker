'use strict';

const { Router } = require('express');
const authMiddleware = require('../auth/authMiddleware');
const {
  createContact,
  listContacts,
  getContact,
  updateContact,
  bulkCreateContacts,
} = require('../controllers/hostContactsController');

const router = Router();

router.use(authMiddleware);

router.post('/bulk', bulkCreateContacts);
router.post('/',    createContact);
router.get('/',     listContacts);
router.get('/:id',  getContact);
router.patch('/:id', updateContact);

module.exports = router;
