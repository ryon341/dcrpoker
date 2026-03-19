/**
 * Send a consistent JSON response.
 */
const ok = (res, data, status = 200) => res.status(status).json({ ok: true, data });
const notFound = (res, msg = 'Not found') => res.status(404).json({ ok: false, error: msg });
const badRequest = (res, msg = 'Bad request') => res.status(400).json({ ok: false, error: msg });
const serverError = (res, err) => {
  console.error(err);
  res.status(500).json({ ok: false, error: 'Internal server error' });
};

module.exports = { ok, notFound, badRequest, serverError };
