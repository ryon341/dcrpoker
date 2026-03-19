const { Router } = require('express');
const pool = require('../config/db');

const router = Router();

router.get('/db-health', async (req, res) => {
  try {
    await pool.query('SELECT 1 AS ok');
    res.json({ ok: true, database: 'connected' });
  } catch (err) {
    console.error('[db-health] Query failed:', err.message);
    res.status(503).json({ ok: false, database: 'disconnected' });
  }
});

module.exports = router;
