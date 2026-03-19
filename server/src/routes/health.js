const { Router } = require('express');

const router = Router();

router.get('/health', (req, res) => {
  res.json({ ok: true, app: 'dcrpoker-api' });
});

module.exports = router;
