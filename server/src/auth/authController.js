const authService = require('./authService');

const register = async (req, res) => {
  const { phone, display_name, email } = req.body;

  if (!phone || String(phone).trim() === '') {
    return res.status(400).json({ ok: false, error: 'phone is required' });
  }
  if (!display_name || String(display_name).trim() === '') {
    return res.status(400).json({ ok: false, error: 'display_name is required' });
  }

  try {
    const { user, roles, token } = await authService.register({ phone, display_name, email });
    res.status(201).json({ ok: true, token, user: { ...user, roles } });
  } catch (err) {
    const status = err.status || 500;
    if (status < 500) return res.status(status).json({ ok: false, error: err.message });
    console.error('[register]', err);
    res.status(500).json({ ok: false, error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  const { phone } = req.body;

  if (!phone || String(phone).trim() === '') {
    return res.status(400).json({ ok: false, error: 'phone is required' });
  }

  try {
    const { user, roles, token } = await authService.login({ phone });
    res.json({ ok: true, token, user: { ...user, roles } });
  } catch (err) {
    const status = err.status || 500;
    if (status < 500) return res.status(status).json({ ok: false, error: err.message });
    console.error('[login]', err);
    res.status(500).json({ ok: false, error: 'Internal server error' });
  }
};

const me = async (req, res) => {
  // req.user is set by authMiddleware
  res.json({ ok: true, user: req.user });
};

module.exports = { register, login, me };
