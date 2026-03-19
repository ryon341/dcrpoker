'use strict';

const { Router } = require('express');
const authMiddleware = require('../auth/authMiddleware');
const {
  listTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
} = require('../controllers/messageTemplatesController');

const router = Router();

router.use(authMiddleware);

router.get('/',    listTemplates);
router.post('/',   createTemplate);
router.get('/:id', getTemplate);
router.patch('/:id', updateTemplate);

module.exports = router;
